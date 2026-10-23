
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

const sensorData = [
  { time: "10:00", temperature: 23.1, humidity: 51 },
  { time: "10:05", temperature: 23.5, humidity: 53 },
  { time: "10:10", temperature: 24.0, humidity: 52 },
  { time: "10:15", temperature: 23.8, humidity: 56 },
  { time: "10:20", temperature: 24.6, humidity: 55.2 },
  { time: "10:25", temperature: 24.3, humidity: 54 },
  { time: "10:30", temperature: 24.8, humidity: 57 },
];

function SensorChart() {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h5>Sensor History</h5>
          <p>Temperature and humidity over time</p>
        </div>
        <span className="live-badge">DEMO DATA</span>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={sensorData}>
            <CartesianGrid stroke="#263247" strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              stroke="#8392aa"
              tick={{ fontSize: 11 }}
            />

            <YAxis
              yAxisId="temperature"
              stroke="#ffb66c"
              tick={{ fontSize: 11 }}
              domain={["auto", "auto"]}
            />

            <YAxis
              yAxisId="humidity"
              orientation="right"
              stroke="#69c5ff"
              tick={{ fontSize: 11 }}
              domain={[0, 100]}
            />

            <Tooltip
              contentStyle={{
                background: "#111c2e",
                border: "1px solid #263247",
                borderRadius: 8,
                color: "#e5edf8",
              }}
            />

            <Legend />

            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperature"
              name="Temperature (°C)"
              stroke="#ffb66c"
              strokeWidth={2}
              dot={false}
            />

            <Line
              yAxisId="humidity"
              type="monotone"
              dataKey="humidity"
              name="Humidity (%)"
              stroke="#69c5ff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SensorChart;
