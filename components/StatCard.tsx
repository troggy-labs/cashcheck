import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  amount: string
  color: 'green' | 'red'
  icon: LucideIcon
  className?: string
}

const colorStyles = {
  green: {
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    icon: 'text-emerald-600',
    text: 'text-emerald-700'
  },
  red: {
    border: 'border-rose-200',
    iconBg: 'bg-rose-100',
    icon: 'text-rose-600',
    text: 'text-rose-700'
  }
}

export default function StatCard({ title, amount, color, icon: Icon, className }: StatCardProps) {
  const style = colorStyles[color]
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fadeIn ${style.border} ${className || ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className={`mt-1 text-3xl font-bold ${style.text}`}>{amount}</p>
        </div>
        <div className={`p-3 rounded-full ${style.iconBg}`}>
          <Icon className={`w-6 h-6 ${style.icon}`} />
        </div>
      </div>
    </div>
  )
}
