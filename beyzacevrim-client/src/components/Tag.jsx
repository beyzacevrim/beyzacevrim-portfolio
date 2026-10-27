export default function Tag({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-current px-3 py-1 font-mono text-xs leading-none tracking-tight ${className}`}
    >
      {children}
    </span>
  )
}
