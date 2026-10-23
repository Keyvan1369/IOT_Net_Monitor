
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT || 3001);
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: "20kb" }));

const io = new Server(server, {
  cors: { origin: FRONTEND_ORIGIN },
});

//sample data
const latestReadings = new Map();

const devices = [
  {
    id: "router",
    name: "Main Router",
    ip: "192.168.1.1",
    type: "Router",
  },
  {
    id: "switch",
    name: "Core Switch",
    ip: "192.168.1.2",
    type: "Switch",
  },
  {
    id: "web-server",
    name: "Web Server",
    ip: "192.168.1.10",
    type: "Server",
  },
  {
    id: "raspberry-pi",
    name: "Raspberry Pi",
    ip: "192.168.1.20",
    type: "Collector",
  },
  {
    id: "access-point",
    name: "Access Point",
    ip: "192.168.1.3",
    type: "Access Point",
  },
  {
    id: "esp32-01",
    name: "ESP32 Sensor 01",
    ip: "192.168.1.101",
    type: "Microcontroller",
  },
];

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "iot-network-monitor",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/devices", (req, res) => {
  res.json(devices);
});

app.get("/api/sensors/latest", (req, res) => {
  res.json(Array.from(latestReadings.values()));
});

app.post("/api/sensors", (req, res) => {
  const { deviceId, temperature, humidity } = req.body;

  const validId =
    typeof deviceId === "string" &&
    /^[a-zA-Z0-9_-]{1,64}$/.test(deviceId);

  const validNumber = (value) =>
    value === undefined ||
    (typeof value === "number" && Number.isFinite(value));

  if (
    !validId ||
    (!validNumber(temperature)) ||
    (!validNumber(humidity)) ||
    (temperature === undefined && humidity === undefined)
  ) {
    return res.status(400).json({
      error: "Invalid sensor payload",
    });
  }

  const reading = {
    deviceId,
    ...(temperature !== undefined && { temperature }),
    ...(humidity !== undefined && { humidity }),
    receivedAt: new Date().toISOString(),
  };

  latestReadings.set(deviceId, reading);

  io.emit("sensor:update", reading);

  res.status(201).json({
    message: "Reading received",
    reading,
  });
});

io.on("connection", (socket) => {
  console.log("Dashboard connected:", socket.id);

  socket.emit("sensors:initial", Array.from(latestReadings.values()));

  socket.on("disconnect", () => {
    console.log("Dashboard disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Allowed frontend origin: ${FRONTEND_ORIGIN}`);
});
