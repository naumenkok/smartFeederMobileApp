const express = require('express');
const sqlite3 = require('sqlite3');
const schedule = require('node-schedule');
const app = express();
const PORT = 8080;
const SIM_PORT = 8888;
const path = require('path');
const axios = require('axios');
app.use(express.json());

var checkFoodOpen = false;
var checkWaterOpen = false;
var foodLevel = 0;
var waterLevel = 0;
var waterLowLimit = 20;
var waterHighLimit = 80;
var lastCheckedFoodLevel = 0;
var lastSetFoodLevel;
var currentDiet;

var db = new sqlite3.Database('./karmnik.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("Database connected")
    console.log(`----------------------`);
});

// db.run(`CREATE TABLE current_plan(id integer primary key, time integer, amount integer)`);


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
    res.status(200).send({
        food: String(foodLevel),
        water: String(waterLevel),
        foodOpen: String(checkFoodOpen),
        waterOpen: String(checkWaterOpen)
    });
});

app.post('/openFood', (req, res) => {
    openFood();
    res.status(200);
});

app.post('/closeFood', (req, res) => {
    closeFood();
    res.status(200);
});

app.post('/openWater', (req, res) => {
    openWater();
    res.status(200);
});

app.post('/closeWater', (req, res) => {
    closeWater();
    res.status(200);
});

app.post('/newFoodLevel', (req, res) => {
    var parcel = req.body;
    fillFood(parseInt(parcel.newLevel));
    res.status(200);
});

app.get('/getAmountInDate', async (req, res) => {
  const totalAmount = await selectAmountInDate(req.body.date);
  res.status(200).send({ message: totalAmount });
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
    foodLevel = parseInt(res.data.food);
    waterLevel = parseInt(res.data.water);
    checkFoodOpen = (res.data.foodOpen === "true");
    checkWaterOpen = (res.data.waterOpen === "true");
    keepWater();
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
    intervalFillFood = setInterval(checkFoodUpperLimit, 1000);
}

async function keepWater(){
    if (waterLevel < waterLowLimit){
        openWater();
    }
    else if (waterLevel > waterHighLimit){
        closeWater();
    }
}

async function checkFoodUpperLimit(){
    if (foodLevel > lastSetFoodLevel){
        closeFood();
        clearInterval(intervalFillFood);
    }
}

function getCurTimeInMinutes(){
  const now = new Date();
  return (now.getHours() * 60) + now.getMinutes();
}

function updateSchedule(dietPlan){
  // cancel all jobs
  for (const jobId in schedule.scheduledJobs) {
    schedule.cancelJob(schedule.scheduledJobs[jobId]);
  }

  // Loop through the list and schedule a job for each time
  dietPlan.forEach((amount, time) => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = Math.floor(time / 60);
    rule.minute = time % 60;

    schedule.scheduleJob(rule, function() {
      insertEatHistory(lastCheckedFoodLevel - foodLevel, time);
      lastCheckedFoodLevel = foodLevel;
      fillFood(amount);
    });
  });

  // sprawdzanie jedzenia o polnocy dla statystyk
  schedule.scheduleJob('55 23 * * *', function() {
    insertEatHistory(lastCheckedFoodLevel - foodLevel, 1435);
    lastCheckedFoodLevel = foodLevel;
  });
  console.log(`Updating schedule to:`);

  // print jobow ktore sa w schedule
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
async function insertEatHistory(amount, time){
  const date = new Date().toISOString().split('T')[0];
  
  db.run(`INSERT INTO eatHistory(date, time, amount) VALUES (?, ?, ?)`, date, time, amount, function(err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(`A row has been inserted with rowid ${this.lastID} and data time:${time}, amount${amount}`);
    }
  });
}

async function readCurrentDiet(callback) {
  const currentDietMap = new Map();

  db.all('SELECT time, amount FROM currentDiet ORDER BY time ASC', function(err, rows) {
    if (err) {
      callback(err, null);
    }
    else {
      rows.forEach(function(row) {
        currentDietMap.set(row.time, row.amount);
      });
      console.log(`Read current diet`);
      console.log(currentDietMap);
      console.log(`----------------------`);
      callback(null, currentDietMap);
    }
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

async function saveNewDiet(newDiet){
  clearCurrentDiet();
  const stmt = db.prepare('INSERT INTO currentDiet (time, amount) VALUES (?, ?)');

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
var intervalFillFood;

// Wczytanie z bazy na start
readCurrentDiet(function(err, result) {
    if (err) {
      console.error(err.message);
    }
    else {
      currentDiet = result;
      updateSchedule(currentDiet);
    }
});

// wczytywanie ilosci jedzenia w misce na start
const timeoutStartFoodAmount = setTimeout(() => {
  lastCheckedFoodLevel = foodLevel;
  console.log(`Set start food amount at: ${lastCheckedFoodLevel}`);
  console.log(`----------------------`);
}, 2000);