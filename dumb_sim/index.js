const { randomInt } = require('crypto');
const express = require('express');
const app = express();
const BACKEND_PORT = 8080;
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


async function UpdateSimStatus(){
    foodLevel = foodLevel + (checkFoodOpen ? 5 : -2);
    if (foodLevel < 0) foodLevel = 0;
    waterLevel = waterLevel + (checkWaterOpen ? 5 : -2);
    if (waterLevel < 0) waterLevel = 0;
}

// Odpalanie funkcji co dany kwant czasu
setInterval(UpdateSimStatus, 1000);
