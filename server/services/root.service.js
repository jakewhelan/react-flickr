import { photosService } from './photos/photos.service'

export const rootService = (fastify, opts, next) => {
  fastify.register(photosService, { prefix: '/photos' })
  next()
}
