interface StatCardProps {
  title: string
  amount: string
  color: 'green' | 'red'
  className?: string
}

const colorStyles = {
  green: {
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    icon: 'bg-green-600',
    text: 'text-green-700'
  },
  red: {
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    icon: 'bg-red-600',
    text: 'text-red-700'
  }
}

export default function StatCard({ title, amount, color, className }: StatCardProps) {
  const style = colorStyles[color]
  return (
    <div
      className={`rounded-xl bg-white/70 backdrop-blur p-6 shadow-sm border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-fadeIn ${style.border} ${className || ''}`}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${style.iconBg}`}>
          <div className={`w-6 h-6 rounded ${style.icon}`}></div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
          <p className={`text-3xl font-bold ${style.text}`}>{amount}</p>
        </div>
      </div>
    </div>
  )
}
