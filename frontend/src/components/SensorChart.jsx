
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function SensorChart({ data = [] }) {
  const chartData = data.map((reading) => ({
    time: new Date(reading.receivedAt).toLocaleTimeString(),
    temperature: reading.temperature ?? null,
    humidity: reading.humidity ?? null,
  }));

  return (
    <div className="card dashboard-card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Sensor History</h5>
          <small className="text-secondary">
            Live updates from backend
          </small>
        </div>

        <span className="badge bg-success">
          {data.length} Readings
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="text-secondary py-5 text-center">
          No sensor data available yet.
        </div>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343a40" />

              <XAxis
                dataKey="time"
                stroke="#adb5bd"
                tick={{ fontSize: 11 }}
              />

              <YAxis stroke="#adb5bd" />

              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#ff7043"
                strokeWidth={2}
                connectNulls
              />

              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#42a5f5"
                strokeWidth={2}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SensorChart;
