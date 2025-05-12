import { FastifyInstance } from "fastify";
import { PrismaClient } from '../generated/prisma';
import { verifyToken } from '../utils/auth';

const prisma = new PrismaClient();

export function initUsers(server: FastifyInstance) {
    server.put('/users/me', async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = await verifyToken(token);
            if (!userId) {
                return reply.status(401).send({ error: 'Invalid token' });
            }

            const { firstName, lastName, name, email } = request.body as {
                firstName?: string;
                lastName?: string;
                name?: string;
                email?: string;
            };

            const updatedUser = await prisma.user.update({
                where: { id: Number(userId) },
                data: { firstName, lastName, name, email }
            });

            return reply.send(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}   
