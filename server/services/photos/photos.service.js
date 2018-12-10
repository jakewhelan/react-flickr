import fetch from 'node-fetch'
import querystring from 'querystring'
import path from 'path'

const { key } = require(path.join(process.cwd(), 'api.key'))

export const photosService = (fastify, opts, next) => {
  const searchFeature = async (request, reply) => {
    const {
      searchTerm = '',
      page = 1
    } = request.params

    const options = querystring.stringify({
      method: 'flickr.photos.search',
      api_key: key,
      sort: 'relevance',
      text: searchTerm,
      extras: [
        'date_taken',
        'owner_name',
        'tags',
        'url_m'
      ].join(),
      page,
      per_page: 20,
      format: 'json',
      nojsoncallback: 1
    })

    const url = `https://api.flickr.com/services/rest/?${options}`
    request.log.info(`Requesting search data from Flickr: ${url}`)

    const { photo: photos, pages: pageLimit } = await fetch(url)
      .then(response => response.json())
      .then(({ photos }) => photos)
      .catch(err => {
        if (err) console.error(err)
      })

    // eslint-disable-next-line camelcase
    const profiles = await Promise.all(photos.map(({ owner: user_id }) => {
      const options = querystring.stringify({
        method: 'flickr.people.getInfo',
        api_key: key,
        user_id,
        format: 'json',
        nojsoncallback: 1
      })

      const url = `https://api.flickr.com/services/rest/?${options}`
      request.log.info(`Requesting profile data from Flickr: ${url}`)

      return fetch(url)
        .then(response => response.json())
        .catch(err => {
          if (err) console.error(err)
        })
    }))

    // for some reason the result of Promise.all isn't iterable ¯\_(ツ)_/¯
    const people = [...profiles]
      .map(({
        person: {
          nsid,
          iconserver,
          iconfarm
        }
      }) => ({
        nsid,
        iconserver,
        iconfarm
      }))

    reply.type('application/json').code(200)

    /* eslint-disable camelcase */
    return {
      pageLimit,
      photos: photos.map(({
        id,
        owner,
        title,
        tags,
        datetaken,
        url_m,
        height_m
      }, index) => ({
        title,
        tags,
        date: datetaken,
        src: url_m,
        height: height_m,
        url: `https://www.flickr.com/photos/${owner}/${id}/`,
        profile: `https://www.flickr.com/photos/${owner}/`,
        profilePicture: people[index].iconfarm !== 0
          ? `http://farm${people[index].iconfarm}.staticflickr.com/${people[index].iconserver}/buddyicons/${people[index].nsid}.jpg`
          : null
      }))
    }
    /* eslint-enable camelcase */
  }

  fastify.get('/:searchTerm', searchFeature)
  fastify.get('/:searchTerm/:page', searchFeature)

  next()
}
