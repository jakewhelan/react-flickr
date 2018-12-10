import path from 'path'
import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import pino from 'pino'
import cors from 'cors'
import open from 'opn'

import { rootService } from './services/root.service'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

const logger = pino({ level: 'info' })
const app = fastify({ logger })
const compiler = webpack(webpackConfig)

app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    open: true
  })
)
app.use(webpackHotMiddleware(compiler))
app.use(cors())

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'client/dist')
})

app.register(rootService, { prefix: '/api' })

app.listen(3000)
  .then(() => {
    open(`http://localhost:${app.server.address().port}`)
  })
  .catch(err => {
    if (err) throw err
  })
