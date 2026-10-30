import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const requireCompanyAccess = (req, res, next) => {
  const companyId = req.params?.company_id || req.params?.id || req.body?.company_id || req.query?.company_id;
  const userCompanyId = req.user?.company_id;
  const userRole = req.user?.role;

  // Super admin can access any company
  if (userRole === 'super_admin') {
    return next();
  }

  // Company users must access their own company
  if (!companyId || companyId !== userCompanyId) {
    return res.status(403).json({ error: 'Access denied to this company' });
  }

  next();
};