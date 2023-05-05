const { randomInt } = require('crypto');
const express = require('express');
const app = express();
const PORT = 8888;
const path = require('path');
app.use(express.json());

checkFoodOpen = false;
checkWaterOpen = false;
foodLevel = 100;
waterLevel = 100;
batteryLevel = 100;

app.listen(
    PORT,
    () => console.log(`listening on port ${PORT}`)
)

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

app.post('/openFood', (req, res) => {
    checkFoodOpen = true;
    res.status(200);
})

app.post('/closeFood', (req, res) => {
    checkFoodOpen = false;
    res.status(200);
})

app.post('/openWater', (req, res) => {
    checkWaterOpen = true;
    res.status(200);
})

app.post('/closeWater', (req, res) => {
    checkWaterOpen = false;
    res.status(200);
})

async function UpdateSimStatus(){
    foodLevel = foodLevel + (checkFoodOpen ? 5 : -2);
    if (foodLevel < 0) foodLevel = 0;
    waterLevel = waterLevel + (checkWaterOpen ? 5 : -2);
    if (waterLevel < 0) waterLevel = 0;
}

// Odpalanie funkcji co dany kwant czasu
setInterval(UpdateSimStatus, 1000);
