const express = require('express');
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
var lastSetFoodLevel = 0;


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

// Odpalanie funkcji co dany kwant czasu
const intervalGetSimStatus = setInterval(getSimStatus, 1000);
var intervalFillFood;
