const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Static device list
// const devices = [
//   { id: 1, name: "Temperature Sensor A", location: "Factory Floor" },
//   { id: 2, name: "Humidity Sensor B", location: "Warehouse" },
//   { id: 3, name: "Voltage Monitor C", location: "Control Room" },
// ];
const devices = 
[
  { "id": 1, "name": "Temperature Sensor A", "status": "online", "battery": 76, "location": "Room 101" },
  { "id": 2, "name": "Humidity Sensor B", "status": "offline", "battery": 15, "location": "Room 202" },
  { "id": 3, "name": "Pressure Sensor C", "status": "online", "battery": 54, "location": "Warehouse" },
  { "id": 4, "name": "Energy Meter D", "status": "online", "battery": 9, "location": "Floor 3" },
  { "id": 5, "name": "CO2 Sensor E", "status": "offline", "battery": 34, "location": "Lab 1" },
  { "id": 6, "name": "Motion Detector F", "status": "online", "battery": 88, "location": "Entrance" },
  { "id": 7, "name": "Water Leak Sensor G", "status": "online", "battery": 62, "location": "Basement" },
  { "id": 8, "name": "Voltage Monitor H", "status": "offline", "battery": 23, "location": "Control Room" },
  { "id": 9, "name": "Smoke Detector I", "status": "online", "battery": 47, "location": "Hallway" },
  { "id": 10, "name": "Light Sensor J", "status": "online", "battery": 91, "location": "Office 5" },
  { "id": 11, "name": "Vibration Sensor K", "status": "offline", "battery": 12, "location": "Machine Area" },
  { "id": 12, "name": "Thermal Camera L", "status": "online", "battery": 67, "location": "Server Room" },
  { "id": 13, "name": "Current Sensor M", "status": "online", "battery": 39, "location": "Panel Board" },
  { "id": 14, "name": "Gas Sensor N", "status": "offline", "battery": 5, "location": "Storage" },
  { "id": 15, "name": "Humidity Sensor O", "status": "online", "battery": 72, "location": "Room 303" }
]

// In-memory storage for dynamic readings
let readings = {};

function generateReading(deviceId) {
  return {
    deviceId,
    temperature: (20 + Math.random() * 10).toFixed(2),
    humidity: (40 + Math.random() * 20).toFixed(2),
    voltage: (210 + Math.random() * 20).toFixed(2),
    timestamp: Date.now(),
  };
}

// Device list endpoint
app.get("/devices", (req, res) => {
  res.json(devices);
});

// // Device live data endpoint
// app.get("/devices/:id/data", (req, res) => {
//   const deviceId = parseInt(req.params.id);

//   if (!readings[deviceId]) {
//     readings[deviceId] = [];
//   }

//   const newReading = generateReading(deviceId);
//   readings[deviceId].push(newReading);

//   if (readings[deviceId].length > 20) {
//     readings[deviceId].shift();
//   }

//   res.json(readings[deviceId]);
// });

//devices live data endpoint
app.get("/devices/:id/data", (req, res) => {
  const deviceId = parseInt(req.params.id);
  const device = devices.find(d => d.id === deviceId);

  if (!device) {
    return res.status(404).json({ error: "Device not found" });
  }

  if (device.status === "offline") {
  return res.status(503).json({
    error: "Device is offline"
  });
}

  if (!readings[deviceId]) {
    readings[deviceId] = [];
  }

  const newReading = {
    timestamp: Date.now(),
    metrics: {
      value: (20 + Math.random() * 10).toFixed(2)
    }
  };

  readings[deviceId].push(newReading);

  if (readings[deviceId].length > 20) {
    readings[deviceId].shift();
  }

  res.json({
    deviceId,
    meta: {
      type: device.name.includes("Temperature") ? "temperature" : "generic",
      unit: device.name.includes("Temperature") ? "°C" : "units"
    },
    results: readings[deviceId]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});