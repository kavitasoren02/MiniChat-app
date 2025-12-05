export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      {children}
    </div>
  )
}
