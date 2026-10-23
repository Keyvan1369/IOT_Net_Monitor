
function DeviceTable({ devices }) {
  return (
    <div className="table-responsive">
      <table className="table device-table align-middle mb-0">
        <thead>
          <tr>
            <th>Device</th>
            <th>Type</th>
            <th>IP Address</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>
                <i className="bi bi-hdd-network me-2"></i>
                {device.name}
              </td>
              <td>{device.type}</td>
              <td>
                <code>{device.ip}</code>
              </td>
              <td>
                <span
                  className={`device-status ${
                    device.status === "Online" ? "online" : "offline"
                  }`}
                >
                  <span className="status-dot"></span>
                  {device.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeviceTable;
