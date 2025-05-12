import fastify from 'fastify'
import { initAuth } from './routes/auth'
import cors from '@fastify/cors'
import { initSimulations } from './routes/simulations'
import { initUsers } from './routes/users'
const server = fastify()

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

// Register CORS plugin
server.register(cors, {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

initAuth(server);
initSimulations(server);
initUsers(server);

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})