export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  className = "",
  onKeyPress = null,
  required = false,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      disabled={disabled}
      required={required}
      className={`w-full px-4 py-2 md:py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all min-h-10 text-sm md:text-base ${className}`}
    />
  )
}
