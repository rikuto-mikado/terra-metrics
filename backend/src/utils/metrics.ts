export function calculateVPD(temperature: number, humidity: number): number {
    const svp = 0.61078 * Math.exp((17.27 * temperature) / (temperature + 237.3))
    const avp = svp * (humidity / 100)
    const vpd = svp - avp
    return Math.round(vpd * 100) / 100
}