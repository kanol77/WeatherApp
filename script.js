function createSnowflake() {
    const div = document.createElement('div')
    div.classList.add('snowflake')
    div.style.position = 'absolute'
    return div
  }
  
  const width = window.innerWidth
  
  const arrayOfSnowflakes = [...new Array(Math.floor(width / 10)).fill(createSnowflake())]
  
  arrayOfSnowflakes.forEach((item) => {
      if(document.title=="Weather App") item.style.top = `${Math.floor(Math.random() * 100)}vh`;
      else item.style.top = `${Math.floor(Math.random() * 182)}vh`;
      item.style.left = `${Math.floor(Math.random() * 100)}vw`
      item.style.borderRadius = `
      ${Math.floor(Math.random() * 50 + 35)}% 
      ${Math.floor(Math.random() * 50 + 35)}% 
      ${Math.floor(Math.random() * 50 + 35)}% 
      ${Math.floor(Math.random() * 50 + 35)}%`
  
    const time = Math.floor(Math.random() * 5000 + 5000)
    const delay = Math.floor(Math.random() * 20000)
    
    item.style.transition = `${time}ms linear`
    item.style.animation = `fallen ${time}ms linear infinite ${delay}ms`
  
    document.body.insertAdjacentHTML('afterbegin', item.outerHTML)
  })
  
  const snowflakes = document.querySelectorAll('.snowflake')
  
  snowflakes.forEach(item => {
    const time = Math.floor(Math.random() * 5000 + 5000)
    const initialLeft = Number(item.style.left.replace('vw', ''))
    const initialTop = Number(item.style.top.replace('vh', ''))
    
    setInterval(() => {
      item.style.left = `${initialLeft - Math.floor(Math.random() * 5 - 2)}vw`
      item.style.top = `${initialTop - Math.floor(Math.random() * 5 - 2)}vh`
    }, time)
  })


  let API_URL = "https://api.open-meteo.com/v1/forecast?latitude=00.00&longitude=00.00&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,windspeed_10m,soil_temperature_0cm,soil_moisture_0_1cm&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=Europe%2FBerlin";

  let lat;
  let long;

  function getLocation(){
    if(navigator.geolocation) navigator.geolocation.getCurrentPosition(showLocation, errorFunc);
    else{
      alert("Page couldn't read your geographical position :(");
      errorFunc();
    }
  }

  function showLocation(position){
    lat = position.coords.latitude;
    long = position.coords.longitude;
    console.log(lat + " " + long);

    sessionStorage.setItem("latitude", lat);
    sessionStorage.setItem("longitude", long);

    API_URL = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,windspeed_10m,soil_temperature_0cm,soil_moisture_0_1cm&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=Europe%2FBerlin";
    fetchData();
  }

  function errorFunc(){
    alert("Page couldn't read your geographical position :(");

    askForGeo();
  }

  function askForGeo(){
    const modal = document.querySelector('.modal');
    const button = document.querySelector('.button1');
    const latBox = document.querySelector('.lat');
    const longBox = document.querySelector('.long');

    modal.showModal();

    latBox.addEventListener('keydown', e => {
      if(e.keyCode == 32) e.preventDefault();
    })

    longBox.addEventListener('keydown', e => {
      if(e.keyCode == 32) e.preventDefault();
    })

    button.addEventListener('click', () =>{
      if(!isNaN(latBox.value) && !isNaN(longBox.value) && latBox.value.length != 0 && longBox.value.length != 0){
        lat = parseFloat(latBox.value);
        long = parseFloat(longBox.value);

        sessionStorage.setItem("latitude", lat);
        sessionStorage.setItem("longitude", long);

        modal.close();
        console.log(lat + " " + long);
        API_URL = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,windspeed_10m,soil_temperature_0cm,soil_moisture_0_1cm&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=Europe%2FBerlin";
        fetchData();
      }
      else{
        alert("Please fill out all fields with valid numbers!");
      }
    })
  }

  async function fetchData(){
      const response = await fetch(API_URL);

      const dane = await response.json();

      populateWeather(dane);
  }

  function populateWeather(dane){
    const WeatherNow = document.querySelector('.w-now');
    const WeatherDaily = document.querySelector('.w-daily');
    const geoo = document.querySelector('.d-geo');
    const weatherParagraph  = document.createElement('p');
    const geo = document.createElement('p');

    let currentdate = new Date();
    let czas = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " @ ";  

    if(currentdate.getHours() > (-1) && currentdate.getHours() < 10){
      czas = czas + "0" + currentdate.getHours() + ":";
    }
    else{
      czas = czas + currentdate.getHours() + ":";
    }

    if(currentdate.getMinutes() > (-1) && currentdate.getMinutes() < 10){
      czas = czas + "0" + currentdate.getMinutes() + ":";
    }
    else{
      czas = czas + currentdate.getMinutes() + ":";
    }

    if(currentdate.getSeconds() > (-1) && currentdate.getSeconds() < 10){
      czas = czas + "0" + currentdate.getSeconds();
    }
    else{
      czas = czas + currentdate.getSeconds();
    }

    geo.innerText = "Latitude: "+ dane.latitude + "\u00B0 \n Longitude: " + dane.longitude + "\u00B0 \n Date and Time: " + czas + "\n Elevation: " + dane.elevation + "(osl.)";

    geoo.appendChild(geo);

    weatherParagraph.innerText ="Weather Now: \n \n  Temperature: " +dane.current_weather.temperature+dane.daily_units.temperature_2m_max + " \n Windspeed: " + dane.current_weather.windspeed + " km/h \n Wind Direction: " + dane.current_weather.winddirection + "\u00B0 \n";

    let sunnyIcon = document.createElement('img');
    sunnyIcon.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon1 = document.createElement('img');
    sunnyIcon1.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon2 = document.createElement('img');
    sunnyIcon2.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon3 = document.createElement('img');
    sunnyIcon3.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon4 = document.createElement('img');
    sunnyIcon4.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon5 = document.createElement('img');
    sunnyIcon5.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon6 = document.createElement('img');
    sunnyIcon6.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon7 = document.createElement('img');
    sunnyIcon7.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';
    let sunnyIcon8 = document.createElement('img');
    sunnyIcon8.src = 'https://cdn-icons-png.flaticon.com/512/890/890347.png';

    let cloudyIcon = document.createElement('img');
    cloudyIcon.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';

    let cloudyIcon1 = document.createElement('img');
    cloudyIcon1.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';
    let cloudyIcon2 = document.createElement('img');
    cloudyIcon2.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';
    let cloudyIcon3 = document.createElement('img');
    cloudyIcon3.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';
    let cloudyIcon4 = document.createElement('img');
    cloudyIcon4.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';
    let cloudyIcon5 = document.createElement('img');
    cloudyIcon5.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';
    let cloudyIcon6 = document.createElement('img');
    cloudyIcon6.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';
    let cloudyIcon7 = document.createElement('img');
    cloudyIcon7.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';
    let cloudyIcon8 = document.createElement('img');
    cloudyIcon8.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313983.png';

    let windyIcon = document.createElement('img');
    windyIcon.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';

    let windyIcon1 = document.createElement('img');
    windyIcon1.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';
    let windyIcon2 = document.createElement('img');
    windyIcon2.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';
    let windyIcon3 = document.createElement('img');
    windyIcon3.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';
    let windyIcon4 = document.createElement('img');
    windyIcon4.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';
    let windyIcon5 = document.createElement('img');
    windyIcon5.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';
    let windyIcon6 = document.createElement('img');
    windyIcon6.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';
    let windyIcon7 = document.createElement('img');
    windyIcon7.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';
    let windyIcon8 = document.createElement('img');
    windyIcon8.src = 'https://cdn-icons-png.flaticon.com/512/3313/3313989.png';

    let snowyIcon = document.createElement('img');
    snowyIcon.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';

    let snowyIcon1 = document.createElement('img');
    snowyIcon1.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';
    let snowyIcon2 = document.createElement('img');
    snowyIcon2.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';
    let snowyIcon3 = document.createElement('img');
    snowyIcon3.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';
    let snowyIcon4 = document.createElement('img');
    snowyIcon4.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';
    let snowyIcon5 = document.createElement('img');
    snowyIcon5.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';
    let snowyIcon6 = document.createElement('img');
    snowyIcon6.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';
    let snowyIcon7 = document.createElement('img');
    snowyIcon7.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';
    let snowyIcon8 = document.createElement('img');
    snowyIcon8.src = 'https://cdn-icons-png.flaticon.com/512/6359/6359619.png';

    sunnyIcon.classList.add('icons');
    sunnyIcon.classList.add('now-icons');
    sunnyIcon1.classList.add('icons');
    sunnyIcon2.classList.add('icons');
    sunnyIcon3.classList.add('icons');
    sunnyIcon4.classList.add('icons');
    sunnyIcon5.classList.add('icons');
    sunnyIcon6.classList.add('icons');
    sunnyIcon7.classList.add('icons');
    sunnyIcon8.classList.add('icons');

    windyIcon.classList.add('icons');
    windyIcon.classList.add('now-icons');
    windyIcon1.classList.add('icons');
    windyIcon2.classList.add('icons');
    windyIcon3.classList.add('icons');
    windyIcon4.classList.add('icons');
    windyIcon5.classList.add('icons');
    windyIcon6.classList.add('icons');
    windyIcon7.classList.add('icons');
    windyIcon8.classList.add('icons');

    snowyIcon.classList.add('icons');
    snowyIcon.classList.add('now-icons');
    snowyIcon1.classList.add('icons');
    snowyIcon2.classList.add('icons');
    snowyIcon3.classList.add('icons');
    snowyIcon4.classList.add('icons');
    snowyIcon5.classList.add('icons');
    snowyIcon6.classList.add('icons');
    snowyIcon7.classList.add('icons');
    snowyIcon8.classList.add('icons');

    cloudyIcon.classList.add('icons');
    cloudyIcon.classList.add('now-icons');
    cloudyIcon1.classList.add('icons');
    cloudyIcon2.classList.add('icons');
    cloudyIcon3.classList.add('icons');
    cloudyIcon4.classList.add('icons');
    cloudyIcon5.classList.add('icons');
    cloudyIcon6.classList.add('icons');
    cloudyIcon7.classList.add('icons');
    cloudyIcon8.classList.add('icons');

    WeatherNow.appendChild
    (weatherParagraph);

    if(dane.current_weather.windspeed>=25) WeatherNow.appendChild(windyIcon);
    else if(dane.current_weather.temperature>=20) WeatherNow.appendChild(sunnyIcon);
    else if(dane.current_weather.temperature<=0) WeatherNow.appendChild(snowyIcon);
    else WeatherNow.appendChild(cloudyIcon);

    const dayOne = document.createElement('div');
    const dayTwo = document.createElement('div');
    const dayThree = document.createElement('div');
    const dayFour = document.createElement('div');
    const dayFive = document.createElement('div');
    const daySix = document.createElement('div');
    const daySeven = document.createElement('div');

    const oneDate = new Date;
    oneDate.setDate(oneDate.getDate());
    const twoDate = new Date;
    twoDate.setDate(twoDate.getDate()+1);
    const threeDate = new Date;
    threeDate.setDate(threeDate.getDate()+2);
    const fourDate = new Date;
    fourDate.setDate(fourDate.getDate()+3);
    const fiveDate = new Date;
    fiveDate.setDate(fiveDate.getDate()+4);
    const sixDate = new Date;
    sixDate.setDate(sixDate.getDate()+5);
    const sevenDate = new Date;
    sevenDate.setDate(sevenDate.getDate()+6);

    let textOne = document.createElement('p');
    textOne.innerText = "Temperature: " + dane.daily.temperature_2m_max[0] + "\u00B0C \n Windspeed: "+ dane.daily.windspeed_10m_max[0] + " km/h \n Wind Direction: " + dane.daily.winddirection_10m_dominant[0] + "\u00B0 \n Apparent Temp.: " + dane.daily.apparent_temperature_max[0] + "\u00B0C\n Sunrise: " + dane.daily.sunrise[0] + "\n Sunset: " + dane.daily.sunset[0] + "\n \n " + dane.daily.time[0] + "\n \n";

    let textTwo = document.createElement('p');
    textTwo.innerText = "Temperature: " + dane.daily.temperature_2m_max[1] + "\u00B0C \n Windspeed: "+ dane.daily.windspeed_10m_max[1] + " km/h \n Wind Direction: " + dane.daily.winddirection_10m_dominant[1] + "\u00B0 \n Apparent Temp.: " + dane.daily.apparent_temperature_max[1] + "\u00B0C\n Sunrise: " + dane.daily.sunrise[1] + "\n Sunset: " + dane.daily.sunset[1] + "\n \n " + dane.daily.time[1]+ "\n \n";

    let textThree = document.createElement('p');
    textThree.innerText = "Temperature: " + dane.daily.temperature_2m_max[2] + "\u00B0C \n Windspeed: "+ dane.daily.windspeed_10m_max[2] + " km/h \n Wind Direction: " + dane.daily.winddirection_10m_dominant[2] + "\u00B0 \n Apparent Temp.: " + dane.daily.apparent_temperature_max[2] + "\u00B0C\n Sunrise: " + dane.daily.sunrise[2] + "\n Sunset: " + dane.daily.sunset[2] + "\n \n " + dane.daily.time[2]+ "\n \n";

    let textFour = document.createElement('p');
    textFour.innerText = "Temperature: " + dane.daily.temperature_2m_max[3] + "\u00B0C \n Windspeed: "+ dane.daily.windspeed_10m_max[3] + " km/h \n Wind Direction: " + dane.daily.winddirection_10m_dominant[3] + "\u00B0 \n Apparent Temp.: " + dane.daily.apparent_temperature_max[3] + "\u00B0C\n Sunrise: " + dane.daily.sunrise[3] + "\n Sunset: " + dane.daily.sunset[3] + "\n \n " + dane.daily.time[3]+ "\n \n";

    let textFive = document.createElement('p');
    textFive.innerText = "Temperature: " + dane.daily.temperature_2m_max[4] + "\u00B0C \n Windspeed: "+ dane.daily.windspeed_10m_max[4] + " km/h \n Wind Direction: " + dane.daily.winddirection_10m_dominant[4] + "\u00B0 \n Apparent Temp.: " + dane.daily.apparent_temperature_max[4] + "\u00B0C\n Sunrise: " + dane.daily.sunrise[4] + "\n Sunset: " + dane.daily.sunset[4] + "\n \n " + dane.daily.time[4]+ "\n \n";

    let textSix = document.createElement('p');
    textSix.innerText = "Temperature: " + dane.daily.temperature_2m_max[5] + "\u00B0C \n Windspeed: "+ dane.daily.windspeed_10m_max[5] + " km/h \n Wind Direction: " + dane.daily.winddirection_10m_dominant[5] + "\u00B0 \n Apparent Temp.: " + dane.daily.apparent_temperature_max[5] + "\u00B0C\n Sunrise: " + dane.daily.sunrise[5] + "\n Sunset: " + dane.daily.sunset[5] + "\n \n " + dane.daily.time[5]+ "\n \n";

    let textSeven = document.createElement('p');
    textSeven.innerText = "Temperature: " + dane.daily.temperature_2m_max[6] + "\u00B0C \n Windspeed: "+ dane.daily.windspeed_10m_max[6] + " km/h \n Wind Direction: " + dane.daily.winddirection_10m_dominant[6] + "\u00B0 \n Apparent Temp.: " + dane.daily.apparent_temperature_max[6] + "\u00B0C\n Sunrise: " + dane.daily.sunrise[6] + "\n Sunset: " + dane.daily.sunset[6] + "\n \n " + dane.daily.time[6]+ "\n \n";

    if(dane.daily.windspeed_10m_max[0]>=25) textOne.appendChild(windyIcon1);
    else if(dane.daily.temperature_2m_max[0]>=20) textOne.appendChild(sunnyIcon1);
    else if(dane.daily.temperature_2m_max[0]<=0) textOne.appendChild(snowyIcon1);
    else textOne.appendChild(cloudyIcon1);

    if(dane.daily.windspeed_10m_max[1]>=25) textTwo.appendChild(windyIcon2);
    else if(dane.daily.temperature_2m_max[1]>=20) textTwo.appendChild(sunnyIcon2);
    else if(dane.daily.temperature_2m_max[1]<=0) textTwo.appendChild(snowyIcon2);
    else textTwo.appendChild(cloudyIcon2);

    if(dane.daily.windspeed_10m_max[2]>=25) textThree.append(windyIcon3);
    else if(dane.daily.temperature_2m_max[2]>=20) textThree.appendChild(sunnyIcon3);
    else if(dane.daily.temperature_2m_max[2]<=0) textThree.appendChild(snowyIcon3);
    else textThree.appendChild(cloudyIcon3);

    if(dane.daily.windspeed_10m_max[3]>=25) textFour.appendChild(windyIcon4);
    else if(dane.daily.temperature_2m_max[3]>=20) textFour.appendChild(sunnyIcon4);
    else if(dane.daily.temperature_2m_max[3]<=0) textFour.appendChild(snowyIcon4);
    else textFour.appendChild(cloudyIcon4);

    if(dane.daily.windspeed_10m_max[4]>=25) textFive.appendChild(windyIcon5);
    else if(dane.daily.temperature_2m_max[4]>=20) textFive.appendChild(sunnyIcon5);
    else if(dane.daily.temperature_2m_max[4]<=0) textFive.appendChild(snowyIcon5);
    else textFive.appendChild(cloudyIcon5);

    if(dane.daily.windspeed_10m_max[5]>=25) textSix.appendChild(windyIcon6);
    else if(dane.daily.temperature_2m_max[5]>=20) textSix.appendChild(sunnyIcon6);
    else if(dane.daily.temperature_2m_max[5]<=0) textSix.appendChild(snowyIcon6);
    else textSix.appendChild(cloudyIcon6);

    if(dane.daily.windspeed_10m_max[6]>=25) textSeven.appendChild(windyIcon7);
    else if(dane.daily.temperature_2m_max[6]>=20) textSeven.appendChild(sunnyIcon7);
    else if(dane.daily.temperature_2m_max[6]<=0) textSeven.appendChild(snowyIcon7);
    else textSeven.appendChild(cloudyIcon7);

    if(document.title == "Weather App"){
        dayOne.appendChild(textOne);
        dayOne.classList.add('square');
        WeatherDaily.appendChild(dayOne);
        dayOne.addEventListener('click', () => {
          location.href = './Day1.html';
        })
        dayTwo.appendChild(textTwo);
        dayTwo.classList.add('square')
        WeatherDaily.appendChild(dayTwo);
        dayTwo.addEventListener('click', () => {
          location.href = './Day2.html';
        })
        dayThree.appendChild(textThree);
        dayThree.classList.add('square');
        WeatherDaily.appendChild(dayThree);
        dayThree.addEventListener('click', () => {
          location.href = './Day3.html';
        })
        dayFour.appendChild(textFour);
        dayFour.classList.add('square');
        WeatherDaily.appendChild(dayFour);
        dayFour.addEventListener('click', () => {
          location.href = './Day4.html';
        })
        dayFive.appendChild(textFive);
        dayFive.classList.add('square');
        WeatherDaily.appendChild(dayFive);
        dayFive.addEventListener('click', () => {
          location.href = './Day5.html';
        })
        daySix.appendChild(textSix);
        daySix.classList.add('square');
        WeatherDaily.appendChild(daySix);
        daySix.addEventListener('click', () => {
          location.href = './Day6.html';
        })
        daySeven.appendChild(textSeven);
        daySeven.classList.add('square');
        WeatherDaily.appendChild(daySeven);
        daySeven.addEventListener('click', () => {
          location.href = './Day7.html';
        })
    }

    const windNorth = document.createElement('img');
    windNorth.src = "./north.png";
    windNorth.classList.add('compass');

    const windSouth = document.createElement('img');
    windSouth.src = "./south.png";
    windSouth.classList.add('compass');

    const windWest = document.createElement('img');
    windWest.src = "./west.png";
    windWest.classList.add('compass');

    const windEast = document.createElement('img');
    windEast.src = "./east.png";
    windEast.classList.add('compass');

    const windNNE = document.createElement('img');
    windNNE.src = "./1.png";
    windNNE.classList.add('compass');

    const windENE = document.createElement('img');
    windENE.src = "./2.png";
    windENE.classList.add('compass');

    const windESE = document.createElement('img');
    windESE.src = "./3.png";
    windESE.classList.add('compass');

    const windSSE = document.createElement('img');
    windSSE.src = "./4.png";
    windSSE.classList.add('compass');

    const windSSW = document.createElement('img');
    windSSW.src = "./5.png";
    windSSW.classList.add('compass');

    const windWSW = document.createElement('img');
    windWSW.src = "./6.png";
    windWSW.classList.add('compass');

    const windWNW = document.createElement('img');
    windWNW.src = "./7.png";
    windWNW.classList.add('compass');

    const windNNW = document.createElement('img');
    windNNW.src = "./8.png";
    windNNW.classList.add('compass');

    if(dane.current_weather.winddirection == 0) WeatherNow.appendChild(windNorth);
    else if(dane.current_weather.winddirection == 90) WeatherNow.appendChild(windEast);
    else if(dane.current_weather.winddirection == 180) WeatherNow.appendChild(windSouth);
    else if(dane.current_weather.winddirection == 270) WeatherNow.appendChild(windWest);
    else if(dane.current_weather.winddirection > 0 && dane.current_weather.winddirection <= 45) WeatherNow.appendChild(windNNE);
    else if(dane.current_weather.winddirection > 45 && dane.current_weather.winddirection < 90) WeatherNow.appendChild(windENE);
    else if(dane.current_weather.winddirection > 90 && dane.current_weather.winddirection <= 135) WeatherNow.appendChild(windESE);
    else if(dane.current_weather.winddirection > 135 && dane.current_weather.winddirection < 180) WeatherNow.appendChild(windSSE);
    else if(dane.current_weather.winddirection > 180 && dane.current_weather.winddirection <= 225) WeatherNow.appendChild(windSSW);
    else if(dane.current_weather.winddirection > 225 && dane.current_weather.winddirection < 270) WeatherNow.appendChild(windWSW);
    else if(dane.current_weather.winddirection > 270 && dane.current_weather.winddirection <= 315) WeatherNow.appendChild(windWNW);
    else if(dane.current_weather.winddirection > 315 && dane.current_weather.winddirection < 360) WeatherNow.appendChild(windNNW);

    if(document.title == "Day 1"){
      const picked = document.querySelector('.picked-day');

      let H0 = document.createElement('div');
      let H1 = document.createElement('div');
      let H2 = document.createElement('div');
      let H3 = document.createElement('div');
      let H4 = document.createElement('div');
      let H5 = document.createElement('div');
      let H6 = document.createElement('div');
      let H7 = document.createElement('div');
      let H8 = document.createElement('div');
      let H9 = document.createElement('div');
      let H10 = document.createElement('div');
      let H11 = document.createElement('div');
      let H12 = document.createElement('div');
      let H13 = document.createElement('div');
      let H14 = document.createElement('div');
      let H15 = document.createElement('div');
      let H16 = document.createElement('div');
      let H17 = document.createElement('div');
      let H18 = document.createElement('div');
      let H19 = document.createElement('div');
      let H20 = document.createElement('div');
      let H21 = document.createElement('div');
      let H22 = document.createElement('div');
      let H23 = document.createElement('div');

      H0.classList.add('day-square');
      H1.classList.add('day-square');
      H2.classList.add('day-square');
      H3.classList.add('day-square');
      H4.classList.add('day-square');
      H5.classList.add('day-square');
      H6.classList.add('day-square');
      H7.classList.add('day-square');
      H8.classList.add('day-square');
      H9.classList.add('day-square');
      H10.classList.add('day-square');
      H11.classList.add('day-square');
      H12.classList.add('day-square');
      H13.classList.add('day-square');
      H14.classList.add('day-square');
      H15.classList.add('day-square');
      H16.classList.add('day-square');
      H17.classList.add('day-square');
      H18.classList.add('day-square');
      H19.classList.add('day-square');
      H20.classList.add('day-square');
      H21.classList.add('day-square');
      H22.classList.add('day-square');
      H23.classList.add('day-square');

      H0.innerText = "00:00 \n \n Temperature: " + dane.hourly.temperature_2m[0] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[0] + "% \n Windspeed: " + dane.hourly.windspeed_10m[0] + "km/h \n Precipitation: " + dane.hourly.precipitation[0] + "mm \n Pressure: "+ dane.hourly.pressure_msl[0] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[0] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[0] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[0] + "%";

      H1.innerText = "01:00 \n \n Temperature: " + dane.hourly.temperature_2m[1] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[1] + "% \n Windspeed: " + dane.hourly.windspeed_10m[1] + "km/h \n Precipitation: " + dane.hourly.precipitation[1] + "mm \n Pressure: "+ dane.hourly.pressure_msl[1] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[1] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[1] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[1] + "%";

      H2.innerText = "02:00 \n \n Temperature: " + dane.hourly.temperature_2m[2] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[2] + "% \n Windspeed: " + dane.hourly.windspeed_10m[2] + "km/h \n Precipitation: " + dane.hourly.precipitation[2] + "mm \n Pressure: "+ dane.hourly.pressure_msl[2] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[2] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[2] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[2] + "%";

      H3.innerText = "03:00 \n \n Temperature: " + dane.hourly.temperature_2m[3] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[3] + "% \n Windspeed: " + dane.hourly.windspeed_10m[3] + "km/h \n Precipitation: " + dane.hourly.precipitation[3] + "mm \n Pressure: "+ dane.hourly.pressure_msl[3] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[3] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[3] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[3] + "%";

      H4.innerText = "04:00 \n \n Temperature: " + dane.hourly.temperature_2m[4] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[4] + "% \n Windspeed: " + dane.hourly.windspeed_10m[4] + "km/h \n Precipitation: " + dane.hourly.precipitation[4] + "mm \n Pressure: "+ dane.hourly.pressure_msl[4] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[4] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[4] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[4] + "%";

      H5.innerText = "05:00 \n \n Temperature: " + dane.hourly.temperature_2m[5] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[5] + "% \n Windspeed: " + dane.hourly.windspeed_10m[5] + "km/h \n Precipitation: " + dane.hourly.precipitation[5] + "mm \n Pressure: "+ dane.hourly.pressure_msl[5] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[5] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[5] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[5] + "%";

      H6.innerText = "06:00 \n \n Temperature: " + dane.hourly.temperature_2m[6] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[6] + "% \n Windspeed: " + dane.hourly.windspeed_10m[6] + "km/h \n Precipitation: " + dane.hourly.precipitation[6] + "mm \n Pressure: "+ dane.hourly.pressure_msl[6] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[6] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[6] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[6] + "%";

      H7.innerText = "07:00 \n \n Temperature: " + dane.hourly.temperature_2m[7] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[7] + "% \n Windspeed: " + dane.hourly.windspeed_10m[7] + "km/h \n Precipitation: " + dane.hourly.precipitation[7] + "mm \n Pressure: "+ dane.hourly.pressure_msl[7] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[7] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[7] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[7] + "%";

      H8.innerText = "08:00 \n \n Temperature: " + dane.hourly.temperature_2m[8] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[8] + "% \n Windspeed: " + dane.hourly.windspeed_10m[8] + "km/h \n Precipitation: " + dane.hourly.precipitation[8] + "mm \n Pressure: "+ dane.hourly.pressure_msl[8] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[8] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[8] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[8] + "%";

      H9.innerText = "09:00 \n \n Temperature: " + dane.hourly.temperature_2m[9] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[9] + "% \n Windspeed: " + dane.hourly.windspeed_10m[9] + "km/h \n Precipitation: " + dane.hourly.precipitation[9] + "mm \n Pressure: "+ dane.hourly.pressure_msl[9] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[9] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[9] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[9] + "%";

      H10.innerText = "10:00 \n \n Temperature: " + dane.hourly.temperature_2m[10] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[10] + "% \n Windspeed: " + dane.hourly.windspeed_10m[10] + "km/h \n Precipitation: " + dane.hourly.precipitation[10] + "mm \n Pressure: "+ dane.hourly.pressure_msl[10] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[10] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[10] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[10] + "%";

      H11.innerText = "11:00 \n \n Temperature: " + dane.hourly.temperature_2m[11] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[11] + "% \n Windspeed: " + dane.hourly.windspeed_10m[11] + "km/h \n Precipitation: " + dane.hourly.precipitation[11] + "mm \n Pressure: "+ dane.hourly.pressure_msl[11] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[11] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[11] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[11] + "%";

      H12.innerText = "12:00 \n \n Temperature: " + dane.hourly.temperature_2m[12] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[12] + "% \n Windspeed: " + dane.hourly.windspeed_10m[12] + "km/h \n Precipitation: " + dane.hourly.precipitation[12] + "mm \n Pressure: "+ dane.hourly.pressure_msl[12] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[12] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[12] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[12] + "%";

      H13.innerText = "13:00 \n \n Temperature: " + dane.hourly.temperature_2m[13] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[13] + "% \n Windspeed: " + dane.hourly.windspeed_10m[13] + "km/h \n Precipitation: " + dane.hourly.precipitation[13] + "mm \n Pressure: "+ dane.hourly.pressure_msl[13] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[13] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[13] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[13] + "%";

      H14.innerText = "14:00 \n \n Temperature: " + dane.hourly.temperature_2m[14] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[14] + "% \n Windspeed: " + dane.hourly.windspeed_10m[14] + "km/h \n Precipitation: " + dane.hourly.precipitation[14] + "mm \n Pressure: "+ dane.hourly.pressure_msl[14] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[14] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[14] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[14] + "%";

      H15.innerText = "15:00 \n \n Temperature: " + dane.hourly.temperature_2m[15] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[15] + "% \n Windspeed: " + dane.hourly.windspeed_10m[15] + "km/h \n Precipitation: " + dane.hourly.precipitation[15] + "mm \n Pressure: "+ dane.hourly.pressure_msl[15] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[15] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[15] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[15] + "%";

      H16.innerText = "16:00 \n \n Temperature: " + dane.hourly.temperature_2m[16] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[16] + "% \n Windspeed: " + dane.hourly.windspeed_10m[16] + "km/h \n Precipitation: " + dane.hourly.precipitation[16] + "mm \n Pressure: "+ dane.hourly.pressure_msl[16] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[16] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[16] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[16] + "%";

      H17.innerText = "17:00 \n \n Temperature: " + dane.hourly.temperature_2m[17] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[17] + "% \n Windspeed: " + dane.hourly.windspeed_10m[17] + "km/h \n Precipitation: " + dane.hourly.precipitation[17] + "mm \n Pressure: "+ dane.hourly.pressure_msl[17] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[17] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[17] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[17] + "%";

      H18.innerText = "18:00 \n \n Temperature: " + dane.hourly.temperature_2m[18] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[18] + "% \n Windspeed: " + dane.hourly.windspeed_10m[18] + "km/h \n Precipitation: " + dane.hourly.precipitation[18] + "mm \n Pressure: "+ dane.hourly.pressure_msl[18] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[18] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[18] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[18] + "%";

      H19.innerText = "19:00 \n \n Temperature: " + dane.hourly.temperature_2m[19] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[19] + "% \n Windspeed: " + dane.hourly.windspeed_10m[19] + "km/h \n Precipitation: " + dane.hourly.precipitation[19] + "mm \n Pressure: "+ dane.hourly.pressure_msl[19] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[19] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[19] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[19] + "%";
      
      H20.innerText = "20:00 \n \n Temperature: " + dane.hourly.temperature_2m[20] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[20] + "% \n Windspeed: " + dane.hourly.windspeed_10m[20] + "km/h \n Precipitation: " + dane.hourly.precipitation[20] + "mm \n Pressure: "+ dane.hourly.pressure_msl[20] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[20] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[20] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[20] + "%";

      H21.innerText = "21:00 \n \n Temperature: " + dane.hourly.temperature_2m[21] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[21] + "% \n Windspeed: " + dane.hourly.windspeed_10m[21] + "km/h \n Precipitation: " + dane.hourly.precipitation[21] + "mm \n Pressure: "+ dane.hourly.pressure_msl[21] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[21] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[21] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[21] + "%";

      H22.innerText = "22:00 \n \n Temperature: " + dane.hourly.temperature_2m[22] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[22] + "% \n Windspeed: " + dane.hourly.windspeed_10m[22] + "km/h \n Precipitation: " + dane.hourly.precipitation[22] + "mm \n Pressure: "+ dane.hourly.pressure_msl[22] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[22] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[22] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[22] + "%";

      H23.innerText = "23:00 \n \n Temperature: " + dane.hourly.temperature_2m[23] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[23] + "% \n Windspeed: " + dane.hourly.windspeed_10m[23] + "km/h \n Precipitation: " + dane.hourly.precipitation[23] + "mm \n Pressure: "+ dane.hourly.pressure_msl[23] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[23] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[23] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[23] + "%";
      
      picked.appendChild(H0);
      picked.appendChild(H1);
      picked.appendChild(H2);
      picked.appendChild(H3);
      picked.appendChild(H4);
      picked.appendChild(H5);
      picked.appendChild(H6);
      picked.appendChild(H7);
      picked.appendChild(H8);
      picked.appendChild(H9);
      picked.appendChild(H10);
      picked.appendChild(H11);
      picked.appendChild(H12);
      picked.appendChild(H13);
      picked.appendChild(H14);
      picked.appendChild(H15);
      picked.appendChild(H16);
      picked.appendChild(H17);
      picked.appendChild(H18);
      picked.appendChild(H19);
      picked.appendChild(H20);
      picked.appendChild(H21);
      picked.appendChild(H22);
      picked.appendChild(H23);
    }

    if(document.title == "Day 2"){
      const picked = document.querySelector('.picked-day');

      let H0 = document.createElement('div');
      let H1 = document.createElement('div');
      let H2 = document.createElement('div');
      let H3 = document.createElement('div');
      let H4 = document.createElement('div');
      let H5 = document.createElement('div');
      let H6 = document.createElement('div');
      let H7 = document.createElement('div');
      let H8 = document.createElement('div');
      let H9 = document.createElement('div');
      let H10 = document.createElement('div');
      let H11 = document.createElement('div');
      let H12 = document.createElement('div');
      let H13 = document.createElement('div');
      let H14 = document.createElement('div');
      let H15 = document.createElement('div');
      let H16 = document.createElement('div');
      let H17 = document.createElement('div');
      let H18 = document.createElement('div');
      let H19 = document.createElement('div');
      let H20 = document.createElement('div');
      let H21 = document.createElement('div');
      let H22 = document.createElement('div');
      let H23 = document.createElement('div');

      H0.classList.add('day-square');
      H1.classList.add('day-square');
      H2.classList.add('day-square');
      H3.classList.add('day-square');
      H4.classList.add('day-square');
      H5.classList.add('day-square');
      H6.classList.add('day-square');
      H7.classList.add('day-square');
      H8.classList.add('day-square');
      H9.classList.add('day-square');
      H10.classList.add('day-square');
      H11.classList.add('day-square');
      H12.classList.add('day-square');
      H13.classList.add('day-square');
      H14.classList.add('day-square');
      H15.classList.add('day-square');
      H16.classList.add('day-square');
      H17.classList.add('day-square');
      H18.classList.add('day-square');
      H19.classList.add('day-square');
      H20.classList.add('day-square');
      H21.classList.add('day-square');
      H22.classList.add('day-square');
      H23.classList.add('day-square');

      H0.innerText = "00:00 \n \n Temperature: " + dane.hourly.temperature_2m[24] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[24] + "% \n Windspeed: " + dane.hourly.windspeed_10m[24] + "km/h \n Precipitation: " + dane.hourly.precipitation[24] + "mm \n Pressure: "+ dane.hourly.pressure_msl[24] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[24] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[24] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[24] + "%";

      H1.innerText = "01:00 \n \n Temperature: " + dane.hourly.temperature_2m[25] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[25] + "% \n Windspeed: " + dane.hourly.windspeed_10m[25] + "km/h \n Precipitation: " + dane.hourly.precipitation[25] + "mm \n Pressure: "+ dane.hourly.pressure_msl[25] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[25] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[25] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[25] + "%";

      H2.innerText = "02:00 \n \n Temperature: " + dane.hourly.temperature_2m[26] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[26] + "% \n Windspeed: " + dane.hourly.windspeed_10m[26] + "km/h \n Precipitation: " + dane.hourly.precipitation[26] + "mm \n Pressure: "+ dane.hourly.pressure_msl[26] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[26] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[26] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[26] + "%";

      H3.innerText = "03:00 \n \n Temperature: " + dane.hourly.temperature_2m[27] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[27] + "% \n Windspeed: " + dane.hourly.windspeed_10m[27] + "km/h \n Precipitation: " + dane.hourly.precipitation[27] + "mm \n Pressure: "+ dane.hourly.pressure_msl[27] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[27] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[27] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[27] + "%";

      H4.innerText = "04:00 \n \n Temperature: " + dane.hourly.temperature_2m[28] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[28] + "% \n Windspeed: " + dane.hourly.windspeed_10m[28] + "km/h \n Precipitation: " + dane.hourly.precipitation[28] + "mm \n Pressure: "+ dane.hourly.pressure_msl[28] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[28] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[28] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[28] + "%";

      H5.innerText = "05:00 \n \n Temperature: " + dane.hourly.temperature_2m[29] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[29] + "% \n Windspeed: " + dane.hourly.windspeed_10m[29] + "km/h \n Precipitation: " + dane.hourly.precipitation[29] + "mm \n Pressure: "+ dane.hourly.pressure_msl[29] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[29] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[29] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[29] + "%";

      H6.innerText = "06:00 \n \n Temperature: " + dane.hourly.temperature_2m[30] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[30] + "% \n Windspeed: " + dane.hourly.windspeed_10m[30] + "km/h \n Precipitation: " + dane.hourly.precipitation[30] + "mm \n Pressure: "+ dane.hourly.pressure_msl[30] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[30] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[30] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[30] + "%";

      H7.innerText = "07:00 \n \n Temperature: " + dane.hourly.temperature_2m[31] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[31] + "% \n Windspeed: " + dane.hourly.windspeed_10m[31] + "km/h \n Precipitation: " + dane.hourly.precipitation[31] + "mm \n Pressure: "+ dane.hourly.pressure_msl[31] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[31] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[31] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[31] + "%";

      H8.innerText = "08:00 \n \n Temperature: " + dane.hourly.temperature_2m[32] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[32] + "% \n Windspeed: " + dane.hourly.windspeed_10m[32] + "km/h \n Precipitation: " + dane.hourly.precipitation[32] + "mm \n Pressure: "+ dane.hourly.pressure_msl[32] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[32] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[32] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[32] + "%";

      H9.innerText = "09:00 \n \n Temperature: " + dane.hourly.temperature_2m[33] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[33] + "% \n Windspeed: " + dane.hourly.windspeed_10m[33] + "km/h \n Precipitation: " + dane.hourly.precipitation[33] + "mm \n Pressure: "+ dane.hourly.pressure_msl[33] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[33] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[33] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[33] + "%";

      H10.innerText = "10:00 \n \n Temperature: " + dane.hourly.temperature_2m[34] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[34] + "% \n Windspeed: " + dane.hourly.windspeed_10m[34] + "km/h \n Precipitation: " + dane.hourly.precipitation[34] + "mm \n Pressure: "+ dane.hourly.pressure_msl[34] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[34] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[34] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[34] + "%";

      H11.innerText = "11:00 \n \n Temperature: " + dane.hourly.temperature_2m[35] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[35] + "% \n Windspeed: " + dane.hourly.windspeed_10m[35] + "km/h \n Precipitation: " + dane.hourly.precipitation[35] + "mm \n Pressure: "+ dane.hourly.pressure_msl[35] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[35] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[35] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[35] + "%";

      H12.innerText = "12:00 \n \n Temperature: " + dane.hourly.temperature_2m[36] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[36] + "% \n Windspeed: " + dane.hourly.windspeed_10m[36] + "km/h \n Precipitation: " + dane.hourly.precipitation[36] + "mm \n Pressure: "+ dane.hourly.pressure_msl[36] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[36] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[36] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[36] + "%";

      H13.innerText = "13:00 \n \n Temperature: " + dane.hourly.temperature_2m[37] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[37] + "% \n Windspeed: " + dane.hourly.windspeed_10m[37] + "km/h \n Precipitation: " + dane.hourly.precipitation[37] + "mm \n Pressure: "+ dane.hourly.pressure_msl[37] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[37] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[37] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[37] + "%";

      H14.innerText = "14:00 \n \n Temperature: " + dane.hourly.temperature_2m[38] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[38] + "% \n Windspeed: " + dane.hourly.windspeed_10m[38] + "km/h \n Precipitation: " + dane.hourly.precipitation[38] + "mm \n Pressure: "+ dane.hourly.pressure_msl[38] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[38] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[38] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[38] + "%";

      H15.innerText = "15:00 \n \n Temperature: " + dane.hourly.temperature_2m[39] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[39] + "% \n Windspeed: " + dane.hourly.windspeed_10m[39] + "km/h \n Precipitation: " + dane.hourly.precipitation[39] + "mm \n Pressure: "+ dane.hourly.pressure_msl[39] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[39] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[39] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[39] + "%";

      H16.innerText = "16:00 \n \n Temperature: " + dane.hourly.temperature_2m[40] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[40] + "% \n Windspeed: " + dane.hourly.windspeed_10m[40] + "km/h \n Precipitation: " + dane.hourly.precipitation[40] + "mm \n Pressure: "+ dane.hourly.pressure_msl[40] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[40] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[40] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[40] + "%";

      H17.innerText = "17:00 \n \n Temperature: " + dane.hourly.temperature_2m[41] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[41] + "% \n Windspeed: " + dane.hourly.windspeed_10m[41] + "km/h \n Precipitation: " + dane.hourly.precipitation[41] + "mm \n Pressure: "+ dane.hourly.pressure_msl[41] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[41] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[41] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[41] + "%";

      H18.innerText = "18:00 \n \n Temperature: " + dane.hourly.temperature_2m[42] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[42] + "% \n Windspeed: " + dane.hourly.windspeed_10m[42] + "km/h \n Precipitation: " + dane.hourly.precipitation[42] + "mm \n Pressure: "+ dane.hourly.pressure_msl[42] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[42] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[42] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[42] + "%";

      H19.innerText = "19:00 \n \n Temperature: " + dane.hourly.temperature_2m[43] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[43] + "% \n Windspeed: " + dane.hourly.windspeed_10m[43] + "km/h \n Precipitation: " + dane.hourly.precipitation[43] + "mm \n Pressure: "+ dane.hourly.pressure_msl[43] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[43] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[43] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[43] + "%";
      
      H20.innerText = "20:00 \n \n Temperature: " + dane.hourly.temperature_2m[44] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[44] + "% \n Windspeed: " + dane.hourly.windspeed_10m[44] + "km/h \n Precipitation: " + dane.hourly.precipitation[44] + "mm \n Pressure: "+ dane.hourly.pressure_msl[44] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[44] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[44] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[44] + "%";

      H21.innerText = "21:00 \n \n Temperature: " + dane.hourly.temperature_2m[45] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[45] + "% \n Windspeed: " + dane.hourly.windspeed_10m[45] + "km/h \n Precipitation: " + dane.hourly.precipitation[45] + "mm \n Pressure: "+ dane.hourly.pressure_msl[45] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[45] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[45] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[45] + "%";

      H22.innerText = "22:00 \n \n Temperature: " + dane.hourly.temperature_2m[46] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[46] + "% \n Windspeed: " + dane.hourly.windspeed_10m[46] + "km/h \n Precipitation: " + dane.hourly.precipitation[46] + "mm \n Pressure: "+ dane.hourly.pressure_msl[46] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[46] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[46] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[46] + "%";

      H23.innerText = "23:00 \n \n Temperature: " + dane.hourly.temperature_2m[47] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[47] + "% \n Windspeed: " + dane.hourly.windspeed_10m[47] + "km/h \n Precipitation: " + dane.hourly.precipitation[47] + "mm \n Pressure: "+ dane.hourly.pressure_msl[47] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[47] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[47] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[47] + "%";
      
      picked.appendChild(H0);
      picked.appendChild(H1);
      picked.appendChild(H2);
      picked.appendChild(H3);
      picked.appendChild(H4);
      picked.appendChild(H5);
      picked.appendChild(H6);
      picked.appendChild(H7);
      picked.appendChild(H8);
      picked.appendChild(H9);
      picked.appendChild(H10);
      picked.appendChild(H11);
      picked.appendChild(H12);
      picked.appendChild(H13);
      picked.appendChild(H14);
      picked.appendChild(H15);
      picked.appendChild(H16);
      picked.appendChild(H17);
      picked.appendChild(H18);
      picked.appendChild(H19);
      picked.appendChild(H20);
      picked.appendChild(H21);
      picked.appendChild(H22);
      picked.appendChild(H23);
    }

    if(document.title == "Day 3"){
      const picked = document.querySelector('.picked-day');

      let H0 = document.createElement('div');
      let H1 = document.createElement('div');
      let H2 = document.createElement('div');
      let H3 = document.createElement('div');
      let H4 = document.createElement('div');
      let H5 = document.createElement('div');
      let H6 = document.createElement('div');
      let H7 = document.createElement('div');
      let H8 = document.createElement('div');
      let H9 = document.createElement('div');
      let H10 = document.createElement('div');
      let H11 = document.createElement('div');
      let H12 = document.createElement('div');
      let H13 = document.createElement('div');
      let H14 = document.createElement('div');
      let H15 = document.createElement('div');
      let H16 = document.createElement('div');
      let H17 = document.createElement('div');
      let H18 = document.createElement('div');
      let H19 = document.createElement('div');
      let H20 = document.createElement('div');
      let H21 = document.createElement('div');
      let H22 = document.createElement('div');
      let H23 = document.createElement('div');

      H0.classList.add('day-square');
      H1.classList.add('day-square');
      H2.classList.add('day-square');
      H3.classList.add('day-square');
      H4.classList.add('day-square');
      H5.classList.add('day-square');
      H6.classList.add('day-square');
      H7.classList.add('day-square');
      H8.classList.add('day-square');
      H9.classList.add('day-square');
      H10.classList.add('day-square');
      H11.classList.add('day-square');
      H12.classList.add('day-square');
      H13.classList.add('day-square');
      H14.classList.add('day-square');
      H15.classList.add('day-square');
      H16.classList.add('day-square');
      H17.classList.add('day-square');
      H18.classList.add('day-square');
      H19.classList.add('day-square');
      H20.classList.add('day-square');
      H21.classList.add('day-square');
      H22.classList.add('day-square');
      H23.classList.add('day-square');

      H0.innerText = "00:00 \n \n Temperature: " + dane.hourly.temperature_2m[48] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[48] + "% \n Windspeed: " + dane.hourly.windspeed_10m[48] + "km/h \n Precipitation: " + dane.hourly.precipitation[48] + "mm \n Pressure: "+ dane.hourly.pressure_msl[48] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[48] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[48] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[48] + "%";

      H1.innerText = "01:00 \n \n Temperature: " + dane.hourly.temperature_2m[49] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[49] + "% \n Windspeed: " + dane.hourly.windspeed_10m[49] + "km/h \n Precipitation: " + dane.hourly.precipitation[49] + "mm \n Pressure: "+ dane.hourly.pressure_msl[49] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[49] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[49] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[49] + "%";

      H2.innerText = "02:00 \n \n Temperature: " + dane.hourly.temperature_2m[50] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[50] + "% \n Windspeed: " + dane.hourly.windspeed_10m[50] + "km/h \n Precipitation: " + dane.hourly.precipitation[50] + "mm \n Pressure: "+ dane.hourly.pressure_msl[50] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[50] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[50] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[50] + "%";

      H3.innerText = "03:00 \n \n Temperature: " + dane.hourly.temperature_2m[51] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[51] + "% \n Windspeed: " + dane.hourly.windspeed_10m[51] + "km/h \n Precipitation: " + dane.hourly.precipitation[51] + "mm \n Pressure: "+ dane.hourly.pressure_msl[51] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[51] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[51] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[51] + "%";

      H4.innerText = "04:00 \n \n Temperature: " + dane.hourly.temperature_2m[52] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[52] + "% \n Windspeed: " + dane.hourly.windspeed_10m[52] + "km/h \n Precipitation: " + dane.hourly.precipitation[52] + "mm \n Pressure: "+ dane.hourly.pressure_msl[52] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[52] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[52] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[52] + "%";

      H5.innerText = "05:00 \n \n Temperature: " + dane.hourly.temperature_2m[53] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[53] + "% \n Windspeed: " + dane.hourly.windspeed_10m[53] + "km/h \n Precipitation: " + dane.hourly.precipitation[53] + "mm \n Pressure: "+ dane.hourly.pressure_msl[53] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[53] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[53] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[53] + "%";

      H6.innerText = "06:00 \n \n Temperature: " + dane.hourly.temperature_2m[54] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[54] + "% \n Windspeed: " + dane.hourly.windspeed_10m[54] + "km/h \n Precipitation: " + dane.hourly.precipitation[54] + "mm \n Pressure: "+ dane.hourly.pressure_msl[54] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[54] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[54] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[54] + "%";

      H7.innerText = "07:00 \n \n Temperature: " + dane.hourly.temperature_2m[55] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[55] + "% \n Windspeed: " + dane.hourly.windspeed_10m[55] + "km/h \n Precipitation: " + dane.hourly.precipitation[55] + "mm \n Pressure: "+ dane.hourly.pressure_msl[55] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[55] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[55] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[55] + "%";

      H8.innerText = "08:00 \n \n Temperature: " + dane.hourly.temperature_2m[56] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[56] + "% \n Windspeed: " + dane.hourly.windspeed_10m[56] + "km/h \n Precipitation: " + dane.hourly.precipitation[56] + "mm \n Pressure: "+ dane.hourly.pressure_msl[56] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[56] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[56] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[56] + "%";

      H9.innerText = "09:00 \n \n Temperature: " + dane.hourly.temperature_2m[57] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[57] + "% \n Windspeed: " + dane.hourly.windspeed_10m[57] + "km/h \n Precipitation: " + dane.hourly.precipitation[57] + "mm \n Pressure: "+ dane.hourly.pressure_msl[57] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[57] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[57] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[57] + "%";

      H10.innerText = "10:00 \n \n Temperature: " + dane.hourly.temperature_2m[58] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[58] + "% \n Windspeed: " + dane.hourly.windspeed_10m[58] + "km/h \n Precipitation: " + dane.hourly.precipitation[58] + "mm \n Pressure: "+ dane.hourly.pressure_msl[58] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[58] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[58] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[58] + "%";

      H11.innerText = "11:00 \n \n Temperature: " + dane.hourly.temperature_2m[59] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[59] + "% \n Windspeed: " + dane.hourly.windspeed_10m[59] + "km/h \n Precipitation: " + dane.hourly.precipitation[59] + "mm \n Pressure: "+ dane.hourly.pressure_msl[59] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[59] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[59] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[59] + "%";

      H12.innerText = "12:00 \n \n Temperature: " + dane.hourly.temperature_2m[60] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[60] + "% \n Windspeed: " + dane.hourly.windspeed_10m[60] + "km/h \n Precipitation: " + dane.hourly.precipitation[60] + "mm \n Pressure: "+ dane.hourly.pressure_msl[60] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[60] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[60] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[60] + "%";

      H13.innerText = "13:00 \n \n Temperature: " + dane.hourly.temperature_2m[61] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[61] + "% \n Windspeed: " + dane.hourly.windspeed_10m[61] + "km/h \n Precipitation: " + dane.hourly.precipitation[61] + "mm \n Pressure: "+ dane.hourly.pressure_msl[61] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[61] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[61] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[61] + "%";

      H14.innerText = "14:00 \n \n Temperature: " + dane.hourly.temperature_2m[62] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[62] + "% \n Windspeed: " + dane.hourly.windspeed_10m[62] + "km/h \n Precipitation: " + dane.hourly.precipitation[62] + "mm \n Pressure: "+ dane.hourly.pressure_msl[62] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[62] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[62] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[62] + "%";

      H15.innerText = "15:00 \n \n Temperature: " + dane.hourly.temperature_2m[63] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[63] + "% \n Windspeed: " + dane.hourly.windspeed_10m[63] + "km/h \n Precipitation: " + dane.hourly.precipitation[63] + "mm \n Pressure: "+ dane.hourly.pressure_msl[63] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[63] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[63] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[63] + "%";

      H16.innerText = "16:00 \n \n Temperature: " + dane.hourly.temperature_2m[64] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[64] + "% \n Windspeed: " + dane.hourly.windspeed_10m[64] + "km/h \n Precipitation: " + dane.hourly.precipitation[64] + "mm \n Pressure: "+ dane.hourly.pressure_msl[64] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[64] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[64] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[64] + "%";

      H17.innerText = "17:00 \n \n Temperature: " + dane.hourly.temperature_2m[65] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[65] + "% \n Windspeed: " + dane.hourly.windspeed_10m[65] + "km/h \n Precipitation: " + dane.hourly.precipitation[65] + "mm \n Pressure: "+ dane.hourly.pressure_msl[65] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[65] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[65] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[65] + "%";

      H18.innerText = "18:00 \n \n Temperature: " + dane.hourly.temperature_2m[66] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[66] + "% \n Windspeed: " + dane.hourly.windspeed_10m[66] + "km/h \n Precipitation: " + dane.hourly.precipitation[66] + "mm \n Pressure: "+ dane.hourly.pressure_msl[66] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[66] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[66] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[66] + "%";

      H19.innerText = "19:00 \n \n Temperature: " + dane.hourly.temperature_2m[67] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[67] + "% \n Windspeed: " + dane.hourly.windspeed_10m[67] + "km/h \n Precipitation: " + dane.hourly.precipitation[67] + "mm \n Pressure: "+ dane.hourly.pressure_msl[67] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[67] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[67] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[67] + "%";
      
      H20.innerText = "20:00 \n \n Temperature: " + dane.hourly.temperature_2m[68] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[68] + "% \n Windspeed: " + dane.hourly.windspeed_10m[68] + "km/h \n Precipitation: " + dane.hourly.precipitation[68] + "mm \n Pressure: "+ dane.hourly.pressure_msl[68] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[68] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[68] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[68] + "%";

      H21.innerText = "21:00 \n \n Temperature: " + dane.hourly.temperature_2m[69] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[69] + "% \n Windspeed: " + dane.hourly.windspeed_10m[69] + "km/h \n Precipitation: " + dane.hourly.precipitation[69] + "mm \n Pressure: "+ dane.hourly.pressure_msl[69] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[69] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[69] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[69] + "%";

      H22.innerText = "22:00 \n \n Temperature: " + dane.hourly.temperature_2m[70] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[70] + "% \n Windspeed: " + dane.hourly.windspeed_10m[70] + "km/h \n Precipitation: " + dane.hourly.precipitation[70] + "mm \n Pressure: "+ dane.hourly.pressure_msl[70] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[70] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[70] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[70] + "%";

      H23.innerText = "23:00 \n \n Temperature: " + dane.hourly.temperature_2m[71] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[71] + "% \n Windspeed: " + dane.hourly.windspeed_10m[71] + "km/h \n Precipitation: " + dane.hourly.precipitation[71] + "mm \n Pressure: "+ dane.hourly.pressure_msl[71] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[71] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[71] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[71] + "%";
      
      picked.appendChild(H0);
      picked.appendChild(H1);
      picked.appendChild(H2);
      picked.appendChild(H3);
      picked.appendChild(H4);
      picked.appendChild(H5);
      picked.appendChild(H6);
      picked.appendChild(H7);
      picked.appendChild(H8);
      picked.appendChild(H9);
      picked.appendChild(H10);
      picked.appendChild(H11);
      picked.appendChild(H12);
      picked.appendChild(H13);
      picked.appendChild(H14);
      picked.appendChild(H15);
      picked.appendChild(H16);
      picked.appendChild(H17);
      picked.appendChild(H18);
      picked.appendChild(H19);
      picked.appendChild(H20);
      picked.appendChild(H21);
      picked.appendChild(H22);
      picked.appendChild(H23);
    }

    if(document.title == "Day 4"){
      const picked = document.querySelector('.picked-day');

      let H0 = document.createElement('div');
      let H1 = document.createElement('div');
      let H2 = document.createElement('div');
      let H3 = document.createElement('div');
      let H4 = document.createElement('div');
      let H5 = document.createElement('div');
      let H6 = document.createElement('div');
      let H7 = document.createElement('div');
      let H8 = document.createElement('div');
      let H9 = document.createElement('div');
      let H10 = document.createElement('div');
      let H11 = document.createElement('div');
      let H12 = document.createElement('div');
      let H13 = document.createElement('div');
      let H14 = document.createElement('div');
      let H15 = document.createElement('div');
      let H16 = document.createElement('div');
      let H17 = document.createElement('div');
      let H18 = document.createElement('div');
      let H19 = document.createElement('div');
      let H20 = document.createElement('div');
      let H21 = document.createElement('div');
      let H22 = document.createElement('div');
      let H23 = document.createElement('div');

      H0.classList.add('day-square');
      H1.classList.add('day-square');
      H2.classList.add('day-square');
      H3.classList.add('day-square');
      H4.classList.add('day-square');
      H5.classList.add('day-square');
      H6.classList.add('day-square');
      H7.classList.add('day-square');
      H8.classList.add('day-square');
      H9.classList.add('day-square');
      H10.classList.add('day-square');
      H11.classList.add('day-square');
      H12.classList.add('day-square');
      H13.classList.add('day-square');
      H14.classList.add('day-square');
      H15.classList.add('day-square');
      H16.classList.add('day-square');
      H17.classList.add('day-square');
      H18.classList.add('day-square');
      H19.classList.add('day-square');
      H20.classList.add('day-square');
      H21.classList.add('day-square');
      H22.classList.add('day-square');
      H23.classList.add('day-square');

      H0.innerText = "00:00 \n \n Temperature: " + dane.hourly.temperature_2m[72] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[72] + "% \n Windspeed: " + dane.hourly.windspeed_10m[72] + "km/h \n Precipitation: " + dane.hourly.precipitation[72] + "mm \n Pressure: "+ dane.hourly.pressure_msl[72] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[72] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[72] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[72] + "%";

      H1.innerText = "01:00 \n \n Temperature: " + dane.hourly.temperature_2m[73] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[73] + "% \n Windspeed: " + dane.hourly.windspeed_10m[73] + "km/h \n Precipitation: " + dane.hourly.precipitation[73] + "mm \n Pressure: "+ dane.hourly.pressure_msl[73] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[73] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[73] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[73] + "%";

      H2.innerText = "02:00 \n \n Temperature: " + dane.hourly.temperature_2m[74] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[74] + "% \n Windspeed: " + dane.hourly.windspeed_10m[74] + "km/h \n Precipitation: " + dane.hourly.precipitation[74] + "mm \n Pressure: "+ dane.hourly.pressure_msl[74] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[74] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[74] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[74] + "%";

      H3.innerText = "03:00 \n \n Temperature: " + dane.hourly.temperature_2m[75] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[75] + "% \n Windspeed: " + dane.hourly.windspeed_10m[75] + "km/h \n Precipitation: " + dane.hourly.precipitation[75] + "mm \n Pressure: "+ dane.hourly.pressure_msl[75] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[75] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[75] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[75] + "%";

      H4.innerText = "04:00 \n \n Temperature: " + dane.hourly.temperature_2m[76] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[76] + "% \n Windspeed: " + dane.hourly.windspeed_10m[76] + "km/h \n Precipitation: " + dane.hourly.precipitation[76] + "mm \n Pressure: "+ dane.hourly.pressure_msl[76] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[76] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[76] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[76] + "%";

      H5.innerText = "05:00 \n \n Temperature: " + dane.hourly.temperature_2m[77] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[77] + "% \n Windspeed: " + dane.hourly.windspeed_10m[77] + "km/h \n Precipitation: " + dane.hourly.precipitation[77] + "mm \n Pressure: "+ dane.hourly.pressure_msl[77] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[77] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[77] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[77] + "%";

      H6.innerText = "06:00 \n \n Temperature: " + dane.hourly.temperature_2m[78] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[78] + "% \n Windspeed: " + dane.hourly.windspeed_10m[78] + "km/h \n Precipitation: " + dane.hourly.precipitation[78] + "mm \n Pressure: "+ dane.hourly.pressure_msl[78] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[78] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[78] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[78] + "%";

      H7.innerText = "07:00 \n \n Temperature: " + dane.hourly.temperature_2m[79] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[79] + "% \n Windspeed: " + dane.hourly.windspeed_10m[79] + "km/h \n Precipitation: " + dane.hourly.precipitation[79] + "mm \n Pressure: "+ dane.hourly.pressure_msl[79] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[79] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[79] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[79] + "%";

      H8.innerText = "08:00 \n \n Temperature: " + dane.hourly.temperature_2m[80] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[80] + "% \n Windspeed: " + dane.hourly.windspeed_10m[80] + "km/h \n Precipitation: " + dane.hourly.precipitation[80] + "mm \n Pressure: "+ dane.hourly.pressure_msl[80] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[80] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[80] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[80] + "%";

      H9.innerText = "09:00 \n \n Temperature: " + dane.hourly.temperature_2m[81] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[81] + "% \n Windspeed: " + dane.hourly.windspeed_10m[81] + "km/h \n Precipitation: " + dane.hourly.precipitation[81] + "mm \n Pressure: "+ dane.hourly.pressure_msl[81] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[81] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[81] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[81] + "%";

      H10.innerText = "10:00 \n \n Temperature: " + dane.hourly.temperature_2m[82] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[82] + "% \n Windspeed: " + dane.hourly.windspeed_10m[82] + "km/h \n Precipitation: " + dane.hourly.precipitation[82] + "mm \n Pressure: "+ dane.hourly.pressure_msl[82] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[82] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[82] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[82] + "%";

      H11.innerText = "11:00 \n \n Temperature: " + dane.hourly.temperature_2m[83] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[83] + "% \n Windspeed: " + dane.hourly.windspeed_10m[83] + "km/h \n Precipitation: " + dane.hourly.precipitation[83] + "mm \n Pressure: "+ dane.hourly.pressure_msl[83] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[83] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[83] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[83] + "%";

      H12.innerText = "12:00 \n \n Temperature: " + dane.hourly.temperature_2m[84] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[84] + "% \n Windspeed: " + dane.hourly.windspeed_10m[84] + "km/h \n Precipitation: " + dane.hourly.precipitation[84] + "mm \n Pressure: "+ dane.hourly.pressure_msl[84] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[84] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[84] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[84] + "%";

      H13.innerText = "13:00 \n \n Temperature: " + dane.hourly.temperature_2m[85] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[85] + "% \n Windspeed: " + dane.hourly.windspeed_10m[85] + "km/h \n Precipitation: " + dane.hourly.precipitation[85] + "mm \n Pressure: "+ dane.hourly.pressure_msl[85] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[85] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[85] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[85] + "%";

      H14.innerText = "14:00 \n \n Temperature: " + dane.hourly.temperature_2m[86] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[86] + "% \n Windspeed: " + dane.hourly.windspeed_10m[86] + "km/h \n Precipitation: " + dane.hourly.precipitation[86] + "mm \n Pressure: "+ dane.hourly.pressure_msl[86] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[86] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[86] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[86] + "%";

      H15.innerText = "15:00 \n \n Temperature: " + dane.hourly.temperature_2m[87] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[87] + "% \n Windspeed: " + dane.hourly.windspeed_10m[87] + "km/h \n Precipitation: " + dane.hourly.precipitation[87] + "mm \n Pressure: "+ dane.hourly.pressure_msl[87] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[87] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[87] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[87] + "%";

      H16.innerText = "16:00 \n \n Temperature: " + dane.hourly.temperature_2m[88] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[88] + "% \n Windspeed: " + dane.hourly.windspeed_10m[88] + "km/h \n Precipitation: " + dane.hourly.precipitation[88] + "mm \n Pressure: "+ dane.hourly.pressure_msl[88] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[88] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[88] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[88] + "%";

      H17.innerText = "17:00 \n \n Temperature: " + dane.hourly.temperature_2m[89] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[89] + "% \n Windspeed: " + dane.hourly.windspeed_10m[89] + "km/h \n Precipitation: " + dane.hourly.precipitation[89] + "mm \n Pressure: "+ dane.hourly.pressure_msl[89] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[89] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[89] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[89] + "%";

      H18.innerText = "18:00 \n \n Temperature: " + dane.hourly.temperature_2m[90] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[90] + "% \n Windspeed: " + dane.hourly.windspeed_10m[90] + "km/h \n Precipitation: " + dane.hourly.precipitation[90] + "mm \n Pressure: "+ dane.hourly.pressure_msl[90] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[90] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[90] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[90] + "%";

      H19.innerText = "19:00 \n \n Temperature: " + dane.hourly.temperature_2m[91] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[91] + "% \n Windspeed: " + dane.hourly.windspeed_10m[91] + "km/h \n Precipitation: " + dane.hourly.precipitation[91] + "mm \n Pressure: "+ dane.hourly.pressure_msl[91] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[91] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[91] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[91] + "%";
      
      H20.innerText = "20:00 \n \n Temperature: " + dane.hourly.temperature_2m[92] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[92] + "% \n Windspeed: " + dane.hourly.windspeed_10m[92] + "km/h \n Precipitation: " + dane.hourly.precipitation[92] + "mm \n Pressure: "+ dane.hourly.pressure_msl[92] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[92] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[92] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[92] + "%";

      H21.innerText = "21:00 \n \n Temperature: " + dane.hourly.temperature_2m[93] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[93] + "% \n Windspeed: " + dane.hourly.windspeed_10m[93] + "km/h \n Precipitation: " + dane.hourly.precipitation[93] + "mm \n Pressure: "+ dane.hourly.pressure_msl[93] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[93] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[93] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[93] + "%";

      H22.innerText = "22:00 \n \n Temperature: " + dane.hourly.temperature_2m[94] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[94] + "% \n Windspeed: " + dane.hourly.windspeed_10m[94] + "km/h \n Precipitation: " + dane.hourly.precipitation[94] + "mm \n Pressure: "+ dane.hourly.pressure_msl[94] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[94] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[94] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[94] + "%";

      H23.innerText = "23:00 \n \n Temperature: " + dane.hourly.temperature_2m[95] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[95] + "% \n Windspeed: " + dane.hourly.windspeed_10m[95] + "km/h \n Precipitation: " + dane.hourly.precipitation[95] + "mm \n Pressure: "+ dane.hourly.pressure_msl[95] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[95] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[95] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[95] + "%";
      
      picked.appendChild(H0);
      picked.appendChild(H1);
      picked.appendChild(H2);
      picked.appendChild(H3);
      picked.appendChild(H4);
      picked.appendChild(H5);
      picked.appendChild(H6);
      picked.appendChild(H7);
      picked.appendChild(H8);
      picked.appendChild(H9);
      picked.appendChild(H10);
      picked.appendChild(H11);
      picked.appendChild(H12);
      picked.appendChild(H13);
      picked.appendChild(H14);
      picked.appendChild(H15);
      picked.appendChild(H16);
      picked.appendChild(H17);
      picked.appendChild(H18);
      picked.appendChild(H19);
      picked.appendChild(H20);
      picked.appendChild(H21);
      picked.appendChild(H22);
      picked.appendChild(H23);
    }

    if(document.title == "Day 5"){
      const picked = document.querySelector('.picked-day');

      let H0 = document.createElement('div');
      let H1 = document.createElement('div');
      let H2 = document.createElement('div');
      let H3 = document.createElement('div');
      let H4 = document.createElement('div');
      let H5 = document.createElement('div');
      let H6 = document.createElement('div');
      let H7 = document.createElement('div');
      let H8 = document.createElement('div');
      let H9 = document.createElement('div');
      let H10 = document.createElement('div');
      let H11 = document.createElement('div');
      let H12 = document.createElement('div');
      let H13 = document.createElement('div');
      let H14 = document.createElement('div');
      let H15 = document.createElement('div');
      let H16 = document.createElement('div');
      let H17 = document.createElement('div');
      let H18 = document.createElement('div');
      let H19 = document.createElement('div');
      let H20 = document.createElement('div');
      let H21 = document.createElement('div');
      let H22 = document.createElement('div');
      let H23 = document.createElement('div');

      H0.classList.add('day-square');
      H1.classList.add('day-square');
      H2.classList.add('day-square');
      H3.classList.add('day-square');
      H4.classList.add('day-square');
      H5.classList.add('day-square');
      H6.classList.add('day-square');
      H7.classList.add('day-square');
      H8.classList.add('day-square');
      H9.classList.add('day-square');
      H10.classList.add('day-square');
      H11.classList.add('day-square');
      H12.classList.add('day-square');
      H13.classList.add('day-square');
      H14.classList.add('day-square');
      H15.classList.add('day-square');
      H16.classList.add('day-square');
      H17.classList.add('day-square');
      H18.classList.add('day-square');
      H19.classList.add('day-square');
      H20.classList.add('day-square');
      H21.classList.add('day-square');
      H22.classList.add('day-square');
      H23.classList.add('day-square');

      H0.innerText = "00:00 \n \n Temperature: " + dane.hourly.temperature_2m[96] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[96] + "% \n Windspeed: " + dane.hourly.windspeed_10m[96] + "km/h \n Precipitation: " + dane.hourly.precipitation[96] + "mm \n Pressure: "+ dane.hourly.pressure_msl[96] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[96] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[96] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[96] + "%";

      H1.innerText = "01:00 \n \n Temperature: " + dane.hourly.temperature_2m[97] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[97] + "% \n Windspeed: " + dane.hourly.windspeed_10m[97] + "km/h \n Precipitation: " + dane.hourly.precipitation[97] + "mm \n Pressure: "+ dane.hourly.pressure_msl[97] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[97] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[97] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[97] + "%";

      H2.innerText = "02:00 \n \n Temperature: " + dane.hourly.temperature_2m[98] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[98] + "% \n Windspeed: " + dane.hourly.windspeed_10m[98] + "km/h \n Precipitation: " + dane.hourly.precipitation[98] + "mm \n Pressure: "+ dane.hourly.pressure_msl[98] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[98] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[98] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[98] + "%";

      H3.innerText = "03:00 \n \n Temperature: " + dane.hourly.temperature_2m[99] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[99] + "% \n Windspeed: " + dane.hourly.windspeed_10m[99] + "km/h \n Precipitation: " + dane.hourly.precipitation[99] + "mm \n Pressure: "+ dane.hourly.pressure_msl[99] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[99] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[99] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[99] + "%";

      H4.innerText = "04:00 \n \n Temperature: " + dane.hourly.temperature_2m[100] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[100] + "% \n Windspeed: " + dane.hourly.windspeed_10m[100] + "km/h \n Precipitation: " + dane.hourly.precipitation[100] + "mm \n Pressure: "+ dane.hourly.pressure_msl[100] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[100] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[100] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[100] + "%";

      H5.innerText = "05:00 \n \n Temperature: " + dane.hourly.temperature_2m[101] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[101] + "% \n Windspeed: " + dane.hourly.windspeed_10m[101] + "km/h \n Precipitation: " + dane.hourly.precipitation[101] + "mm \n Pressure: "+ dane.hourly.pressure_msl[101] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[101] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[101] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[101] + "%";

      H6.innerText = "06:00 \n \n Temperature: " + dane.hourly.temperature_2m[102] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[102] + "% \n Windspeed: " + dane.hourly.windspeed_10m[102] + "km/h \n Precipitation: " + dane.hourly.precipitation[102] + "mm \n Pressure: "+ dane.hourly.pressure_msl[102] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[102] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[102] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[102] + "%";

      H7.innerText = "07:00 \n \n Temperature: " + dane.hourly.temperature_2m[103] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[103] + "% \n Windspeed: " + dane.hourly.windspeed_10m[103] + "km/h \n Precipitation: " + dane.hourly.precipitation[103] + "mm \n Pressure: "+ dane.hourly.pressure_msl[103] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[103] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[103] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[103] + "%";

      H8.innerText = "08:00 \n \n Temperature: " + dane.hourly.temperature_2m[104] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[104] + "% \n Windspeed: " + dane.hourly.windspeed_10m[104] + "km/h \n Precipitation: " + dane.hourly.precipitation[104] + "mm \n Pressure: "+ dane.hourly.pressure_msl[104] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[104] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[104] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[104] + "%";

      H9.innerText = "09:00 \n \n Temperature: " + dane.hourly.temperature_2m[105] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[105] + "% \n Windspeed: " + dane.hourly.windspeed_10m[105] + "km/h \n Precipitation: " + dane.hourly.precipitation[105] + "mm \n Pressure: "+ dane.hourly.pressure_msl[105] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[105] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[105] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[105] + "%";

      H10.innerText = "10:00 \n \n Temperature: " + dane.hourly.temperature_2m[106] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[106] + "% \n Windspeed: " + dane.hourly.windspeed_10m[106] + "km/h \n Precipitation: " + dane.hourly.precipitation[106] + "mm \n Pressure: "+ dane.hourly.pressure_msl[106] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[106] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[106] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[106] + "%";

      H11.innerText = "11:00 \n \n Temperature: " + dane.hourly.temperature_2m[107] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[107] + "% \n Windspeed: " + dane.hourly.windspeed_10m[107] + "km/h \n Precipitation: " + dane.hourly.precipitation[107] + "mm \n Pressure: "+ dane.hourly.pressure_msl[107] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[107] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[107] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[107] + "%";

      H12.innerText = "12:00 \n \n Temperature: " + dane.hourly.temperature_2m[108] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[108] + "% \n Windspeed: " + dane.hourly.windspeed_10m[108] + "km/h \n Precipitation: " + dane.hourly.precipitation[108] + "mm \n Pressure: "+ dane.hourly.pressure_msl[108] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[108] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[108] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[108] + "%";

      H13.innerText = "13:00 \n \n Temperature: " + dane.hourly.temperature_2m[109] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[109] + "% \n Windspeed: " + dane.hourly.windspeed_10m[109] + "km/h \n Precipitation: " + dane.hourly.precipitation[109] + "mm \n Pressure: "+ dane.hourly.pressure_msl[109] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[109] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[109] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[109] + "%";

      H14.innerText = "14:00 \n \n Temperature: " + dane.hourly.temperature_2m[110] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[110] + "% \n Windspeed: " + dane.hourly.windspeed_10m[110] + "km/h \n Precipitation: " + dane.hourly.precipitation[110] + "mm \n Pressure: "+ dane.hourly.pressure_msl[110] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[110] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[110] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[110] + "%";

      H15.innerText = "15:00 \n \n Temperature: " + dane.hourly.temperature_2m[111] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[111] + "% \n Windspeed: " + dane.hourly.windspeed_10m[111] + "km/h \n Precipitation: " + dane.hourly.precipitation[111] + "mm \n Pressure: "+ dane.hourly.pressure_msl[111] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[111] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[111] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[111] + "%";

      H16.innerText = "16:00 \n \n Temperature: " + dane.hourly.temperature_2m[112] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[112] + "% \n Windspeed: " + dane.hourly.windspeed_10m[112] + "km/h \n Precipitation: " + dane.hourly.precipitation[112] + "mm \n Pressure: "+ dane.hourly.pressure_msl[112] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[112] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[112] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[112] + "%";

      H17.innerText = "17:00 \n \n Temperature: " + dane.hourly.temperature_2m[113] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[113] + "% \n Windspeed: " + dane.hourly.windspeed_10m[113] + "km/h \n Precipitation: " + dane.hourly.precipitation[113] + "mm \n Pressure: "+ dane.hourly.pressure_msl[113] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[113] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[113] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[113] + "%";

      H18.innerText = "18:00 \n \n Temperature: " + dane.hourly.temperature_2m[114] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[114] + "% \n Windspeed: " + dane.hourly.windspeed_10m[114] + "km/h \n Precipitation: " + dane.hourly.precipitation[114] + "mm \n Pressure: "+ dane.hourly.pressure_msl[114] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[114] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[114] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[114] + "%";

      H19.innerText = "19:00 \n \n Temperature: " + dane.hourly.temperature_2m[115] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[115] + "% \n Windspeed: " + dane.hourly.windspeed_10m[115] + "km/h \n Precipitation: " + dane.hourly.precipitation[115] + "mm \n Pressure: "+ dane.hourly.pressure_msl[115] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[115] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[115] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[115] + "%";
      
      H20.innerText = "20:00 \n \n Temperature: " + dane.hourly.temperature_2m[116] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[116] + "% \n Windspeed: " + dane.hourly.windspeed_10m[116] + "km/h \n Precipitation: " + dane.hourly.precipitation[116] + "mm \n Pressure: "+ dane.hourly.pressure_msl[116] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[116] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[116] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[116] + "%";

      H21.innerText = "21:00 \n \n Temperature: " + dane.hourly.temperature_2m[117] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[117] + "% \n Windspeed: " + dane.hourly.windspeed_10m[117] + "km/h \n Precipitation: " + dane.hourly.precipitation[117] + "mm \n Pressure: "+ dane.hourly.pressure_msl[117] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[117] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[117] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[117] + "%";

      H22.innerText = "22:00 \n \n Temperature: " + dane.hourly.temperature_2m[118] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[118] + "% \n Windspeed: " + dane.hourly.windspeed_10m[118] + "km/h \n Precipitation: " + dane.hourly.precipitation[118] + "mm \n Pressure: "+ dane.hourly.pressure_msl[118] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[118] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[118] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[118] + "%";

      H23.innerText = "23:00 \n \n Temperature: " + dane.hourly.temperature_2m[119] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[119] + "% \n Windspeed: " + dane.hourly.windspeed_10m[119] + "km/h \n Precipitation: " + dane.hourly.precipitation[119] + "mm \n Pressure: "+ dane.hourly.pressure_msl[119] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[119] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[119] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[119] + "%";
      
      picked.appendChild(H0);
      picked.appendChild(H1);
      picked.appendChild(H2);
      picked.appendChild(H3);
      picked.appendChild(H4);
      picked.appendChild(H5);
      picked.appendChild(H6);
      picked.appendChild(H7);
      picked.appendChild(H8);
      picked.appendChild(H9);
      picked.appendChild(H10);
      picked.appendChild(H11);
      picked.appendChild(H12);
      picked.appendChild(H13);
      picked.appendChild(H14);
      picked.appendChild(H15);
      picked.appendChild(H16);
      picked.appendChild(H17);
      picked.appendChild(H18);
      picked.appendChild(H19);
      picked.appendChild(H20);
      picked.appendChild(H21);
      picked.appendChild(H22);
      picked.appendChild(H23);
    }

    if(document.title == "Day 6"){
      const picked = document.querySelector('.picked-day');

      let H0 = document.createElement('div');
      let H1 = document.createElement('div');
      let H2 = document.createElement('div');
      let H3 = document.createElement('div');
      let H4 = document.createElement('div');
      let H5 = document.createElement('div');
      let H6 = document.createElement('div');
      let H7 = document.createElement('div');
      let H8 = document.createElement('div');
      let H9 = document.createElement('div');
      let H10 = document.createElement('div');
      let H11 = document.createElement('div');
      let H12 = document.createElement('div');
      let H13 = document.createElement('div');
      let H14 = document.createElement('div');
      let H15 = document.createElement('div');
      let H16 = document.createElement('div');
      let H17 = document.createElement('div');
      let H18 = document.createElement('div');
      let H19 = document.createElement('div');
      let H20 = document.createElement('div');
      let H21 = document.createElement('div');
      let H22 = document.createElement('div');
      let H23 = document.createElement('div');

      H0.classList.add('day-square');
      H1.classList.add('day-square');
      H2.classList.add('day-square');
      H3.classList.add('day-square');
      H4.classList.add('day-square');
      H5.classList.add('day-square');
      H6.classList.add('day-square');
      H7.classList.add('day-square');
      H8.classList.add('day-square');
      H9.classList.add('day-square');
      H10.classList.add('day-square');
      H11.classList.add('day-square');
      H12.classList.add('day-square');
      H13.classList.add('day-square');
      H14.classList.add('day-square');
      H15.classList.add('day-square');
      H16.classList.add('day-square');
      H17.classList.add('day-square');
      H18.classList.add('day-square');
      H19.classList.add('day-square');
      H20.classList.add('day-square');
      H21.classList.add('day-square');
      H22.classList.add('day-square');
      H23.classList.add('day-square');

      H0.innerText = "00:00 \n \n Temperature: " + dane.hourly.temperature_2m[120] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[120] + "% \n Windspeed: " + dane.hourly.windspeed_10m[120] + "km/h \n Precipitation: " + dane.hourly.precipitation[120] + "mm \n Pressure: "+ dane.hourly.pressure_msl[120] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[120] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[120] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[120] + "%";

      H1.innerText = "01:00 \n \n Temperature: " + dane.hourly.temperature_2m[121] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[121] + "% \n Windspeed: " + dane.hourly.windspeed_10m[121] + "km/h \n Precipitation: " + dane.hourly.precipitation[121] + "mm \n Pressure: "+ dane.hourly.pressure_msl[121] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[121] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[121] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[121] + "%";

      H2.innerText = "02:00 \n \n Temperature: " + dane.hourly.temperature_2m[122] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[122] + "% \n Windspeed: " + dane.hourly.windspeed_10m[122] + "km/h \n Precipitation: " + dane.hourly.precipitation[122] + "mm \n Pressure: "+ dane.hourly.pressure_msl[122] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[122] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[122] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[122] + "%";

      H3.innerText = "03:00 \n \n Temperature: " + dane.hourly.temperature_2m[123] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[123] + "% \n Windspeed: " + dane.hourly.windspeed_10m[123] + "km/h \n Precipitation: " + dane.hourly.precipitation[123] + "mm \n Pressure: "+ dane.hourly.pressure_msl[123] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[123] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[123] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[123] + "%";

      H4.innerText = "04:00 \n \n Temperature: " + dane.hourly.temperature_2m[124] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[124] + "% \n Windspeed: " + dane.hourly.windspeed_10m[124] + "km/h \n Precipitation: " + dane.hourly.precipitation[124] + "mm \n Pressure: "+ dane.hourly.pressure_msl[124] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[124] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[124] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[124] + "%";

      H5.innerText = "05:00 \n \n Temperature: " + dane.hourly.temperature_2m[125] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[125] + "% \n Windspeed: " + dane.hourly.windspeed_10m[125] + "km/h \n Precipitation: " + dane.hourly.precipitation[125] + "mm \n Pressure: "+ dane.hourly.pressure_msl[125] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[125] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[125] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[125] + "%";

      H6.innerText = "06:00 \n \n Temperature: " + dane.hourly.temperature_2m[126] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[126] + "% \n Windspeed: " + dane.hourly.windspeed_10m[126] + "km/h \n Precipitation: " + dane.hourly.precipitation[126] + "mm \n Pressure: "+ dane.hourly.pressure_msl[126] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[126] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[126] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[126] + "%";

      H7.innerText = "07:00 \n \n Temperature: " + dane.hourly.temperature_2m[127] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[127] + "% \n Windspeed: " + dane.hourly.windspeed_10m[127] + "km/h \n Precipitation: " + dane.hourly.precipitation[127] + "mm \n Pressure: "+ dane.hourly.pressure_msl[127] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[127] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[127] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[127] + "%";

      H8.innerText = "08:00 \n \n Temperature: " + dane.hourly.temperature_2m[128] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[128] + "% \n Windspeed: " + dane.hourly.windspeed_10m[128] + "km/h \n Precipitation: " + dane.hourly.precipitation[128] + "mm \n Pressure: "+ dane.hourly.pressure_msl[128] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[128] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[128] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[128] + "%";

      H9.innerText = "09:00 \n \n Temperature: " + dane.hourly.temperature_2m[129] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[129] + "% \n Windspeed: " + dane.hourly.windspeed_10m[129] + "km/h \n Precipitation: " + dane.hourly.precipitation[129] + "mm \n Pressure: "+ dane.hourly.pressure_msl[129] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[129] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[129] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[129] + "%";

      H10.innerText = "10:00 \n \n Temperature: " + dane.hourly.temperature_2m[130] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[130] + "% \n Windspeed: " + dane.hourly.windspeed_10m[130] + "km/h \n Precipitation: " + dane.hourly.precipitation[130] + "mm \n Pressure: "+ dane.hourly.pressure_msl[130] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[130] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[130] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[130] + "%";

      H11.innerText = "11:00 \n \n Temperature: " + dane.hourly.temperature_2m[131] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[131] + "% \n Windspeed: " + dane.hourly.windspeed_10m[131] + "km/h \n Precipitation: " + dane.hourly.precipitation[131] + "mm \n Pressure: "+ dane.hourly.pressure_msl[131] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[131] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[131] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[131] + "%";

      H12.innerText = "12:00 \n \n Temperature: " + dane.hourly.temperature_2m[132] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[132] + "% \n Windspeed: " + dane.hourly.windspeed_10m[132] + "km/h \n Precipitation: " + dane.hourly.precipitation[132] + "mm \n Pressure: "+ dane.hourly.pressure_msl[132] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[132] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[132] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[132] + "%";

      H13.innerText = "13:00 \n \n Temperature: " + dane.hourly.temperature_2m[133] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[133] + "% \n Windspeed: " + dane.hourly.windspeed_10m[133] + "km/h \n Precipitation: " + dane.hourly.precipitation[133] + "mm \n Pressure: "+ dane.hourly.pressure_msl[133] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[133] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[133] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[133] + "%";

      H14.innerText = "14:00 \n \n Temperature: " + dane.hourly.temperature_2m[134] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[134] + "% \n Windspeed: " + dane.hourly.windspeed_10m[134] + "km/h \n Precipitation: " + dane.hourly.precipitation[134] + "mm \n Pressure: "+ dane.hourly.pressure_msl[134] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[134] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[134] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[134] + "%";

      H15.innerText = "15:00 \n \n Temperature: " + dane.hourly.temperature_2m[135] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[135] + "% \n Windspeed: " + dane.hourly.windspeed_10m[135] + "km/h \n Precipitation: " + dane.hourly.precipitation[135] + "mm \n Pressure: "+ dane.hourly.pressure_msl[135] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[135] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[135] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[135] + "%";

      H16.innerText = "16:00 \n \n Temperature: " + dane.hourly.temperature_2m[136] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[136] + "% \n Windspeed: " + dane.hourly.windspeed_10m[136] + "km/h \n Precipitation: " + dane.hourly.precipitation[136] + "mm \n Pressure: "+ dane.hourly.pressure_msl[136] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[136] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[136] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[136] + "%";

      H17.innerText = "17:00 \n \n Temperature: " + dane.hourly.temperature_2m[137] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[137] + "% \n Windspeed: " + dane.hourly.windspeed_10m[137] + "km/h \n Precipitation: " + dane.hourly.precipitation[137] + "mm \n Pressure: "+ dane.hourly.pressure_msl[137] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[137] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[137] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[137] + "%";

      H18.innerText = "18:00 \n \n Temperature: " + dane.hourly.temperature_2m[138] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[138] + "% \n Windspeed: " + dane.hourly.windspeed_10m[138] + "km/h \n Precipitation: " + dane.hourly.precipitation[138] + "mm \n Pressure: "+ dane.hourly.pressure_msl[138] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[138] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[138] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[138] + "%";

      H19.innerText = "19:00 \n \n Temperature: " + dane.hourly.temperature_2m[139] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[139] + "% \n Windspeed: " + dane.hourly.windspeed_10m[139] + "km/h \n Precipitation: " + dane.hourly.precipitation[139] + "mm \n Pressure: "+ dane.hourly.pressure_msl[139] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[139] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[139] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[139] + "%";
      
      H20.innerText = "20:00 \n \n Temperature: " + dane.hourly.temperature_2m[140] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[140] + "% \n Windspeed: " + dane.hourly.windspeed_10m[140] + "km/h \n Precipitation: " + dane.hourly.precipitation[140] + "mm \n Pressure: "+ dane.hourly.pressure_msl[140] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[140] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[140] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[140] + "%";

      H21.innerText = "21:00 \n \n Temperature: " + dane.hourly.temperature_2m[141] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[141] + "% \n Windspeed: " + dane.hourly.windspeed_10m[141] + "km/h \n Precipitation: " + dane.hourly.precipitation[141] + "mm \n Pressure: "+ dane.hourly.pressure_msl[141] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[141] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[141] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[141] + "%";

      H22.innerText = "22:00 \n \n Temperature: " + dane.hourly.temperature_2m[142] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[142] + "% \n Windspeed: " + dane.hourly.windspeed_10m[142] + "km/h \n Precipitation: " + dane.hourly.precipitation[142] + "mm \n Pressure: "+ dane.hourly.pressure_msl[142] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[142] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[142] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[142] + "%";

      H23.innerText = "23:00 \n \n Temperature: " + dane.hourly.temperature_2m[143] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[143] + "% \n Windspeed: " + dane.hourly.windspeed_10m[143] + "km/h \n Precipitation: " + dane.hourly.precipitation[143] + "mm \n Pressure: "+ dane.hourly.pressure_msl[143] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[143] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[143] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[143] + "%";
      
      picked.appendChild(H0);
      picked.appendChild(H1);
      picked.appendChild(H2);
      picked.appendChild(H3);
      picked.appendChild(H4);
      picked.appendChild(H5);
      picked.appendChild(H6);
      picked.appendChild(H7);
      picked.appendChild(H8);
      picked.appendChild(H9);
      picked.appendChild(H10);
      picked.appendChild(H11);
      picked.appendChild(H12);
      picked.appendChild(H13);
      picked.appendChild(H14);
      picked.appendChild(H15);
      picked.appendChild(H16);
      picked.appendChild(H17);
      picked.appendChild(H18);
      picked.appendChild(H19);
      picked.appendChild(H20);
      picked.appendChild(H21);
      picked.appendChild(H22);
      picked.appendChild(H23);
    }

    if(document.title == "Day 7"){
      const picked = document.querySelector('.picked-day');

      let H0 = document.createElement('div');
      let H1 = document.createElement('div');
      let H2 = document.createElement('div');
      let H3 = document.createElement('div');
      let H4 = document.createElement('div');
      let H5 = document.createElement('div');
      let H6 = document.createElement('div');
      let H7 = document.createElement('div');
      let H8 = document.createElement('div');
      let H9 = document.createElement('div');
      let H10 = document.createElement('div');
      let H11 = document.createElement('div');
      let H12 = document.createElement('div');
      let H13 = document.createElement('div');
      let H14 = document.createElement('div');
      let H15 = document.createElement('div');
      let H16 = document.createElement('div');
      let H17 = document.createElement('div');
      let H18 = document.createElement('div');
      let H19 = document.createElement('div');
      let H20 = document.createElement('div');
      let H21 = document.createElement('div');
      let H22 = document.createElement('div');
      let H23 = document.createElement('div');

      H0.classList.add('day-square');
      H1.classList.add('day-square');
      H2.classList.add('day-square');
      H3.classList.add('day-square');
      H4.classList.add('day-square');
      H5.classList.add('day-square');
      H6.classList.add('day-square');
      H7.classList.add('day-square');
      H8.classList.add('day-square');
      H9.classList.add('day-square');
      H10.classList.add('day-square');
      H11.classList.add('day-square');
      H12.classList.add('day-square');
      H13.classList.add('day-square');
      H14.classList.add('day-square');
      H15.classList.add('day-square');
      H16.classList.add('day-square');
      H17.classList.add('day-square');
      H18.classList.add('day-square');
      H19.classList.add('day-square');
      H20.classList.add('day-square');
      H21.classList.add('day-square');
      H22.classList.add('day-square');
      H23.classList.add('day-square');

      H0.innerText = "00:00 \n \n Temperature: " + dane.hourly.temperature_2m[144] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[144] + "% \n Windspeed: " + dane.hourly.windspeed_10m[144] + "km/h \n Precipitation: " + dane.hourly.precipitation[144] + "mm \n Pressure: "+ dane.hourly.pressure_msl[144] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[144] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[144] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[144] + "%";

      H1.innerText = "01:00 \n \n Temperature: " + dane.hourly.temperature_2m[145] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[145] + "% \n Windspeed: " + dane.hourly.windspeed_10m[145] + "km/h \n Precipitation: " + dane.hourly.precipitation[145] + "mm \n Pressure: "+ dane.hourly.pressure_msl[145] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[145] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[145] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[145] + "%";

      H2.innerText = "02:00 \n \n Temperature: " + dane.hourly.temperature_2m[146] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[146] + "% \n Windspeed: " + dane.hourly.windspeed_10m[146] + "km/h \n Precipitation: " + dane.hourly.precipitation[146] + "mm \n Pressure: "+ dane.hourly.pressure_msl[146] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[146] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[146] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[146] + "%";

      H3.innerText = "03:00 \n \n Temperature: " + dane.hourly.temperature_2m[147] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[147] + "% \n Windspeed: " + dane.hourly.windspeed_10m[147] + "km/h \n Precipitation: " + dane.hourly.precipitation[147] + "mm \n Pressure: "+ dane.hourly.pressure_msl[147] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[147] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[147] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[147] + "%";

      H4.innerText = "04:00 \n \n Temperature: " + dane.hourly.temperature_2m[148] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[148] + "% \n Windspeed: " + dane.hourly.windspeed_10m[148] + "km/h \n Precipitation: " + dane.hourly.precipitation[148] + "mm \n Pressure: "+ dane.hourly.pressure_msl[148] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[148] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[148] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[148] + "%";

      H5.innerText = "05:00 \n \n Temperature: " + dane.hourly.temperature_2m[149] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[149] + "% \n Windspeed: " + dane.hourly.windspeed_10m[149] + "km/h \n Precipitation: " + dane.hourly.precipitation[149] + "mm \n Pressure: "+ dane.hourly.pressure_msl[149] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[149] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[149] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[149] + "%";

      H6.innerText = "06:00 \n \n Temperature: " + dane.hourly.temperature_2m[150] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[150] + "% \n Windspeed: " + dane.hourly.windspeed_10m[150] + "km/h \n Precipitation: " + dane.hourly.precipitation[150] + "mm \n Pressure: "+ dane.hourly.pressure_msl[150] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[150] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[150] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[150] + "%";

      H7.innerText = "07:00 \n \n Temperature: " + dane.hourly.temperature_2m[151] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[151] + "% \n Windspeed: " + dane.hourly.windspeed_10m[151] + "km/h \n Precipitation: " + dane.hourly.precipitation[151] + "mm \n Pressure: "+ dane.hourly.pressure_msl[151] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[151] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[151] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[151] + "%";

      H8.innerText = "08:00 \n \n Temperature: " + dane.hourly.temperature_2m[152] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[152] + "% \n Windspeed: " + dane.hourly.windspeed_10m[152] + "km/h \n Precipitation: " + dane.hourly.precipitation[152] + "mm \n Pressure: "+ dane.hourly.pressure_msl[152] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[152] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[152] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[152] + "%";

      H9.innerText = "09:00 \n \n Temperature: " + dane.hourly.temperature_2m[153] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[153] + "% \n Windspeed: " + dane.hourly.windspeed_10m[153] + "km/h \n Precipitation: " + dane.hourly.precipitation[153] + "mm \n Pressure: "+ dane.hourly.pressure_msl[153] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[153] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[153] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[153] + "%";

      H10.innerText = "10:00 \n \n Temperature: " + dane.hourly.temperature_2m[154] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[154] + "% \n Windspeed: " + dane.hourly.windspeed_10m[154] + "km/h \n Precipitation: " + dane.hourly.precipitation[154] + "mm \n Pressure: "+ dane.hourly.pressure_msl[154] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[154] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[154] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[154] + "%";

      H11.innerText = "11:00 \n \n Temperature: " + dane.hourly.temperature_2m[155] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[155] + "% \n Windspeed: " + dane.hourly.windspeed_10m[155] + "km/h \n Precipitation: " + dane.hourly.precipitation[155] + "mm \n Pressure: "+ dane.hourly.pressure_msl[155] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[155] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[155] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[155] + "%";

      H12.innerText = "12:00 \n \n Temperature: " + dane.hourly.temperature_2m[156] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[156] + "% \n Windspeed: " + dane.hourly.windspeed_10m[156] + "km/h \n Precipitation: " + dane.hourly.precipitation[156] + "mm \n Pressure: "+ dane.hourly.pressure_msl[156] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[156] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[156] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[156] + "%";

      H13.innerText = "13:00 \n \n Temperature: " + dane.hourly.temperature_2m[157] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[157] + "% \n Windspeed: " + dane.hourly.windspeed_10m[157] + "km/h \n Precipitation: " + dane.hourly.precipitation[157] + "mm \n Pressure: "+ dane.hourly.pressure_msl[157] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[157] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[157] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[157] + "%";

      H14.innerText = "14:00 \n \n Temperature: " + dane.hourly.temperature_2m[158] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[158] + "% \n Windspeed: " + dane.hourly.windspeed_10m[158] + "km/h \n Precipitation: " + dane.hourly.precipitation[158] + "mm \n Pressure: "+ dane.hourly.pressure_msl[158] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[158] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[158] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[158] + "%";

      H15.innerText = "15:00 \n \n Temperature: " + dane.hourly.temperature_2m[159] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[159] + "% \n Windspeed: " + dane.hourly.windspeed_10m[159] + "km/h \n Precipitation: " + dane.hourly.precipitation[159] + "mm \n Pressure: "+ dane.hourly.pressure_msl[159] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[159] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[159] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[159] + "%";

      H16.innerText = "16:00 \n \n Temperature: " + dane.hourly.temperature_2m[160] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[160] + "% \n Windspeed: " + dane.hourly.windspeed_10m[160] + "km/h \n Precipitation: " + dane.hourly.precipitation[160] + "mm \n Pressure: "+ dane.hourly.pressure_msl[160] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[160] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[160] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[160] + "%";

      H17.innerText = "17:00 \n \n Temperature: " + dane.hourly.temperature_2m[161] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[161] + "% \n Windspeed: " + dane.hourly.windspeed_10m[161] + "km/h \n Precipitation: " + dane.hourly.precipitation[161] + "mm \n Pressure: "+ dane.hourly.pressure_msl[161] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[161] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[161] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[161] + "%";

      H18.innerText = "18:00 \n \n Temperature: " + dane.hourly.temperature_2m[162] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[162] + "% \n Windspeed: " + dane.hourly.windspeed_10m[162] + "km/h \n Precipitation: " + dane.hourly.precipitation[162] + "mm \n Pressure: "+ dane.hourly.pressure_msl[162] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[162] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[162] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[162] + "%";

      H19.innerText = "19:00 \n \n Temperature: " + dane.hourly.temperature_2m[163] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[163] + "% \n Windspeed: " + dane.hourly.windspeed_10m[163] + "km/h \n Precipitation: " + dane.hourly.precipitation[163] + "mm \n Pressure: "+ dane.hourly.pressure_msl[163] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[163] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[163] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[163] + "%";
      
      H20.innerText = "20:00 \n \n Temperature: " + dane.hourly.temperature_2m[164] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[164] + "% \n Windspeed: " + dane.hourly.windspeed_10m[164] + "km/h \n Precipitation: " + dane.hourly.precipitation[164] + "mm \n Pressure: "+ dane.hourly.pressure_msl[164] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[164] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[164] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[164] + "%";

      H21.innerText = "21:00 \n \n Temperature: " + dane.hourly.temperature_2m[165] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[165] + "% \n Windspeed: " + dane.hourly.windspeed_10m[165] + "km/h \n Precipitation: " + dane.hourly.precipitation[165] + "mm \n Pressure: "+ dane.hourly.pressure_msl[165] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[165] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[165] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[165] + "%";

      H22.innerText = "22:00 \n \n Temperature: " + dane.hourly.temperature_2m[166] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[166] + "% \n Windspeed: " + dane.hourly.windspeed_10m[166] + "km/h \n Precipitation: " + dane.hourly.precipitation[166] + "mm \n Pressure: "+ dane.hourly.pressure_msl[166] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[166] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[166] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[166] + "%";

      H23.innerText = "23:00 \n \n Temperature: " + dane.hourly.temperature_2m[167] + "°C \n Humidity: " + dane.hourly.relativehumidity_2m[167] + "% \n Windspeed: " + dane.hourly.windspeed_10m[167] + "km/h \n Precipitation: " + dane.hourly.precipitation[167] + "mm \n Pressure: "+ dane.hourly.pressure_msl[167] + "hPa \n Soil Temp.: " + dane.hourly.soil_temperature_0cm[167] + "°C \n Soil Moisture: " + dane.hourly.soil_moisture_0_1cm[167] + "m³/m³ \n Cloudcover: " + dane.hourly.cloudcover[167] + "%";
      
      picked.appendChild(H0);
      picked.appendChild(H1);
      picked.appendChild(H2);
      picked.appendChild(H3);
      picked.appendChild(H4);
      picked.appendChild(H5);
      picked.appendChild(H6);
      picked.appendChild(H7);
      picked.appendChild(H8);
      picked.appendChild(H9);
      picked.appendChild(H10);
      picked.appendChild(H11);
      picked.appendChild(H12);
      picked.appendChild(H13);
      picked.appendChild(H14);
      picked.appendChild(H15);
      picked.appendChild(H16);
      picked.appendChild(H17);
      picked.appendChild(H18);
      picked.appendChild(H19);
      picked.appendChild(H20);
      picked.appendChild(H21);
      picked.appendChild(H22);
      picked.appendChild(H23);
    }
  }

if(sessionStorage.getItem('latitude') && sessionStorage.getItem('longitude')){
  API_URL = "https://api.open-meteo.com/v1/forecast?latitude="+sessionStorage.getItem('latitude')+"&longitude="+sessionStorage.getItem('longitude')+"&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,windspeed_10m,soil_temperature_0cm,soil_moisture_0_1cm&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=Europe%2FBerlin";
  fetchData();
}
else getLocation();

//Attribution Modal

const modalAtt = document.querySelector('.modalA');
const buttonAtt = document.querySelector('.button2');
const closeButton = document.querySelector('.closeButton');

buttonAtt.addEventListener('click', () => {
  modalAtt.showModal();
})
closeButton.addEventListener('click', () => {
  modalAtt.close();
})


  

