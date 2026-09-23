interface VpdBadgeProps {
    vpd: number | null
}

export function VpdBadge({ vpd }: VpdBadgeProps) {
    if (vpd === null || vpd === undefined) {
        return <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text0gray-500">No data</span>
    }
    if (vpd < 0.5) {
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">High Humidity Alert</span>
    }
    if (vpd <= 1.2) {
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">Optimal Range</span>
    }
}