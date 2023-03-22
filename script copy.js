const n = 10; // number of sensors
const deltaT = 2000; // experimentation period in milliseconds
const xv = []; // upper limit array
const xn = []; // lower limit array
const deltaXA = []; // emergency inter-set array
const sensorData = []; // array to store sensor data

// Initialize limits and emergency values for each sensor
for (let i = 0; i < n; i++) {
  // Initialize limits
  xv[i] = 55;
  xn[i] = 22;
  // Initialize emergency inter-set values
  deltaXA[i] = 0.5;
  // Initialize sensor data array
  sensorData[i] = [];
}
const canvas = document.getElementById('myChart');
const chart = new Chart(canvas, {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Sensor Data',
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
          labelString: 'Sensor Value',
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  },
});

// Run the sensor testing every deltaT milliseconds
setInterval(testAllSensors, deltaT);

// Run the printSensorData function every 10 seconds to print the sensor data to the console
setInterval(printSensorData, 10000);

// Run the updateChart function every 2 seconds to update the chart with new data
setInterval(updateChart, 11000);

// Define a function to test all sensors
function testAllSensors() {
  for (let i = 0; i < n; i++) {
    testSensor(i);
  }
}

// Define a function to generate random numbers within a range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min + 10;
}

// Define a function to test a single sensor
function testSensor(sensorIndex) {
  // Generate a random value within the limits and emergency inter-set values
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
}

// Define a function to print the sensor data to the console
function printSensorData() {
  for (let i = 0; i < n; i++) {
    console.log(`Sensor ${i + 1} data: ${sensorData[i].join(', ')}`);
  }
}

// Define a function to update the chart with new data
function updateChart() {
  // Check if the chart exists and has data
  if (!chart || !chart.data) {
    return;
  }

  // Add the current timestamp as a label
  chart.data.labels.push(new Date().toLocaleTimeString());

  // Add the latest sensor values to the datasets
  for (let i = 0; i < n; i++) {
    const latestValue = sensorData[i][sensorData[i].length - 1];
    chart.data.datasets[i].data.push(latestValue);
  }

  // Remove the oldest labels and data points if we have more than 10
  if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    for (let i = 0; i < n; i++) {
      chart.data.datasets[i].data.shift();
    }
  }

  // Update the chart
  chart.update();
}

// function shutdownComputer() {
//   const { exec } = require('child_process');

//   exec('shutdown /s /t 0', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`Stderr: ${stderr}`);
//       return;
//     }
//     console.log(`Shutdown initiated: ${stdout}`);
//   });
// }
