
import { useState } from "react";

function DeviceTable({ devices }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const deviceTypes = [
    "All",
    ...new Set(devices.map((device) => device.type)),
  ];

  const filteredDevices = devices.filter((device) => {
    const query = search.toLowerCase();

    const matchesSearch =
      device.name.toLowerCase().includes(query) ||
      device.ip.toLowerCase().includes(query);

    const matchesType =
      typeFilter === "All" || device.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <>
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-7">
          <div className="input-group">
            <span className="input-group-text search-addon">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control search-input"
              placeholder="Search device name or IP..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-5">
          <select
            className="form-select search-input"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            {deviceTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All device types" : type}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            {filteredDevices.map((device) => (
              <tr key={device.id}>
                <td>
                  <i className="bi bi-hdd-network me-2 table-device-icon"></i>
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

            {filteredDevices.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No matching devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="device-count mt-3 mb-0">
        Showing {filteredDevices.length} of {devices.length} devices
      </p>
    </>
  );
}

export default DeviceTable;
