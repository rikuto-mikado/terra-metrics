import type { ReactNode } from 'react';

interface MetricCardProps {
    title: string
    value: string | number | null
    unit: string
    subtext?: string
    icon: ReactNode
    badge?: ReactNode
}

export function MetricCard({ title, value, unit, subtext, icon, badge }: MetricCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-500">{title}</span>
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">{icon}</div>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-slate-800">
                    {value !== null && value !== undefined ? value : '--'}
                </span>
                <span className="text-sm font-semibold text-slate-500">{unit}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
                {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
                {badge && <div>{badge}</div>}
            </div>
        </div>
      )
    }