const n = 5; // number of sensors
const deltaT = 2000; // experimentation period in milliseconds
const xv = []; // upper limit array
const xn = []; // lower limit array
const deltaXA = []; // emergency inter-set array
const sensorData = []; // array to store sensor data
const dataset = [];
const sensorPriority = [5, 0, 3, 1, 4];
const intervals = [4, 2, 8, 12, 6];
let lowerLimitArray = 22;
let upperLimitArray = 55;
let prankvalue = 0;
let byPriority = false;
let byInterval = false;

const prank = document.querySelector('.prank');
const fix = document.querySelector('.fix');
const infoBtn = document.querySelector('.info');
const priorityBtn = document.querySelector('#myToggle');
const intervalBtn = document.querySelector('#myToggl');

prank.addEventListener('click', function () {
  prankvalue = 100;
});
fix.addEventListener('click', function () {
  prankvalue = 0;
});
priorityBtn.addEventListener('click', function () {
  byPriority = !byPriority;
});
intervalBtn.addEventListener('click', function () {
  byInterval = !byInterval;
});

infoBtn.addEventListener('click', printSensorData);
class Sensor {
  constructor(label, data, borderColor, priority, interval) {
    this.label = label;
    this.data = data;
    this.borderColor = borderColor;
    this.borderWidth = 1;
    this.tension = 0.1;
    this.priority = priority;
    this.interval = interval;
  }

  test() {
    const sensorIndex = this.label.slice(7, 8) - 1;
    const sensorValue = getRandomNumber(
      xn[sensorIndex] - deltaXA[sensorIndex],
      xv[sensorIndex] + deltaXA[sensorIndex],
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
}

InitializeOptions();
if (byInterval === true) {
  testAllSensors();
} else {
  setInterval(testAllSensors, deltaT);
}

function testAllSensors() {
  if (byPriority) {
    let sensorsByPriority = dataset.slice().sort((a, b) => a.priority - b.priority);
    getTime();
    for (let i = 0; i < n; i++) {
      sensorsByPriority[i].test();
    }
  } else if (byInterval === true) {
    getTime();
    for (let i = 0; i < n; i++) {
      setInterval(() => dataset[i].test(), dataset[i].interval * 1000);
    }
  } else {
    getTime();
    for (let i = 0; i < n; i++) {
      dataset[i].test();
    }
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max + prankvalue - min) + min;
}

function printSensorData() {
  for (let i = 0; i < n; i++) {
    console.log(`Sensor ${i + 1} data: ${sensorData[i].join(', ')}`);
  }
}

function InitializeOptions() {
  sensorChart = InitializeChart();
  for (let i = 0; i < n; i++) {
    const label = `Sensor ${i + 1}`;
    const dataValues = sensorData[i];
    const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const priority = sensorPriority[i];
    const interval = intervals[i];

    const sensor = new Sensor(label, dataValues, borderColor, priority, interval);
    dataset.push(sensor);
    // Initialize limits
    xv[i] = upperLimitArray;
    xn[i] = lowerLimitArray;
    // Initialize emergency inter-set values
    deltaXA[i] = 0.5;
    // Initialize sensor data array
    sensorData[i] = [];
  }
}

function getTime() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let timeString = `${hours}:${minutes}:${seconds}`;
  sensorChart.data.labels.push(timeString);
}

function InitializeChart() {
  const sensorChart = new Chart(document.getElementById('myChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: [],
      datasets: dataset,
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

  return sensorChart;
}
