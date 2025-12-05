import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import Card from "../components/Card"
import api from "../utils/api"

export default function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", response.data.token)
      setIsAuthenticated(true)
      navigate("/chat")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold">💬 Team Chat</h1>
          <p className="text-gray-400 text-sm mt-2">Real-time messaging platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded text-sm">{error}</div>
          )}

          <Button type="submit" variant="primary" disabled={loading} className="w-full text-base">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}
