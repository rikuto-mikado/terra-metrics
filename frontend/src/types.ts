export interface Metric {
  id: number
  temperature: number
  humidity: number
  soilMoisture: number
  vpd: number | null
  timeSlot: 'morning' | 'afternoon' | 'night' | null
  capturedAt: string
}

export interface MetricSummary {
  avg: {
    temperature: number | null
    humidity: number | null
    soilMoisture: number | null
    vpd: number | null
  }
  max: {
    temperature: number | null
    humidity: number | null
    soilMoisture: number | null
  }
  min: {
    temperature: number | null
    humidity: number | null
    soilMoisture: number | null
  }
}

export interface TimeSlotSummary {
  timeSlot: 'morning' | 'afternoon' | 'night' | null
  _avg: {
    temperature: number | null
    humidity: number | null
    soilMoisture: number | null
    vpd: number | null
  }
  _count: {
    id: number
  }
}

export interface StatsResponse {
  period: string
  totalCount: number
  summary: MetricSummary
  byTimeSlot: TimeSlotSummary[]
}

export interface HealthStatus {
  status: string
  database: string
  timestamp: string
}
