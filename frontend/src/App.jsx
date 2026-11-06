import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import DeviceTable from "./components/DeviceTable";
import SensorChart from "./components/SensorChart";
import { getDevices, getLatestSensors, getHealth, getSensorHistory } from "./services/api";

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [devices, setDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [backendStatus, setBackendStatus] = useState("Checking");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [deviceData, sensorData, healthData, historyData] = await Promise.all([
          getDevices(),
          getLatestSensors(),
          getHealth(),
          getSensorHistory()
        ]);

        if (cancelled) return;

        setDevices(deviceData || []);
        setSensors(sensorData || []);
        setSensorHistory(historyData || []);
        setBackendStatus(healthData?.status === "ok" ? "Online" : "Offline");
        setError("");
      } catch (err) {
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

  const latestSensor = sensors.length > 0 ? sensors[sensors.length - 1] : null;
  const tempValue = latestSensor?.temperature != null ? `${latestSensor.temperature} °C` : "N/A";
  const humidityValue = latestSensor?.humidity != null ? `${latestSensor.humidity}%` : "N/A";
  const onlineDevicesCount = devices.filter((d) => d.status === "Online").length;

  return (
    <div className="dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h5>{activePage}</h5>
            <p>IoT Network Monitoring System</p>
            <p>test automation</p>


          </div>

          <span className={`connection-status ${backendStatus.toLowerCase()}`}>
            <span className="status-dot"></span>
            Backend: {backendStatus}
          </span>
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
                    subtitle=""
                  />
                  <StatCard
                    title="Humidity"
                    value={humidityValue}
                    icon="bi-droplet"
                    color="purple"
                    subtitle=""
                  />
                </section>

                <section className="row g-3 mb-4">
                  <div className="col-12">
                    <SensorChart data={sensorHistory.length > 0 ? sensorHistory : sensors} />
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
                          <small>Temperature</small>
                          <h4>{tempValue}</h4>
                        </div>
                      </div>

                      <div className="sensor-reading">
                        <i className="bi bi-droplet sensor-symbol blue-text"></i>
                        <div>
                          <small>Humidity</small>
                          <h4>{humidityValue}</h4>
                        </div>
                      </div>

                      <div className="info-note"></div>
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
                  Temperature: {tempValue} · Humidity: {humidityValue}
                </p>

                <SensorChart data={sensorHistory.length > 0 ? sensorHistory : sensors} />
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