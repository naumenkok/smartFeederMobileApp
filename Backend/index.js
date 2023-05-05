const express = require('express');
const sqlite3 = require('sqlite3');
const schedule = require('node-schedule');
const app = express();
const PORT = 8080;
const SIM_PORT = 8888;
const path = require('path');
const axios = require('axios');
const { start } = require('repl');
app.use(express.json());

var checkFoodOpen = false;
var checkWaterOpen = false;
var foodLevel = 0;
var waterLevel = 0;
var waterLowLimit = 20;
var waterHighLimit = 80;
var lastCheckedFoodLevel = 0;
var batteryLevel = 100;
var lastSetFoodLevel;
var currentDiet;
// Poziomy których nie można nigdy przekroczyć (user powinien mieć blokade ustawiania jedzenia ponad ten poziom)
// aktualne 200 to tylko placeholdery
const waterDangerLimit = 200;
const foodDangerLimit = 200;

var db = new sqlite3.Database('./karmnik.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("Database connected")
    console.log(`----------------------`);
});

app.listen(
    PORT,
    () => console.log(`listening on port ${PORT}`)
)

app.get('/debug.html', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, 'debug.html'));
});

app.get('/debug.js', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, 'debug.js'));
});

app.get('/', (req,res) => {
    res.status(200).send({message: "ok"});
});

app.get('/getSimStatus', (req,res) => {
    res.status(200).json({
        food: foodLevel,
        water: waterLevel,
        foodOpen: String(checkFoodOpen),
        waterOpen: String(checkWaterOpen),
        battery: batteryLevel
    });
});

app.get('/getCurrentDiet', (req,res) => {
  const jsonCurrentDiet = {
    times: [],
    amounts: []
  };
  
  for (const [key, value] of currentDiet) {
    jsonCurrentDiet.times.push(key);
    jsonCurrentDiet.amounts.push(value);
  }

  res.status(200).json(jsonCurrentDiet);
});

app.post('/postNewDiet', async (req,res) => {
  const { times, amounts } = req.body;

  const newDiet = new Map();
  times.forEach((time, i) => {
    newDiet.set(time.padStart(5, '0'), amounts[i]);
  });

  await saveNewDietToDatabase(newDiet);
  currentDiet = newDiet;
  reloadSchedule();
  res.status(200).send("Updated diet succesfully");
});

app.get('/forceReloadSchedule', (req,res) => {
  reloadSchedule();
  res.status(200).send();
});

app.post('/openFood', (req, res) => {
    openFood();
    res.status(200).send();
});

app.post('/closeFood', (req, res) => {
    closeFood();
    res.status(200).send();
});

app.post('/openWater', (req, res) => {
    openWater();
    res.status(200).send();
});

app.post('/closeWater', (req, res) => {
    closeWater();
    res.status(200).send();
});

app.post('/newFoodLevel', (req, res) => {
    var parcel = req.body;
    fillFood(parseInt(parcel.newLevel));
    res.status(200).send();
});

app.get('/getAmountInDate', async (req, res) => {
  const totalAmount = await selectAmountInDate(req.body.date);
  res.status(200).send({ message: totalAmount });
});

app.get('/getEatHistoryInDate', async (req, res) => {
  const rows = await selectEatHistoryInDate(req.body.date);
  const times = [];
  const amounts = [];
  rows.forEach(function(row) {
    times.push(row.time);
    amounts.push(row.amount);
  });
  const data = {
    times: times,
    amounts: amounts
  };
  res.status(200).json(data);
});

app.get('/getFillHistoryInDate', async (req, res) => {
  const rows = await selectFillHistoryInDate(req.body.date);
  const levelWhenStarted = [];
  const setLevel = [];
  const time = [];
  rows.forEach(function(row) {
    time.push(row.time);
    setLevel.push(row.setLevel);
    levelWhenStarted.push(row.levelWhenStarted);
  });
  const data = {
    tims: time,
    setLevel: setLevel,
    levelWhenStarted: levelWhenStarted
  };
  res.status(200).json(data);
});



async function openFood(){
    const res_sim = axios.post(`http://localhost:${SIM_PORT}/openFood`);
    checkFoodOpen = true;
}

async function closeFood(){
    const res_sim = axios.post(`http://localhost:${SIM_PORT}/closeFood`);
    checkFoodOpen = false;
}

async function openWater(){
    const res_sim = axios.post(`http://localhost:${SIM_PORT}/openWater`);
    checkWaterOpen = true;
}

async function closeWater(){
    const res_sim = axios.post(`http://localhost:${SIM_PORT}/closeWater`);
    checkWaterOpen = false;
}

async function getSimStatus(){
    const res = await axios.get(`http://localhost:${SIM_PORT}/getSimStatus`);
    foodLevel = res.data.food;
    waterLevel = res.data.water;
    checkFoodOpen = (res.data.foodOpen === "true");
    checkWaterOpen = (res.data.waterOpen === "true");
    batteryLevel = res.data.battery;
}

async function checkKarmnikHealth(){
  if (batteryLevel < 5){
    shutDown();
  }
}

async function checkSafety(){
  if (waterLevel > waterDangerLimit){
    closeWater();
  }
  if (foodLevel > foodDangerLimit){
    closeWater();
  }
}

async function fillFood(newLevel){
    if (newLevel > foodLevel){
        openFood();
    }
    else {
        return
    }
    console.log(`Filling food to: ${newLevel}`)
    lastSetFoodLevel = newLevel;
    intervalFillFood = setInterval(checkFoodFillUpperLimit, 1000);
}

async function keepWater(){
    if (waterLevel < waterLowLimit){
        openWater();
    }
    else if (waterLevel > waterHighLimit){
        closeWater();
    }
}

async function checkFoodFillUpperLimit(){
    if (foodLevel > lastSetFoodLevel){
        closeFood();
        clearInterval(intervalFillFood);
    }
}

async function startUp(){
  // wczytanie ilosci jedzania w misce przy uruchomieniu
  const timeoutStartFoodAmount = setTimeout(() => {
    lastCheckedFoodLevel = foodLevel;
    console.log(`Set start food amount at: ${lastCheckedFoodLevel}`);
    console.log(`----------------------`);
  }, 2000);
  // wczytanie planu z bazy na start
  currentDiet = await readCurrentDietFromDatabase();
  reloadSchedule();
}


function shutDown(){
  console.log('good bye')
  // TO DO
}

// Odpala sie przy wychodzeniu Ctrl + C
process.on('SIGINT', function() {
  shutDown();
  process.exit();
});

function reloadSchedule(){
  // cancel all jobs
  for (const jobId in schedule.scheduledJobs) {
    schedule.cancelJob(schedule.scheduledJobs[jobId]);
  }

  // Loop through the list and schedule a job for each time
  currentDiet.forEach((amount, time) => {
    const rule = new schedule.RecurrenceRule();
    const [hours_temp_str, minutes_temp_str] = time.split(":");
    rule.hour = parseInt(hours_temp_str);
    rule.minute = parseInt(minutes_temp_str);

    schedule.scheduleJob(rule, function() {
      insertEatHistory(lastCheckedFoodLevel - foodLevel, time);
      insertFillFood(amount, foodLevel, time);
      lastCheckedFoodLevel = foodLevel;
      fillFood(amount);
    });
  });

  // sprawdzanie jedzenia o polnocy dla statystyk
  schedule.scheduleJob('59 23 * * *', function() {
    insertEatHistory(lastCheckedFoodLevel - foodLevel, "23:59");
    lastCheckedFoodLevel = foodLevel;
  });

  // print jobow ktore sa w schedule
  console.log(`Updating schedule to:`);
  for (let jobName in schedule.scheduledJobs) {
    const job = schedule.scheduledJobs[jobName];
    console.log(`Job name: ${jobName}`);
    console.log(`Next run time: ${job.nextInvocation()}`);
    console.log(`Job function: ${job.job.toString()}`);
    console.log('-------------------------');
  }
}

// time - czas kiedy wstawiono rekord - beda one wstawiane przy uzupelnianiu miski + o polnocy
// wtedy amount to bedzie ilosc karmy zjedzona do czasu "time" ktory teraz podajemy od ostatniego
// czasu w kolumnie time widzianego w tabeli np. 1 posilek o 6 to amount odwoluje sie ile ubylo z miski 
// miedzy polnoca a 6 rano. Kolejny o 12 to amount bedzie od 6 rano do 12 itd. potem jak wybije polnoc
// to bedzie to czas od ostatniego posilku tego dnia to polnocy
// time syntax - text "HH:MM"
async function insertEatHistory(amount, time){
  const date = new Date().toISOString().split('T')[0];
  
  db.run(`INSERT INTO eatHistory(date, time, amount) VALUES (?, ?, ?)`, date, time, amount, function(err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(`A row has been inserted into EatHistory with rowid ${this.lastID} and data time: ${time}, amount${amount}`);
    }
  });
}

async function insertFillFood(newLevel, curFoodLevel, time){
  const date = new Date().toISOString().split('T')[0];
  // const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  db.run(`INSERT INTO fillHistory(levelWhenStarted, setLevel, time, date) VALUES (?, ?, ?, ?)`, curFoodLevel, newLevel, time, date, function(err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(`A row has been inserted into fillHistory with rowid ${this.lastID} and time:${time},date:${date}, levelWhenStart:${curFoodLevel}, setLevel:${newLevel}`);
    }
  });
}

async function readCurrentDietFromDatabase() {
  return new Promise((resolve, reject) => {
    const currentDietMap = new Map();
    db.all('SELECT time, amount FROM currentDiet ORDER BY time ASC', function(err, rows) {
      if (err) {
        reject(err);
      }
      else {
        rows.forEach(function(row) {
          currentDietMap.set(row.time, row.amount);
        });
        console.log(`Read current diet`);
        console.log(currentDietMap);
        console.log(`----------------------`);
        resolve(currentDietMap);
      }
    });
  });
}

async function selectAmountInDate(date) {
  return new Promise((resolve, reject) => {
    // Execute the SELECT query
    db.get('SELECT SUM(amount) as totalAmount FROM eatHistory WHERE date LIKE ?', [date], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.totalAmount);
      }
    });
  });
}

async function selectEatHistoryInDate(date) {
  return new Promise((resolve, reject) => {
    // Execute the SELECT query
    db.all('SELECT time, amount FROM eatHistory WHERE date LIKE ? ORDER BY time ASC', [date], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function selectFillHistoryInDate(date) {
  return new Promise((resolve, reject) => {
    // Execute the SELECT query
    db.all('SELECT levelWhenStarted, setLevel, time FROM fillHistory WHERE date LIKE ? ORDER BY time ASC', [date], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// newDiet - map - key: String Time HH:MM ; value: Integer Amount 
async function saveNewDietToDatabase(newDiet){
  clearCurrentDiet();
  const stmt = db.prepare(`INSERT INTO currentDiet (time, amount) VALUES (?, ?)`);

  for (const [time, amount] of newDiet) {
    await new Promise((resolve, reject) => {
      stmt.run(time, amount, function(err) {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    });
  }

  stmt.finalize();
  console.log(`Saved new diet`);
  console.log(newDiet)
  console.log(`----------------------`);
}

function clearCurrentDiet() {
    db.run(`DELETE FROM currentDiet`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`All rows have been deleted from the currentDiet table`);
      }
    });
}

// Odpalanie funkcji co dany kwant czasu
const intervalGetSimStatus = setInterval(getSimStatus, 1000);
const intervalSafety = setInterval(checkSafety, 1000);
const intervalKeepWater = setInterval(keepWater, 1000);
const intervalGetKarmnikHealth = setInterval(checkKarmnikHealth, 60000);
var intervalFillFood;

// Odpalanie funkcji startowych
startUp();