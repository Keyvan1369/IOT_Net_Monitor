import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import DeviceTable from "./components/DeviceTable";
import SensorChart from "./components/SensorChart";
import {
  getDevices,
  getLatestSensors,
  getHealth,
  getSensorHistory,
  getEnvironmentLatest,
} from "./services/api";
import { io } from "socket.io-client";

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [devices, setDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [backendStatus, setBackendStatus] = useState("Checking");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [environment, setEnvironment] = useState(null);
  const [raspberryStatus, setRaspberryStatus] = useState("Checking");
  const [lastEnvironmentUpdate, setLastEnvironmentUpdate] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [deviceData, sensorData, healthData, historyData] =
          await Promise.all([
            getDevices(),
            getLatestSensors(),
            getHealth(),
            getSensorHistory(),
          ]);

        if (cancelled) return;

        setDevices(Array.isArray(deviceData) ? deviceData : []);
        setSensors(Array.isArray(sensorData) ? sensorData : []);
        setSensorHistory(Array.isArray(historyData) ? historyData : []);
        setBackendStatus(healthData?.status === "ok" ? "Online" : "Offline");
        setError("");

        try {
          const environmentData = await getEnvironmentLatest();
          if (cancelled) return;

          setEnvironment(environmentData?.data ?? null);
          setRaspberryStatus(
            environmentData?.status === "online" ? "Online" : "Offline"
          );
          setLastEnvironmentUpdate(
            environmentData?.lastSuccessfulUpdate ?? null
          );
        } catch {
          if (cancelled) return;
          setRaspberryStatus("Offline");
        }
      } catch {
        if (cancelled) return;
        setBackendStatus("Offline");
        setError("Cannot connect to the backend. Check that it is running.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";

    const socket = io(SOCKET_URL);

    socket.on("environment:update", (payload) => {
      setEnvironment(payload?.data ?? null);
      setRaspberryStatus(
        payload?.status === "offline" ? "Offline" : "Online"
      );
      if (payload?.lastSuccessfulUpdate) {
        setLastEnvironmentUpdate(payload.lastSuccessfulUpdate);
      }
    });

    socket.on("environment:status", (statusPayload) => {
      setRaspberryStatus(
        statusPayload?.status === "online" ? "Online" : "Offline"
      );

      if (statusPayload?.lastSuccessfulUpdate) {
        setLastEnvironmentUpdate(statusPayload.lastSuccessfulUpdate);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const latestSensor = sensors.length > 0 ? sensors[sensors.length - 1] : null;
  const activeTemp =
    environment?.temperature ??
    environment?.temp_aht20 ??
    environment?.temp_bmp280 ??
    latestSensor?.temperature;
  const activeHumidity = environment?.humidity ?? latestSensor?.humidity;

  const tempValue =
    activeTemp != null ? `${Number(activeTemp).toFixed(1)} °C` : "N/A";
  const humidityValue =
    activeHumidity != null ? `${Number(activeHumidity).toFixed(1)}%` : "N/A";
  const aht20TempValue =
    environment?.temp_aht20 != null
      ? `${Number(environment.temp_aht20).toFixed(1)} °C`
      : "N/A";
  const bmp280TempValue =
    environment?.temp_bmp280 != null
      ? `${Number(environment.temp_bmp280).toFixed(1)} °C`
      : "N/A";
  const pressureValue =
    environment?.pressure != null
      ? `${Number(environment.pressure).toFixed(1)} hPa`
      : "N/A";
  const labelValue = environment?.label ?? "N/A";

  const onlineDevicesCount = devices.filter(
    (d) => d.status === "Online"
  ).length;
  const chartData = sensorHistory.length > 0 ? sensorHistory : sensors;

  return (
    <div className="dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h5>{activePage}</h5>
            <p>IoT Network Monitoring System</p>
          </div>

          <div className="d-flex gap-2">
            <span
              className={`connection-status ${raspberryStatus.toLowerCase()}`}
            >
              <span className="status-dot"></span>
              Raspberry Pi: {raspberryStatus}
            </span>

            <span className={`connection-status ${backendStatus.toLowerCase()}`}>
              <span className="status-dot"></span>
              Backend: {backendStatus}
            </span>
          </div>
        </header>

        {error && <div className="alert alert-danger m-3">{error}</div>}

        {loading ? (
          <div className="p-4 text-center">Loading dashboard data...</div>
        ) : (
          <>
            {activePage === "Overview" && (
              <>
                <section className="welcome-section">
                  <div>
                    <h2>Network Overview</h2>
                  </div>
                </section>

                <section className="row g-3 mb-4">
                  <StatCard
                    title="Total Devices"
                    value={devices.length}
                    icon="bi-hdd-network"
                    color="blue"
                    subtitle=""
                  />
                  <StatCard
                    title="Online Devices"
                    value={onlineDevicesCount}
                    icon="bi-check-circle"
                    color="green"
                    subtitle=""
                  />
                  <StatCard
                    title="Temperature"
                    value={tempValue}
                    icon="bi-thermometer-half"
                    color="orange"
                    subtitle={`AHT20: ${aht20TempValue} · BMP280: ${bmp280TempValue}`}
                  />
                  <StatCard
                    title="Humidity"
                    value={humidityValue}
                    icon="bi-droplet"
                    color="purple"
                    subtitle={`Pressure: ${pressureValue} · Status: ${labelValue}`}
                  />
                </section>

                <section className="row g-3 mb-4">
                  <div className="col-12">
                    <SensorChart data={chartData} />
                  </div>
                </section>

                <section className="row g-3">
                  <div className="col-12 col-xl-8">
                    <div className="panel h-100">
                      <div className="panel-heading">
                        <div>
                          <h5>Network Devices</h5>
                        </div>
                        <i className="bi bi-diagram-3 panel-icon"></i>
                      </div>

                      <DeviceTable devices={devices} />
                    </div>
                  </div>

                  <div className="col-12 col-xl-4">
                    <div className="panel h-100">
                      <div className="panel-heading">
                        <div>
                          <h5>Latest Sensor Readings</h5>
                        </div>
                      </div>

                      <div className="sensor-reading">
                        <i className="bi bi-thermometer-half sensor-symbol orange-text"></i>
                        <div>
                          <small>Temperature (AHT20 / BMP280)</small>
                          <h4>{tempValue}</h4>
                          <small className="text-secondary">
                            AHT20: {aht20TempValue} · BMP280: {bmp280TempValue}
                          </small>
                        </div>
                      </div>

                      <div className="sensor-reading">
                        <i className="bi bi-droplet sensor-symbol blue-text"></i>
                        <div>
                          <small>Humidity</small>
                          <h4>{humidityValue}</h4>
                          <small className="text-secondary">
                            Pressure: {pressureValue} · Label: {labelValue}
                          </small>
                        </div>
                      </div>

                      <div className="info-note">
                        {lastEnvironmentUpdate && (
                          <small className="text-secondary">
                            Last env update: {lastEnvironmentUpdate}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activePage === "Devices" && (
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h5>Network Devices</h5>
                    <p>Configured devices and IP addresses</p>
                  </div>
                </div>
                <DeviceTable devices={devices} />
              </div>
            )}

            {activePage === "Sensors" && (
              <div className="panel">
                <div className="panel-heading">
                  <h5>Sensor Monitoring</h5>
                </div>
                <p className="text-secondary mb-3">
                  Temperature: {tempValue} (AHT20: {aht20TempValue} · BMP280:{" "}
                  {bmp280TempValue}) · Humidity: {humidityValue} · Pressure:{" "}
                  {pressureValue} · Label: {labelValue}
                </p>

                <SensorChart data={chartData} />
              </div>
            )}

            {activePage === "Alerts" && (
              <div className="panel">
                <div className="panel-heading">
                  <h5>Alerts</h5>
                </div>
                <p className="text-secondary">
                  No real alerts are configured yet.
                </p>
              </div>
            )}
          </>
        )}

        <footer className="page-footer">EKA firma</footer>
      </main>
    </div>
  );
}

export default App;