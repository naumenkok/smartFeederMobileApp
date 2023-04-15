const baseUrl = window.location.origin;
var temp = "";
var spanFoodLevel = document.getElementById("spanFoodLevel");
var spanWaterLevel = document.getElementById("spanWaterLevel");
var divFoodDoor = document.getElementById("divFoodDoor");
var divWaterDoor = document.getElementById("divWaterDoor");
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
    spanFoodLevel.textContent = parseInt(res.food);
    spanWaterLevel.textContent = parseInt(res.water);
    if (res.foodOpen === "true"){
        divFoodDoor.style.backgroundColor = "green"
    }
    else{
        divFoodDoor.style.backgroundColor = "red"
    }
    if (res.waterOpen === "true"){
        divWaterDoor.style.backgroundColor = "green"
    }
    else{
        divWaterDoor.style.backgroundColor = "red"
    }
}

// Odpalanie funkcji co dany kwant czasu
setInterval(getSimStatus, 1000);
