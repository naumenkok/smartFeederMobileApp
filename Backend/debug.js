const baseUrl = window.location.origin;
var temp = "";
var spanFoodLevel = document.getElementById("spanFoodLevel");
var spanWaterLevel = document.getElementById("spanWaterLevel");
var spanBatteryLevel = document.getElementById("spanBatteryLevel");
var spanContainerFoodLevel = document.getElementById("spanContainerFoodLevel");
var spanContainerWaterLevel = document.getElementById("spanContainerWaterLevel");
var divFoodDoor = document.getElementById("divFoodDoor");
var divWaterDoor = document.getElementById("divWaterDoor");
var divCharging = document.getElementById("divCharging");
var inputNewLevel = document.getElementById("inputNewLevel");

async function openFood(){
    await postOpenFood();
}

async function closeFood(){
    await postCloseFood();
}

async function openWater(){
    await postOpenWater();
}

async function closeWater(){
    await postCloseWater();
}

async function newLevel(){
    await postNewLevel(inputNewLevel.value);
}

async function postOpenFood() {
    const res = await fetch(baseUrl + "/openFood",
    {   
        method: 'POST',
        headers:{
            "content-Type": 'application/json'
        },
        body: JSON.stringify({})
    })
    console.log(await res.json());
}

async function postCloseFood() {
    const res = await fetch(baseUrl + "/closeFood",
    {   
        method: 'POST',
        headers:{
            "content-Type": 'application/json'
        },
        body: JSON.stringify({})
    })
    console.log(await res.json());
}

async function postOpenWater() {
    const res = await fetch(baseUrl + "/openWater",
    {   
        method: 'POST',
        headers:{
            "content-Type": 'application/json'
        },
        body: JSON.stringify({})
    })
    console.log(await res.json());
}

async function postCloseWater() {
    const res = await fetch(baseUrl + "/closeWater",
    {   
        method: 'POST',
        headers:{
            "content-Type": 'application/json'
        },
        body: JSON.stringify({})
    })
    console.log(await res.json());
}

async function postNewLevel(newLevel_) {
    const res = await fetch(baseUrl + "/newFoodLevel",
    {   
        method: 'POST',
        headers:{
            "content-Type": 'application/json'
        },
        body: JSON.stringify({
            newLevel: newLevel_
        })
    })
}


async function getSimStatus(){
    const res = await (await fetch(baseUrl + "/getSimStatus")).json();
    test = res;
    spanFoodLevel.textContent = res.food;
    spanWaterLevel.textContent = res.water;
    spanContainerFoodLevel.textContent = res.containerFood;
    spanContainerWaterLevel.textContent = res.containerWater;
    spanBatteryLevel.textContent = res.battery;
    if (res.foodOpen){
        divFoodDoor.style.backgroundColor = "green"
    }
    else{
        divFoodDoor.style.backgroundColor = "red"
    }
    if (res.waterOpen){
        divWaterDoor.style.backgroundColor = "green"
    }
    else{
        divWaterDoor.style.backgroundColor = "red"
    }
    if (res.charging){
        divCharging.style.backgroundColor = "green"
    }
    else{
        divCharging.style.backgroundColor = "red"
    }
}

var test;
// Odpalanie funkcji co dany kwant czasu
setInterval(getSimStatus, 1000);
