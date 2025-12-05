import jwt from "jsonwebtoken"

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_here")
}

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" })
  }
}
