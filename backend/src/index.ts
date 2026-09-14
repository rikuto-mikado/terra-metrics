import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'

// Load from current directory or root directory
const rootEnvPath = path.resolve(process.cwd(), '../.env')
const cwdEnvPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(cwdEnvPath)) {
  dotenv.config({ path: cwdEnvPath })
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath })
} else {
  dotenv.config()
}

const app = express()
const PORT = process.env.PORT || process.env.BACKEND_PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json())

// In-memory metrics storage
interface MetricData {
  temperature: number
  humidity: number
  soil_moisture: number
  timestamp?: string
}

const metricsHistory: MetricData[] = []

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Receive sensor data from edge
app.post('/api/metrics', (req: Request, res: Response) => {
  const data = req.body as MetricData
  const metricWithTime: MetricData = {
    ...data,
    timestamp: new Date().toISOString(),
  }
  metricsHistory.push(metricWithTime)
  // Keep last 100 entries
  if (metricsHistory.length > 100) {
    metricsHistory.shift()
  }

  console.log(`[Metrics Received]:`, metricWithTime)
  res.status(201).json({ success: true, received: metricWithTime })
})

// Provide metrics data to frontend
app.get('/api/metrics', (_req: Request, res: Response) => {
  res.json(metricsHistory)
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
