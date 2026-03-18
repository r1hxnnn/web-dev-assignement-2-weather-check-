const apiKey = "bbdff7a05434ef3bc266b03d10110d50";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");

console.log("Script loaded");

/* EVENT LISTENER */

searchBtn.addEventListener("click", () => {

console.log("Search button clicked");

const city = cityInput.value.trim();

if(city === ""){
alert("Please enter a city name");
return;
}

getWeather(city);

});


/* MAIN WEATHER FUNCTION */

async function getWeather(city){

console.log("Function start");
console.log("Before fetch");

try{

const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
);

console.log("After fetch response received");

if(!response.ok){
throw new Error("City not found");
}

const data = await response.json();

console.log("JSON parsed");

displayWeather(data);
saveCity(city);

}catch(error){

console.log("Error caught:",error);

weatherResult.innerHTML =
`<p style="color:red;">${error.message}</p>`;

}

console.log("Function end");

}


/* DISPLAY WEATHER */

function displayWeather(data){

const icon = data.weather[0].icon;

weatherResult.innerHTML = `
<h2>${data.name}</h2>
<img src="https://openweathermap.org/img/wn/${icon}@2x.png">
<p><strong>${data.main.temp} °C</strong></p>
<p>${data.weather[0].description}</p>
<p>Humidity: ${data.main.humidity}%</p>
`;

}


/* LOCAL STORAGE */

function saveCity(city){

let cities = JSON.parse(localStorage.getItem("cities")) || [];

if(!cities.includes(city)){

cities.push(city);

localStorage.setItem("cities",JSON.stringify(cities));

}

loadHistory();

}


/* LOAD HISTORY */

function loadHistory(){

let cities = JSON.parse(localStorage.getItem("cities")) || [];

historyList.innerHTML="";

cities.forEach((city,index)=>{

const li = document.createElement("li");

li.innerHTML = `
<span class="city-name">${city}</span>
<button class="delete-btn">✖</button>
`;

li.querySelector(".city-name").onclick = ()=>{
getWeather(city);
};

li.querySelector(".delete-btn").onclick = ()=>{

cities.splice(index,1);

localStorage.setItem("cities",JSON.stringify(cities));

loadHistory();

};

historyList.appendChild(li);

});

}


/* PROMISE VERSION (.then / .catch) */

function getWeatherThen(city){

console.log("Using promise style");

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)

.then(response => {

if(!response.ok){
throw new Error("City not found");
}

return response.json();

})

.then(data => displayWeather(data))

.catch(error => console.log("Promise error:",error));

}


/* LOAD HISTORY WHEN PAGE LOADS */

window.onload = function(){

console.log("Page loaded");

loadHistory();

};
document.getElementById("clearHistory").addEventListener("click", function(){

localStorage.removeItem("cities");

loadHistory();

});