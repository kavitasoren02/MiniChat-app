export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  className = "",
}) {
  const baseClasses =
    "px-4 py-2 rounded font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-10 flex items-center justify-center whitespace-nowrap cursor-pointer"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    ghost: "text-gray-300 hover:bg-gray-700 active:bg-gray-600",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
