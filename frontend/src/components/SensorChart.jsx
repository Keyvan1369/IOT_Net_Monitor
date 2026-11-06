import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Custom modern tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-3 shadow-lg border-0"
        style={{
          backgroundColor: "rgba(33, 37, 41, 0.85)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: "0.85rem",
        }}
      >
        <p className="fw-semibold mb-2 text-muted">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="d-flex align-items-center gap-2 mb-1">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: entry.color,
                display: "inline-block",
              }}
            />
            <span className="text-secondary">{entry.name}:</span>
            <span className="fw-bold ms-auto">{entry.value ?? "N/A"}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function SensorChart({ data = [] }) {
  const chartData = useMemo(() => {
    return data.map((reading) => ({
      time: reading.receivedAt
        ? new Date(reading.receivedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      temperature: reading.temperature ?? null,
      humidity: reading.humidity ?? null,
    }));
  }, [data]);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white">
      {/* Component Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-1">Sensor History</h5>
          <div className="d-flex align-items-center gap-2">
            <span
              className="spinner-grow spinner-grow-sm text-success"
              role="status"
              aria-hidden="true"
              style={{ width: "0.5rem", height: "0.5rem" }}
            />
            <small className="text-muted">Live backend updates</small>
          </div>
        </div>

        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
          {data.length} Readings
        </span>
      </div>

      {/* Chart or Empty State */}
      {chartData.length === 0 ? (
        <div
          className="d-flex align-items-center justify-content-center text-muted rounded-3"
          style={{ height: 320, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
        >
          No sensor data available yet.
        </div>
      ) : (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {/* Gradients */}
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7043" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ff7043" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#42a5f5" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" stroke="#2c3036" vertical={false} />

              <XAxis
                dataKey="time"
                stroke="#6c757d"
                tick={{ fontSize: 12, fill: "#adb5bd" }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#6c757d"
                tick={{ fontSize: 12, fill: "#adb5bd" }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "20px", fontSize: "0.85rem" }}
              />

              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#ff7043"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
                connectNulls
              />

              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#42a5f5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#humidityGradient)"
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SensorChart;