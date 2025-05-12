import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, always use environment variable

export const verifyToken = async (token: string): Promise<string | null> => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}; 