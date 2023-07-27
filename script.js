let isAlarmSet = false; // Flag to track if the alarm is set

// Function to remove the alarm time and update the clock when the alarm is canceled
function cancelAlarm() {
  localStorage.removeItem("alarmTime");
  isAlarmSet = false;
  document.body.style.backgroundColor = "black";
  updateClock();
}

// Function to trigger the alarm sound and stop it after a certain period
function triggerAlarm() {
  const audio = new Audio("rain_alarm.mp3");
  audio.play();

  // Add a class to body for smooth background color transition
  document.body.classList.add("alarm-triggered");

  // Stop the alarm sound after 30 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    document.body.classList.remove("alarm-triggered");
    cancelAlarm();
  }, 30000); // Adjust this value to change the alarm duration
}

// Function to set the alarm time
function setAlarm() {
  const alarmTimeInput = document.getElementById("alarm-time");
  const alarmTime = alarmTimeInput.value;

  if (alarmTime === "") {
    alert("Please set the alarm time.");
    return;
  }

  localStorage.setItem("alarmTime", alarmTime);
  isAlarmSet = true; // Set the flag to true when the alarm is set
  updateClock(); // Update the clock immediately after setting the alarm
  alert("Alarm set successfully!");
}

// Function to update the clock and check if the alarm time is reached
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const clockDisplay = document.querySelector(".clock");
  clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;

  // Check if the alarm time is set
  if (isAlarmSet) {
    // Calculate the time difference in seconds
    const alarmTimeString = localStorage.getItem("alarmTime");
    const alarmTime = new Date(`${now.toDateString()} ${alarmTimeString}`);
    const timeDiffInSeconds = Math.floor((alarmTime - now) / 1000);

    // Calculate the percentage of time passed (closer to 1 as alarm time approaches)
    const timePercentage = Math.min(1, Math.max(0, 1 - timeDiffInSeconds / (60 * 5))); // Change the '5' to control how fast the transition occurs

    // Calculate the RGB values based on the percentage (linear interpolation from black to white)
    const r = Math.round(255 * timePercentage);
    const g = Math.round(255 * timePercentage);
    const b = Math.round(255 * timePercentage);

    // Set the background color using the calculated RGB values
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Calculate the color of the clock text based on timePercentage (closer to 0 as alarm time approaches)
    const textColorPercentage = 1 - timePercentage;
    const textColor = `rgb(${Math.round(255 * textColorPercentage)}, ${Math.round(255 * textColorPercentage)}, ${Math.round(255 * textColorPercentage)})`;
    clockDisplay.style.color = textColor;

    // Check if the alarm time is reached
    if (timeDiffInSeconds <= 0) {
      triggerAlarm();
    }
  }
}



function getWeatherData() {
  const apiKey = 'caa1c258b1eef023f2eb40d779313d4b';
  const city = 'Rockville, US';
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      const weatherIcon = data.weather[0].icon;
      const temperature = data.main.temp;
      const weatherDescription = data.weather[0].description;

      const weatherIconElement = document.getElementById('weather-icon');
      weatherIconElement.innerHTML = `<img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">`;

      const weatherDetailsElement = document.getElementById('weather-details');
      weatherDetailsElement.textContent = `${Math.round(temperature)}°F, ${weatherDescription}`;
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

// Update the clock every second
setInterval(updateClock, 1000);

// Fetch weather data when the page loads
window.addEventListener('load', getWeatherData);

// Initialize the background color to black
document.body.style.backgroundColor = "black";
