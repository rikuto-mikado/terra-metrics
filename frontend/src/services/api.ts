import type { HealthStatus, Metric, StatsResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE_URL}/api/health`)
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`)
        return res.json()
}
    
export async function fetchMetrics(limit: number = 50): Promise<Metric[]> {
    const res = await fetch(`${API_BASE_URL}/api/metrics?limit=${limit}`)
    if (!res.ok) throw new Error(`Failed to fetch metrics: ${res.statusText}`)
      return res.json()
}

export async function fetchStats(): Promise<StatsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/metrics/stats`)
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.statusText}`)
        return res.json()
}
