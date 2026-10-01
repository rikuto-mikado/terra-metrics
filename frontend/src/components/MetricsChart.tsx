import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { Metric } from '../types'

interface MetricsChartProps {
  data: Metric[]
}

type ChartTab = 'vpd' | 'climate' | 'soil'

export function MetricsChart({ data }: MetricsChartProps) {
  const [tab, setTab] = useState<ChartTab>('vpd')

  // Reverse data order (ascending by time) since backend returns newest first
  const chartData = [...data].reverse().map((item) => {
    const d = new Date(item.capturedAt)
    return {
      time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`,
      vpd: item.vpd,
      temperature: item.temperature,
      humidity: item.humidity,
      soilMoisture: item.soilMoisture,
    }
  })

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Environmental Metrics Trend</h2>
          <p className="text-xs text-slate-500">Recent {data.length} observations</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('vpd')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              tab === 'vpd' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            VPD
          </button>
          <button
            type="button"
            onClick={() => setTab('climate')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              tab === 'climate' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Temp &amp; Humidity
          </button>
          <button
            type="button"
            onClick={() => setTab('soil')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              tab === 'soil' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Soil Moisture
          </button>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No observation data available. Waiting for Edge transmission...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

              {tab === 'vpd' && (
                <Line
                  type="monotone"
                  dataKey="vpd"
                  name="VPD (kPa)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              )}

              {tab === 'climate' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°C)"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity (%)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </>
              )}

              {tab === 'soil' && (
                <Line
                  type="monotone"
                  dataKey="soilMoisture"
                  name="Soil Moisture (%)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
