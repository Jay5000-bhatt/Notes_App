import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: true, // Secure flag only for HTTPS in production
    sameSite: "None", // In development, you can use "Lax"
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};

export const protect = (req, res, next) => {
  try {
    const token = req.cookies.token; // Extract token from cookies

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Set the user object in req for further use in other routes
    req.user = { userId: decoded.userId }; // Ensure consistent naming

    next(); // Pass to next middleware or route
  } catch (error) {
    console.error("Token verification failed:", error.message); // Log errors for debugging
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
