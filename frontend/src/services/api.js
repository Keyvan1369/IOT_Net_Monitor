
const API_URL = "http://localhost:3001/api";

export async function getDevices() {
  const response = await fetch(`${API_URL}/devices`);

  if (!response.ok) {
    throw new Error("Failed to fetch devices");
  }

  return response.json();
}

export async function getLatestSensors() {
  const response = await fetch(`${API_URL}/sensors/latest`);

  if (!response.ok) {
    throw new Error("Failed to fetch sensor readings");
  }

  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}
