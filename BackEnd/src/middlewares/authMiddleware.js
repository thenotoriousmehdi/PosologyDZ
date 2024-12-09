// Backend middleware
export const protect = async (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
  
    console.log('Backend Token Check:', {
      authHeader,
      path: req.path
    });
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }
  
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Attach user to the request object
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  };
  
  // Apply to specific routes
  router.get('/preparations', protect, (req, res) => {
    // Your route handler
  });