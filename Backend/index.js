const express = require('express');
const sqlite3 = require('sqlite3');
const schedule = require('node-schedule');
const app = express();
const PORT = 8080;
const path = require('path');
const axios = require('axios');
const { start } = require('repl');
app.use(express.json());

var checkFoodOpen = false;
var checkWaterOpen = false;
var foodLevel = 0;
var waterLevel = 0;
var containerWaterLevel = 2000;
var containerFoodLevel = 2000;
var waterLowLimit = 100;
var waterHighLimit = 400;
var lastCheckedFoodLevel = 0;
var lastCheckedFoodTime;
var batteryLevel = 100;
var checkCharging = true;
var lastSetFoodLevel;
var currentDiet;
var userInputFoodStartLevel;
var userID = 1;
const karmnikHealth = {
  lowWaterContainerSend: false,
  lowFoodContainerSend: false,
  lowBatterySend: false,
  // zakodowane stale ponizej ktorych jest powiadmoenie jak jest za malo w kontenerach wody/jedzenia
  foodContainerWarningLevel: 500,
  waterContainerWarningLevel: 500,
  batteryLevelWarningLimit: 15
}
// Poziomy których nie można nigdy przekroczyć (user powinien mieć blokade ustawiania jedzenia ponad ten poziom)
// aktualne 200 to tylko placeholdery
const waterDangerLimit = 500;
const foodDangerLimit = 500;

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
        containerFood: containerFoodLevel,
        containerWater: containerWaterLevel,
        foodOpen: checkFoodOpen,
        waterOpen: checkWaterOpen,
        battery: batteryLevel,
        charging: checkCharging
    });
});

app.get('/getSimStatusFull', (req,res) => {
  res.status(200).json({
      food: foodLevel,
      water: waterLevel,
      containerFood: containerFoodLevel,
      containerWater: containerWaterLevel,
      foodOpen: checkFoodOpen,
      waterOpen: checkWaterOpen,
      battery: batteryLevel,
      charging: checkCharging,
      lastCheckedFoodLevel: lastCheckedFoodLevel,
      lastCheckedFoodTime: lastCheckedFoodTime,
      lastSetFoodLevel: lastSetFoodLevel
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
  try{
    const newDiet_temp = new Map();
    times.forEach((time, i) => {
      newDiet_temp.set(time.padStart(5, '0'), amounts[i]);
      if(amounts[i] > foodDangerLimit){
        throw new Error("Amount of food in diet is above danger limit");
      } 
    });
    const newDiet = new Map([...newDiet_temp].sort());

    await saveNewDietToDatabase(newDiet);
    currentDiet = newDiet;
    reloadSchedule();
    res.status(200).send("Updated diet succesfully");
  }
  catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/forceReloadSchedule', (req,res) => {
  reloadSchedule();
  res.status(200).send();
});

// te posty 5 to bardziej do debugu starego, aktualnie nie uzywane bo karmnik ma sam pilnowac sobie kiedy otwierac/zamykac
app.post('/openFood', (req, res) => {
  if(foodLevel > foodDangerLimit){
    res.status(400).send();
  }
  else{
    openFood();
    res.status(200).send();
  }
});

app.post('/closeFood', (req, res) => {
    closeFood();
    res.status(200).send();
});

app.post('/openWater', (req, res) => {
  if(waterLevel > waterDangerLimit){
    res.status(400).send();
  }
  else{
    openWater();
    res.status(200).send();
  }
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

app.post('/addContainerFood', (req, res) => {
  var amount = parseInt(req.query.amount);
  containerFoodLevel += amount;
  res.status(200).send();
});

app.post('/removeContainerFood', (req, res) => {
  var amount = parseInt(req.query.amount);
  containerFoodLevel -= amount;
  res.status(200).send();
});

app.post('/addContainerWater', (req, res) => {
  var amount = parseInt(req.query.amount);
  containerWaterLevel += amount;
  res.status(200).send();
});

app.post('/removeContainerWater', (req, res) => {
  var amount = parseInt(req.query.amount);
  containerWaterLevel -= amount;
  res.status(200).send();
});

app.post('/addBowlFood', (req, res) => {
  var amount = parseInt(req.query.amount);
  foodLevel += amount;
  res.status(200).send();
});

// kiedy napeplniamy zbiornik ręcznie nalezy wolac te funkcje aby backend wiedzial zeby "doliczyc" to co user da recznie do miski przez guzik z kontenera
app.post('/checkFoodUserInput', (req, res) => {
  if (timeoutFillFoodUser) {
    clearTimeout(timeoutFillFoodUser);
    console.log("RESET")
  }
  else{
    userInputFoodStartLevel = foodLevel;
    console.log(`User input detected, saved last food amount to ${userInputFoodStartLevel}`)
  }

  timeoutFillFoodUser = setTimeout(() => {
    // Timeout callback logic here
    lastCheckedFoodLevel = lastCheckedFoodLevel + (foodLevel - userInputFoodStartLevel)
    console.log(`updated lastCheckedFood to ${lastCheckedFoodLevel} cuz of user input`)
    // After the timeout has completed, reset the timeoutFillFoodUser variable
    timeoutFillFoodUser = undefined;
    userInputFoodStartLevel = undefined;
  }, 10000);
  res.status(200).send();
});

app.post('/removeBowlFood', (req, res) => {
  var amount = parseInt(req.query.amount);
  foodLevel -= amount;
  res.status(200).send();
});

app.post('/addBowlWater', (req, res) => {
  var amount = parseInt(req.query.amount);
  waterLevel += amount;
  res.status(200).send();
});

app.post('/removeBowlWater', (req, res) => {
  var amount = parseInt(req.query.amount);
  waterLevel -= amount;
  res.status(200).send();
});

app.get('/getValveStatus', (req, res) => {
  res.status(200).json({
    foodOpen: checkFoodOpen,
    waterOpen: checkWaterOpen
  });
});

// trzeba tutaj w body wyslac true/false
app.post('/changeChargingStatus', (req, res) => {
  checkCharging = res.body.charging;
  res.status(200).send();
});

app.post('/addBatteryLevel', (req, res) => {
  var amount = parseInt(req.query.amount);
  batteryLevel += amount;
  res.status(200).send();
});

app.post('/removeBatteryLevel', (req, res) => {
  var amount = parseInt(req.query.amount);
  batteryLevel -= amount;
  res.status(200).send();
});

app.post('/testNotification', async (req, res) => {
  var context = req.body.context;
  await insertNotification(context);
  res.status(200).send();
});

// Tutaj troche inaczej to wyslam niz wczesniej wiec xd zeby dobrac sie do pojedynczych powiadomien
// tutaj macie przyklad jak loopy powinny wygladac na jsonie ktory getNotification zwróci
// zwraca tyle notyfikacji max ile dacie w limicie w query
//// Using for...of loop
// for (const notification of jsonData.notifications) {
//   console.log(`ID: ${notification.ID}`);
//   console.log(`User ID: ${notification.user_id}`);
//   console.log(`Date: ${notification.date}`);
//   console.log(`Time: ${notification.time}`);
//   console.log(`Context: ${notification.context}`);
//   console.log('---');
// }

// // Using forEach method
// jsonData.notifications.forEach((notification) => {
//   console.log(`ID: ${notification.ID}`);
//   console.log(`User ID: ${notification.user_id}`);
//   console.log(`Date: ${notification.date}`);
//   console.log(`Time: ${notification.time}`);
//   console.log(`Context: ${notification.context}`);
//   console.log('---');
// });

app.get('/getNotification', async (req, res) => {
  const userID_ = req.query.userID; // Get the user ID from the request parameters
  const limit = req.query.limit;
  updateNotificationStatus(userID_, 0)
  try {
    const notifications = await getNotifications(userID_, limit);

    res.json({ notifications }); // Send the notifications as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving notifications' }); // Send an error response
  }
  res.status(200).send();
});

// to tylk sprawdza czy jakies nowe powiadomienie jest czy go nie ma dla danego userID. nwm czy potrzebne ale mozecie to sprawdzic a potem zapytać
// o 1 powiadmienie najnowsze (limit jako 1) 
app.get('/checkNotificationStatus', async (req, res) => {
  const userID_ = req.query.userID;
  notifStatus = await checkNotificationStatus(userID_);
  console.log(notifStatus);
  if (notifStatus){
    updateNotificationStatus(userID_, 0)
  }
  res.status(200).send(notifStatus);
});

app.post('/registerNewUser', async (req, res) => {
  const { username, password } = req.query;

  try {
    const result = await insertNewUser(username, password);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting user into database');
  }
});

// zwraca ID usera (jak usera nie ma / dał złe dane itd to zwróci 0)
app.get('/checkLogin', async (req, res) => {
  const { username, password } = req.query;

  try {
    const userID = await checkLogin(username, password);
    console.log(userID)
    res.status(200).send(userID.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send('Error checking login');
  }
});

app.post('/changeWaterBowlLimit', (req, res) => {
  const { limitUp, limitDown } = req.query;

  if (!limitUp || !limitDown) {
    res.status(400).json({ message: 'Both limitUp and limitDown query parameters are required' });
    return;
  }

  const parsedLimitUp = parseInt(limitUp);
  const parsedLimitDown = parseInt(limitDown);

  if (isNaN(parsedLimitUp) || isNaN(parsedLimitDown)) {
    res.status(400).json({ message: 'Invalid query parameters: limitUp and limitDown must be integers' });
    return;
  }

  if (parsedLimitDown > parsedLimitUp){
    res.status(400).json({message: "Down > Up. Aborted"});
    return;
  }
  
  if (parsedLimitUp > waterDangerLimit){
    res.status(400).json({message: "Upper limit over safety barrier. Aborted"});
    return;
  }
  
  waterHighLimit = parsedLimitUp;
  waterLowLimit = parsedLimitDown;
  
  res.status(200).json({message: "Limits updated"});
  return;
});


app.get('/getAmountInDate', async (req, res) => {
  const totalAmount = await selectAmountInDate(req.body.date);
  res.status(200).send({ message: totalAmount });
});

app.get('/getEatHistoryInDate', async (req, res) => {
  const rows = await selectEatHistoryInDate(req.query.date);
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
  const rows = await selectFillHistoryInDate(req.query.date);
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

// #cleancode, funkcje troche malo roziwniete po zmianach ale wywalenie ich by wymagalo refaktoringu
async function openFood(){
    checkFoodOpen = true;
}

async function closeFood(){
    checkFoodOpen = false;
}

async function openWater(){
    checkWaterOpen = true;
}

async function closeWater(){
    checkWaterOpen = false;
}

async function checkKarmnikHealth(){
  // Powiadomienie przy spadku baterii ponizej 15%, jezeli go nie wyslalismy jeszcze oraz jezeli urzadzenie sie nie ładuje
  if (batteryLevel <= karmnikHealth.batteryLevelWarningLimit && !karmnikHealth.lowBatterySend && !checkCharging){
    karmnikHealth.lowBatterySend = true;
    insertNotification("Low battery level! Plese plug your karmnik ASAP")
  }
  // wylkaczenie karmnika przy mniej jak 5% baterii HARDCODED
  if (batteryLevel < 5){
    shutDown();
  }
  // reset powiadomienia jezeli je wyslalismy i juz jest 20+%
  if(karmnikHealth.lowBatterySend && batteryLevel >= 20){
    lowBatterySend = false;
  }
  // powiadoienie przy niskim poziomie jedzenia 
  if (containerFoodLevel < karmnikHealth.foodContainerWarningLevel && !karmnikHealth.lowFoodContainerSend){
    karmnikHealth.lowFoodContainerSend = true;
    insertNotification("Low food container level! Plese fill up your karmnik ASAP")
  }
  // reset powiadomienia po napełneniu jedzenia
  if (karmnikHealth.lowFoodContainerSend && containerFoodLevel > karmnikHealth.foodContainerWarningLevel + 100){
    lowFoodContainerSend = false;
  }
  // powiadomienie przy niskim poziomie wody
  if (containerWaterLevel < karmnikHealth.waterContainerWarningLevel && !karmnikHealth.lowWaterContainerSend){
    karmnikHealth.lowFoodContainerSend = true;
    insertNotification("Low water container level! Plese fill up your karmnik ASAP")
  }
  // reset powiadomienia po napełneniu wody
  if (karmnikHealth.lowWaterContainerSend && containerWaterLevel > karmnikHealth.waterContainerWarningLevel + 100){
    lowWaterContainerSend = false;
  }
}

async function checkSafety(){
  if (waterLevel > waterDangerLimit){
    closeWater();
  }
  if (foodLevel > foodDangerLimit){
    closeFood();
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
    intervalFillFood = setInterval(checkFoodFillUpperLimit, 100);
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
    if (foodLevel >= lastSetFoodLevel){
        closeFood();
        lastCheckedFoodLevel = foodLevel;
        clearInterval(intervalFillFood);
    }
}

async function startUp(){
  // wczytanie ilosci jedzania w misce przy uruchomieniu
  const timeoutStartFoodAmount = setTimeout(() => {
    lastCheckedFoodLevel = foodLevel;
    lastCheckedFoodTime = getCurrentTimeFormattedStr();
    console.log(`Set start food amount at: ${lastCheckedFoodLevel} at time: ${getCurrentTimeFormattedStr()}`);
    console.log(`----------------------`);
  }, 2000);
  // wczytanie planu z bazy na start
  currentDiet = await readCurrentDietFromDatabase();

  reloadSchedule();
}


function shutDown(){
  console.log('good bye')
  closeFood();
  closeWater();
  // insertEatHistory(lastCheckedFoodLevel - foodLevel, getCurrentTimeFormattedStr(), lastCheckedFoodTime);
  // TO DO cos jeszcze ?
  process.exit();
}

// Odpala sie przy wychodzeniu Ctrl + C
process.on('SIGINT', function() {
  shutDown();
});

function getCurrentDateFormatedStr() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

function getCurrentTimeFormattedStr() {
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

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
      insertEatHistory(lastCheckedFoodLevel - foodLevel, time, lastCheckedFoodTime);
      insertFillFood(amount, foodLevel, time);
      lastCheckedFoodLevel = foodLevel;
      lastCheckedFoodTime = time;
      fillFood(amount);
    });
  });

  // sprawdzanie jedzenia o polnocy dla statystyk
  schedule.scheduleJob('59 23 * * *', function() {
    insertEatHistory(lastCheckedFoodLevel - foodLevel, "23:59", lastCheckedFoodTime);
    lastCheckedFoodLevel = foodLevel;
    lastCheckedFoodTime = "00:00";
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
async function insertEatHistory(amount, time, startTime){
  const date = getCurrentDateFormatedStr()
  
  db.run(`INSERT INTO eatHistory(date, time, amount, startTime) VALUES (?, ?, ?, ?)`, date, time, amount, startTime, function(err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(`A row has been inserted into EatHistory with rowid ${this.lastID} and data time: ${time}, amount${amount}, startTime${startTime}`);
    }
  });
}

async function insertFillFood(newLevel, curFoodLevel, time){
  const date = getCurrentDateFormatedStr()
  
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

async function insertNewUser(username, password) {
  return new Promise((resolve, reject) => {
    // Prepare the INSERT statement
    const insertStatement = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');

    // Execute the INSERT statement with the provided username and password
    insertStatement.run(username, password, function (err) {
      if (err) {
        if (err.errno === 19) {
          // SQLite error code 19 corresponds to a constraint violation
          // indicating that the username is already in the database
          resolve('User is already registered');
        } else {
          // Handle other database errors
          reject('DB error');
        }
      } else {
        // Insert successful
        resolve('User successfully registered');
      }
    });
  });
}

async function checkLogin(username, password) {
  return new Promise((resolve, reject) => {
    // Replace with your database query to validate the username and password
    // For example:
    const query = `SELECT id FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
      if (err) {
        console.error(err);
        reject(0);
      } else {
        const userId = row ? row.id : 0;
        resolve(userId);
      }
    });
  });
}

async function insertNotification(message) {
  // Przed tym zmiana statusu ze jes tnowa notyfikacja
  await updateNotificationStatus(userID, 1);
  return new Promise((resolve, reject) => {
    try {
      const currentDate = getCurrentDateFormatedStr();
      const currentTime = getCurrentTimeFormattedStr();

      const query = `INSERT INTO notifications (user_id, date, time, context) VALUES (?, ?, ?, ?)`;

      db.run(query, [userID, currentDate, currentTime, message], function (err) {
        if (err) {
          console.error(err);
          reject("db error");
        } else {
          console.log(`New notification inserted with ID: ${this.lastID} and context ${message}`);
          resolve("notification inserted");
        }
      });
    } catch (error) {
      console.error(error);
      reject("db error");
    }
  });
}

async function getNotifications(userID_, limit) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM notifications WHERE user_id = ? ORDER BY date DESC, time DESC LIMIT ${limit}`;

    db.all(query, [userID_], (err, rows) => {
      if (err) {
        console.error(err);
        reject('Error retrieving notifications');
      } else {
        resolve(rows);
      }
    });
  });
}

async function checkNotificationStatus(userID) {
  return new Promise((resolve, reject) => {
    const query = `SELECT newNotification FROM users WHERE id = ?`;

    db.get(query, [userID], (err, row) => {
      if (err) {
        console.error(err);
        reject('Error retrieving new notification status');
      } else {
        const newNotificationStatus = row ? !!row.newNotification : false;
        resolve(newNotificationStatus);
      }
    });
  });
}

async function updateNotificationStatus(userID, newValue) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET newNotification = ? WHERE id = ?`;

    db.run(query, [newValue ? 1 : 0, userID], function (err) {
      if (err) {
        console.error(err);
        reject('Error updating new notification status');
      } else {
        resolve(this.changes);
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
const intervalSafety = setInterval(checkSafety, 1000);
const intervalKeepWater = setInterval(keepWater, 1000);
const intervalGetKarmnikHealth = setInterval(checkKarmnikHealth, 60000);
var intervalFillFood;
var timeoutFillFoodUser;

// Odpalanie funkcji startowych
startUp();
