const n = 5; // number of sensors
const deltaT = 2000; // experimentation period in milliseconds
const xv = []; // upper limit array
const xn = []; // lower limit array
const deltaXA = []; // emergency inter-set array
const sensorData = []; // array to store sensor data
const dataset = [];
const sensorPriority = [3, 2, 1, 0, 4];
let lowerLimitArray = 22;
let upperLimitArray = 55;
let prankvalue = 0;
let byPriority = false;

const prank = document.querySelector('.prank');
const fix = document.querySelector('.fix');
const priorityBtn = document.querySelector('.toggle__input');

prank.addEventListener('click', function () {
  prankvalue = 100;
});
fix.addEventListener('click', function () {
  prankvalue = 0;
});
priorityBtn.addEventListener('click', function () {
  byPriority = !byPriority;
});

class Sensor {
  constructor(label, data, borderColor, priority) {
    this.label = label;
    this.data = data;
    this.borderColor = borderColor;
    this.borderWidth = 1;
    this.tension = 0.1;
    this.priority = priority;
  }
}

InitializeOptions();
sensorChart = InitializeChart();
setInterval(testAllSensors, deltaT);
setInterval(printSensorData, 10000);

function testAllSensors() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let timeString = `${hours}:${minutes}:${seconds}`;
  sensorChart.data.labels.push(timeString);

  if (byPriority) {
    let sensorsByPriority = dataset.slice().sort((a, b) => a.priority - b.priority);
    for (let i = 0; i < n; i++) {
      testSensor(sensorsByPriority[i]);
    }
  } else {
    for (let i = 0; i < n; i++) {
      testSensor(dataset[i]);
    }
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max + prankvalue - min) + min;
}

function testSensor(sensor) {
  const sensorIndex = sensor.label.slice(7, 8) - 1;
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

function printSensorData() {
  for (let i = 0; i < n; i++) {
    console.log(`Sensor ${i + 1} data: ${sensorData[i].join(', ')}`);
  }
}

function InitializeOptions() {
  for (let i = 0; i < n; i++) {
    const label = `Sensor ${i + 1}`;
    const dataValues = sensorData[i];
    const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const priority = sensorPriority[i];

    const sensor = new Sensor(label, dataValues, borderColor, priority);
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
