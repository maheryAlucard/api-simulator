import { FastifyInstance } from "fastify";
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function initAuth(server: FastifyInstance) {
    server.post('/auth/login', async (request, reply) => {
        try {
            const { identifier } = request.body as { identifier: string };

            // Find or create user by email
            let user = await prisma.user.findUnique({
                where: { email: identifier }
            });

            if (!user) {
                // Create new user if doesn't exist
                user = await prisma.user.create({
                    data: {
                        email: identifier,
                        name: identifier.split('@')[0] // Use part before @ as default name
                    }
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Return response matching frontend expectations
            return reply.send({
                jwt: token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.name || user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return reply.status(500).send({ 
                error: 'Internal server error' 
            });
        }
    });
}