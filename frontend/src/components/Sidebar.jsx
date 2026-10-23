
const menuItems = [
  { name: "Overview", icon: "bi-grid-1x2" },
  { name: "Devices", icon: "bi-hdd-network" },
  { name: "Sensors", icon: "bi-thermometer-half" },
  { name: "Alerts", icon: "bi-bell" },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <i className="bi bi-activity"></i>
        <span>EKA</span>
      </div>

      <p className="sidebar-label">MONITORING</p>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        Local Network
        
      </div>
    </aside>
  );
}

export default Sidebar;
