
const RASPBERRY_API =
  process.env.RASPBERRY_API ||
  "http://192.168.10.2:8000/api/environment/latest";

let latestEnvironment = null;
let connectionStatus = "unknown";
let lastSuccessfulUpdate = null;
let lastError = null;

async function fetchEnvironment() {
  try {
    const response = await fetch(RASPBERRY_API, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Raspberry Pi API returned ${response.status}`);
    }

    const data = await response.json();

    const valid =
      typeof data.temp_aht20 === "number" &&
      typeof data.humidity === "number" &&
      typeof data.pressure === "number" &&
      typeof data.temp_bmp280 === "number";

    if (!valid) {
      throw new Error("Invalid environment data received");
    }

    latestEnvironment = data;
    connectionStatus = "online";
    lastSuccessfulUpdate = new Date().toISOString();
    lastError = null;

    return data;
  } catch (error) {
    connectionStatus = "offline";
    lastError = error.message;

    console.error("[Raspberry Pi]", error.message);

    return null;
  }
}

function getEnvironmentStatus() {
  return {
    data: latestEnvironment,
    status: connectionStatus,
    lastSuccessfulUpdate,
    lastError,
  };
}

module.exports = {
  fetchEnvironment,
  getEnvironmentStatus,
};
