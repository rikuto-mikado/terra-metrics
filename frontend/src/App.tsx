import { useState, useEffect, useCallback } from 'react'
import {
  Thermometer,
  Droplets,
  Sprout,
  Activity,
  RefreshCw,
  Server,
} from 'lucide-react'
import { fetchHealth, fetchMetrics, fetchStats } from './services/api'
import type { HealthStatus, Metric, StatsResponse } from './types'
import { MetricCard } from './components/MetricCard'
import { VpdBadge } from './components/VpdBadge'
import { MetricsChart } from './components/MetricsChart'
import { TimeSlotCard } from './components/TimeSlotCard'

export default function App() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadData = useCallback(async () => {
    try {
      const [healthRes, metricsRes, statsRes] = await Promise.all([
        fetchHealth().catch(() => null),
        fetchMetrics(30).catch(() => []),
        fetchStats().catch(() => null),
      ])
      setHealth(healthRes)
      setMetrics(metricsRes)
      setStats(statsRes)
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!autoRefresh) return
    const timer = setInterval(() => {
      loadData()
    }, 5000)
    return () => clearInterval(timer)
  }, [autoRefresh, loadData])

  const latest = metrics[0] || null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">terra-metrics</h1>
              <p className="text-xs text-slate-500">Agricultural Environment Monitoring Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Backend Connection Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600">Backend:</span>
              <span className={`inline-block w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="font-medium text-slate-700">{health?.status === 'ok' ? 'Connected' : 'Offline'}</span>
            </div>

            {/* Auto Refresh Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Auto Refresh (5s)
            </label>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={() => loadData()}
              disabled={isLoading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status Bar */}
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>
            {latest ? `Latest Observation: ${new Date(latest.capturedAt).toLocaleTimeString()}` : 'Waiting for observation data...'}
          </span>
          <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>

        {/* 1. Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Vapor Pressure Deficit (VPD)"
            value={latest?.vpd ?? null}
            unit="kPa"
            subtext="Optimal: 0.8 - 1.2 kPa"
            icon={<Activity className="w-5 h-5 text-emerald-600" />}
            badge={<VpdBadge vpd={latest?.vpd ?? null} />}
          />
          <MetricCard
            title="Temperature"
            value={latest?.temperature ?? null}
            unit="°C"
            subtext="Ambient temperature"
            icon={<Thermometer className="w-5 h-5 text-orange-500" />}
          />
          <MetricCard
            title="Relative Humidity"
            value={latest?.humidity ?? null}
            unit="%"
            subtext="Air humidity"
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
          />
          <MetricCard
            title="Soil Moisture"
            value={latest?.soilMoisture ?? null}
            unit="%"
            subtext="Root-zone soil"
            icon={<Sprout className="w-5 h-5 text-indigo-500" />}
          />
        </div>

        {/* 2. Environmental Metrics Trend Chart */}
        <MetricsChart data={metrics} />

        {/* 3. Summary by Time Slot */}
        <TimeSlotCard slots={stats?.byTimeSlot || []} />

        {/* 4. Recent Observation Logs Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-semibold text-slate-800 mb-3">Recent Observation Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Time Slot</th>
                  <th className="py-2.5 px-3">Temp (°C)</th>
                  <th className="py-2.5 px-3">Humidity (%)</th>
                  <th className="py-2.5 px-3">Soil Moisture (%)</th>
                  <th className="py-2.5 px-3">VPD (kPa)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.slice(0, 10).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono">{new Date(m.capturedAt).toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {m.timeSlot || '--'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">{m.temperature.toFixed(1)}</td>
                    <td className="py-2.5 px-3 font-medium">{m.humidity.toFixed(1)}</td>
                    <td className="py-2.5 px-3 font-medium">{m.soilMoisture.toFixed(1)}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-emerald-600">{m.vpd?.toFixed(2) ?? '--'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
