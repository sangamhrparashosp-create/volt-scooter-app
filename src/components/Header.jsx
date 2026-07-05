export default function Header({ title, action, className = '' }) {
  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-4">
      <h1 className={`font-display text-xl font-semibold ${className || 'text-ink'}`}>{title}</h1>
      {action}
    </header>
  )
}
