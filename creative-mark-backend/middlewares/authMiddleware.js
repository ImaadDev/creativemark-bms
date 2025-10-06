import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Debug logging
    console.log("Auth Middleware - Request cookies:", req.cookies);
    console.log("Auth Middleware - Request headers:", req.headers);
    
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader) {
        token = authHeader.replace('Bearer ', '');
      }
    }

    console.log("Auth Middleware - Token found:", !!token);

    if (!token) {
      console.log("Auth Middleware - No token found");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.user = decoded;
    console.log("Auth Middleware - User authenticated:", decoded.id, decoded.role);
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};





export default authMiddleware;
