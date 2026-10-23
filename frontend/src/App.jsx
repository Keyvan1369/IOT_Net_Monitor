import { useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import DeviceTable from "./components/DeviceTable";
import SensorChart from "./components/SensorChart";

const devices = [
  {
    id: 1,
    name: "Main Router",
    type: "Router",
    ip: "192.168.1.1",
    status: "Online",
  },
  {
    id: 2,
    name: "Core Switch",
    type: "Switch",
    ip: "192.168.1.2",
    status: "Online",
  },
  {
    id: 3,
    name: "Windows Server",
    type: "Server",
    ip: "192.168.1.10",
    status: "Online",
  },
  {
    id: 4,
    name: "Raspberry Pi",
    type: "Collector",
    ip: "192.168.1.20",
    status: "Online",
  },
  {
    id: 5,
    name: "Access Point",
    type: "Access Point",
    ip: "192.168.1.100",
    status: "Online",
  },
  {
    id: 6,
    name: "ESP32 Sensor 01",
    type: "Sensor",
    ip: "192.168.1.101",
    status: "Online",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");

  return (
    <div className="dashboard">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h5>{activePage}</h5>
            <p>IoT Network Monitoring System</p>
          </div>

          <span className="connection-status">
            <span className="status-dot"></span>
            Prototype Mode
          </span>
        </header>

        {activePage === "Overview" && (
          <>
            <section className="welcome-section">
              <div>
                <h2>Network Overview</h2>
                <p>Monitor your network and connected IoT devices.</p>
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
                value={devices.length}
                icon="bi-check-circle"
                color="green"
                subtitle=""
              />
              <StatCard
                title="Temperature"
                value="24.6 °C"
                icon="bi-thermometer-half"
                color="orange"
                subtitle=""
              />
              <StatCard
                title="Humidity"
                value="55.2%"
                icon="bi-droplet"
                color="purple"
                subtitle=""
              />
            </section>

            {/* اضافه شده: نمودار سنسورها در بخش Overview */}
            <section className="row g-3 mb-4">
              <div className="col-12">
                <SensorChart />
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
                      <h4>24.6 °C</h4>
                    </div>
                  </div>

                  <div className="sensor-reading">
                    <i className="bi bi-droplet sensor-symbol blue-text"></i>
                    <div>
                      <small>Humidity</small>
                      <h4>55.2%</h4>
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
              Temperature: 24.6 °C · Humidity: 55.2% (sample data)
            </p>
            
            <SensorChart />
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

        <footer className="page-footer">
          EKA firma
        </footer>
      </main>
    </div>
  );
}

export default App;