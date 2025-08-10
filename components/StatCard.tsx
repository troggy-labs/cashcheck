import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  amount: string
  color: 'success' | 'danger'
  icon: LucideIcon
  className?: string
}

const colorStyles = {
  success: {
    gradient: 'from-success-50 to-success-100/50',
    border: 'border-success-200/60',
    iconBg: 'bg-success-100',
    icon: 'text-success-600',
    text: 'text-success-700',
    shadow: 'shadow-success-200/20'
  },
  danger: {
    gradient: 'from-danger-50 to-danger-100/50',
    border: 'border-danger-200/60',
    iconBg: 'bg-danger-100',
    icon: 'text-danger-600',
    text: 'text-danger-700',
    shadow: 'shadow-danger-200/20'
  }
}

export default function StatCard({ title, amount, color, icon: Icon, className }: StatCardProps) {
  const style = colorStyles[color]
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} backdrop-blur-sm border ${style.border} shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-slideUp p-6 ${className || ''}`}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-brand-600 uppercase tracking-wide mb-2">{title}</h3>
          <p className={`text-4xl font-bold ${style.text} tracking-tight`}>{amount}</p>
        </div>
        <div className={`flex-shrink-0 p-4 rounded-2xl ${style.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-7 h-7 ${style.icon}`} />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
    </article>
  )
}
