export const requireRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          details: 'User not authenticated'
        });
      }
  
    
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: 'Access denied',
          details: 'Insufficient permissions'
        });
      }
  

      next();
    };
  };
  