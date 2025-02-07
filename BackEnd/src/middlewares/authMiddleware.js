import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
   
    console.log('Auth Check:', {
      path: req.path,
      hasAuthHeader: !!authHeader,
      method: req.method
    });

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        details: 'Valid Bearer token required'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        details: 'Token not provided'
      });
    }


    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });

    if (!decoded.userId || !decoded.email) {
      return res.status(401).json({
        error: 'Invalid token',
        details: 'Token payload is incomplete'
      });
    }

    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Authentication failed',
        details: 'User not found or inactive'
      });
    }

    
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Authentication Error:', {
      message: error.message,
      name: error.name,
      path: req.path
    });

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Authentication failed',
        details: 'Invalid or expired token'
      });
    }

    return res.status(500).json({
      error: 'Authentication error',
      details: 'An unexpected error occurred'
    });
  } finally {
    await prisma.$disconnect();
  }
};


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


router.get('/preparations', 
  protect, 
  requireRole(['ADMIN', 'STAFF']), 
  async (req, res) => {
    try {
      const preparations = await prisma.preparation.findMany({
        where: {
          userId: req.user.id
        }
      });
      
      res.json(preparations);
    } catch (error) {
      console.error('Route Error:', error);
      res.status(500).json({
        error: 'Failed to fetch preparations'
      });
    }
});

export default router;