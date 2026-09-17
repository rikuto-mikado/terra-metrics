/**
 * Calculate saturation vapor pressure deficit (VPD: kPa) from temperature (℃) and humidity (%)
 * Ideal value: 0.8-1.2 kPa
 */
export function calculateVPD(temperature: number, humidity: number): number {
  const svp = 0.61078 * Math.exp((17.27 * temperature) / (temperature + 237.3))
  const avp = svp * (humidity / 100)
  const vpd = svp - avp
  return Math.round(vpd * 100) / 100
}

/**
 * Determine morning/afternoon/night based on measurement time
 * Morning: 05:00 - 10:59
 * Afternoon: 11:00 - 16:59
 * Night: 17:00 - 04:59
 */
export function getTimeSlot(date: Date = new Date()): 'morning' | 'afternoon' | 'night' {
  const hour = date.getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'afternoon'
  return 'night'
}