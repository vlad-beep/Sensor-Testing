const n = 3; // number of sensors
const deltaT = 2000; // experimentation period in milliseconds
const xv = []; // upper limit array
const xn = []; // lower limit array
const deltaXA = []; // emergency inter-set array
const sensorData = []; // array to store sensor data
const prank = document.querySelector('.prank');
const fix = document.querySelector('.fix');
let lowerLimitArray = 22;
let upperLimitArray = 55;
let prankvalue = 0;
prank.addEventListener('click', pranks);
fix.addEventListener('click', fixs);
function pranks() {
  prankvalue = 100;
}
function fixs() {
  prankvalue = 0;
}
InitializeOptions();

const sensorChart = new Chart(document.getElementById('myChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Sensor 1',
        data: sensorData[0],
        borderColor: 'red',
        borderWidth: 1,
        tesion: 0.4,
      },
      {
        label: 'Sensor 2',
        data: sensorData[1],
        borderColor: 'blue',
        borderWidth: 1,
        tesion: 0.4,
      },
      {
        label: 'Sensor 3',
        data: sensorData[2],
        borderColor: 'yellow',
        borderWidth: 1,
        tesion: 0.4,
      },
    ],
  },

  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Sensor Data',
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Time',
        },
      },

      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value',
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  },
});

setInterval(testAllSensors, deltaT);

setInterval(printSensorData, 10000);

function testAllSensors() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let timeString = `${hours}:${minutes}:${seconds}`;
  sensorChart.data.labels.push(timeString);
  for (let i = 0; i < n; i++) {
    testSensor(i);
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max + prankvalue - min) + min;
}

function testSensor(sensorIndex) {
  const sensorValue = getRandomNumber(
    xn[sensorIndex] + deltaXA[sensorIndex],
    xv[sensorIndex] - deltaXA[sensorIndex],
  );
  console.log(`Testing sensor ${sensorIndex + 1}...`);
  console.log(`Sensor value: ${sensorValue}`);
  // Check if the sensor value is outside of the limits
  if (sensorValue < xn[sensorIndex] || sensorValue > xv[sensorIndex]) {
    console.log(`Sensor ${sensorIndex + 1} is out of limits!`);
    // TODO: Add code to issue passport
  }
  // Save the sensor value to the sensor data array
  sensorData[sensorIndex].push(sensorValue);

  sensorChart.data.datasets[sensorIndex].data = sensorData[sensorIndex];
  sensorChart.update();
}

function printSensorData() {
  for (let i = 0; i < n; i++) {
    console.log(`Sensor ${i + 1} data: ${sensorData[i].join(', ')}`);
  }
}

function InitializeOptions() {
  for (let i = 0; i < n; i++) {
    // Initialize limits
    xv[i] = upperLimitArray;
    xn[i] = lowerLimitArray;
    // Initialize emergency inter-set values
    deltaXA[i] = 0.5;
    // Initialize sensor data array
    sensorData[i] = [];
  }
}
