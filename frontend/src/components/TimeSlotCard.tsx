import type { TimeSlotSummary } from '../types'

interface TimeSlotCardProps {
  slots: TimeSlotSummary[]
}

const slotLabels: Record<string, { label: string; period: string }> = {
  morning: { label: 'Morning', period: '05:00 - 10:59' },
  afternoon: { label: 'Afternoon', period: '11:00 - 16:59' },
  night: { label: 'Night', period: '17:00 - 04:59' },
}

export function TimeSlotCard({ slots }: TimeSlotCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <h2 className="text-base font-semibold text-slate-800 mb-1">Summary by Time Slot</h2>
      <p className="text-xs text-slate-500 mb-4">Average values by time slot (past 7 days)</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['morning', 'afternoon', 'night'].map((slotKey) => {
          const item = slots.find((s) => s.timeSlot === slotKey)
          const meta = slotLabels[slotKey]

          return (
            <div key={slotKey} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-700">{meta.label}</span>
                <span className="text-xs text-slate-500">{item ? `${item._count.id} records` : '0 records'}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">{meta.period}</p>

              {item && item._avg ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Temperature</span>
                    <span className="font-semibold text-slate-700">{item._avg.temperature?.toFixed(1) ?? '--'} °C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Humidity</span>
                    <span className="font-semibold text-slate-700">{item._avg.humidity?.toFixed(1) ?? '--'} %</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg VPD</span>
                    <span className="font-semibold text-emerald-600">{item._avg.vpd?.toFixed(2) ?? '--'} kPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Soil Moisture</span>
                    <span className="font-semibold text-slate-700">{item._avg.soilMoisture?.toFixed(1) ?? '--'} %</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-3 text-center">No data</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
