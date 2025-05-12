import { FastifyInstance } from "fastify";
import { PrismaClient, Simulation } from '../generated/prisma';
import { verifyToken } from '../utils/auth';

const prisma = new PrismaClient();

export function initSimulations(server: FastifyInstance) {
    // Get all simulations for the authenticated user
    server.get('/simulations', async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = await verifyToken(token);
            if (!userId) {
                return reply.status(401).send({ error: 'Invalid token' });
            }

            const simulations = await prisma.simulation.findMany({
                where: { userId: Number(userId) },
                orderBy: { updatedAt: 'desc' }
            });

            return reply.send(simulations);
        } catch (error) {
            console.error('Error fetching simulations:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Create a new simulation
    server.post('/simulations', async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = await verifyToken(token);
            if (!userId) {
                return reply.status(401).send({ error: 'Invalid token' });
            }

            const simulationData = request.body as unknown as Simulation;
            const simulation = await prisma.simulation.create({
                data: {
                    ...simulationData,
                    userId: Number(userId),
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as never
            });

            return reply.status(201).send(simulation);
        } catch (error) {
            console.error('Error creating simulation:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Delete a simulation
    server.post('/simulations/delete', async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = await verifyToken(token);
            if (!userId) {
                return reply.status(401).send({ error: 'Invalid token' });
            }

            const { id } = request.body as { id: string };

            // Verify the simulation belongs to the user
            const simulation = await prisma.simulation.findFirst({
                where: { id, userId: Number(userId) }
            });

            if (!simulation) {
                return reply.status(404).send({ error: 'Simulation not found' });
            }

            await prisma.simulation.delete({
                where: { id }
            });

            return reply.status(204).send();
        } catch (error) {
            console.error('Error deleting simulation:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Bulk delete simulations
    server.post('/simulations/bulk-delete', async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const userId = await verifyToken(token);
            if (!userId) {
                return reply.status(401).send({ error: 'Invalid token' });
            }

            const { ids } = request.body as { ids: string[] };

            // Verify all simulations belong to the user
            const simulations = await prisma.simulation.findMany({
                where: { id: { in: ids }, userId: Number(userId) }
            });

            if (simulations.length !== ids.length) {
                return reply.status(404).send({ error: 'One or more simulations not found' });
            }

            await prisma.simulation.deleteMany({
                where: { id: { in: ids } }
            });

            return reply.status(204).send();
        } catch (error) {
            console.error('Error bulk deleting simulations:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
} 