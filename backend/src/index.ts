import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'
import { prisma } from './db.js'
import { calculateVPD, getTimeSlot } from './utils/metrics.js'

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

// Health check with DB connection check
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) })
  }
})

// 1. Receive sensor data from edge and store in DB
app.post('/api/metrics', async (req: Request, res: Response) => {
  try {
    const { temperature, humidity, soil_moisture, captured_at } = req.body
    if (temperature === undefined || humidity === undefined || soil_moisture === undefined) {
      return res.status(400).json({ error: 'Missing required sensor values: temperature, humidity, soil_moisture' })
    }

    const timestamp = captured_at ? new Date(captured_at) : new Date()
    const vpd = calculateVPD(Number(temperature), Number(humidity))
    const timeSlot = getTimeSlot(timestamp)

    const record = await prisma.metric.create({
      data: {
        temperature: Number(temperature),
        humidity: Number(humidity),
        soilMoisture: Number(soil_moisture),
        vpd,
        timeSlot,
        capturedAt: timestamp,
      },
    })

    console.log(`[Metric Saved] ID:${record.id} Slot:${timeSlot} Temp:${temperature}℃ Hum:${humidity}% VPD:${vpd}kPa`)
    res.status(201).json({ success: true, data: record })
  } catch (error) {
    console.error('Failed to save metric:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 2. Fetch metrics list for frontend
app.get('/api/metrics', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500)
    const metrics = await prisma.metric.findMany({
      take: limit,
      orderBy: { capturedAt: 'desc' },
    })
    res.json(metrics)
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 3. Aggregate statistics (overall summary & breakdown by timeSlot)
app.get('/api/metrics/stats', async (_req: Request, res: Response) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days

    const aggregate = await prisma.metric.aggregate({
      where: { capturedAt: { gte: since } },
      _avg: { temperature: true, humidity: true, soilMoisture: true, vpd: true },
      _max: { temperature: true, humidity: true, soilMoisture: true },
      _min: { temperature: true, humidity: true, soilMoisture: true },
      _count: { id: true },
    })

    const byTimeSlot = await prisma.metric.groupBy({
      by: ['timeSlot'],
      where: { capturedAt: { gte: since } },
      _avg: { temperature: true, humidity: true, soilMoisture: true, vpd: true },
      _count: { id: true },
    })

    res.json({
      period: 'last_7_days',
      totalCount: aggregate._count.id,
      summary: {
        avg: aggregate._avg,
        max: aggregate._max,
        min: aggregate._min,
      },
      byTimeSlot,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
