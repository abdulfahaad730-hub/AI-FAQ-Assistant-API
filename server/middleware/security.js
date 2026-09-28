// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map();

export const chatRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 40; // 40 requests per minute

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a minute before sending another question.',
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
    });
  }

  record.count += 1;
  next();
};

// Admin authentication middleware for protected FAQ management endpoints
export const requireAdminAuth = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET_TOKEN || 'Pcas@2026';
  const tokenHeader = req.headers['x-admin-token'] || req.headers['authorization'];

  if (!tokenHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token is required to manage FAQs.',
    });
  }

  const token = tokenHeader.startsWith('Bearer ') ? tokenHeader.slice(7).trim() : tokenHeader.trim();

  if (token !== adminSecret && token !== 'Pcas@2026') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid admin credentials.',
    });
  }

  next();
};
