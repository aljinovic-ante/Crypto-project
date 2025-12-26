import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function PriceChart({ data, title, yLabel, currency, yMax }) {
  return (
    <div className="border-t border-white/10 pt-8">
      <div className="text-sm text-slate-400 mb-4 text-center">
        {title}
      </div>

      <div className="w-full h-[650px]">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 30, right: 60, left: 100, bottom: 90 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#334155" />

            <XAxis
              dataKey="date"
              interval={4}
              angle={-35}
              textAnchor="end"
              tick={{ fill: "#cbd5f5", fontSize: 10 }}
              axisLine={{ stroke: "#64748b" }}
              tickLine={{ stroke: "#64748b" }}
              label={{
                value: "Date",
                position: "bottom",
                offset: 65,
                fill: "#e2e8f0"
              }}
            />

            <YAxis
              domain={[0, yMax]}
              tick={{ fill: "#cbd5f5", fontSize: 12 }}
              axisLine={{ stroke: "#64748b" }}
              tickLine={{ stroke: "#64748b" }}
              tickFormatter={(v) =>
                v.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }
              label={{
                value: yLabel,
                angle: -90,
                position: "left",
                offset: 70,
                fill: "#e2e8f0"
              }}
            />

            <Tooltip
              formatter={(v) =>
                `${v.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ${currency}`
              }
              contentStyle={{
                backgroundColor: "#ffffff",
                color: "#000000",
                borderRadius: "8px",
                border: "none"
              }}
              labelStyle={{ color: "#000000" }}
              itemStyle={{ color: "#000000" }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
