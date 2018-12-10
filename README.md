# react-flickr
![cats](https://user-images.githubusercontent.com/6076073/49750127-0561d800-fca2-11e8-94ff-b03bf7221d0f.gif)

# What is this, and how does it work?

`react-flickr` is a React SPA that allows you to query the Flickr API using a search term to find related images. Once a result is found, `react-flickr` will display the images in a mosaic arrangement, where each image also has some accompanying meta information. When you reach the bottom of the page, provided there are more results available `react-flickr` will fetch more related images and display them.

Images are displayed left-to-right in order of importance, horizontally as they would be in any non-mosaic application. When the page resizes the mosaic composition is recalculated to consider the available space, and images are re-assigned to maintain the order-of-importance horizontal sorting.

The `react-flickr` UX considers users with slow or limited connections (data limits), I encourage you to enable network throttling ('Fast 3G' is sufficient) in the Chrome developer tools and see how the page gracefully loads. With the rapid growth of mobile internet this is an important step to take, but the need for this is emphasised by media-heavy applications such as `react-flickr`. All images are lazy loaded - only when they are visible, on demand - using `IntersectionObserver`. Images are pre-loaded before being displayed to prevent the user from experiencing the unattractive browser painting effect as an image is gradually downloaded.

`react-flickr` has polyfills included for most ES2015 features (via `@babel/polyfill`), `window.IntersectionObserver` and `window.fetch()`

# How to run

It is recommended that you use `npm@6.4.0+` and `node@11.3.0` to run `react-flickr`, your results may vary with older versions of npm & node.

## Flickr API key
Albeit bad practice, for ease-of-use in demoing the app I have included my Flickr API key in the repository. If for some reason this doesn't work or you would like to use your own, add your key to `./api.key.js`.

```js
export const key = 'your key'
```

## Install and run
```
$ npm i && npm start
```

A browser window will be automatically opened in your default browser at `http://localhost:3000`.

# Technology

`react-flickr` was built using ES2018, React 16, Node 11, Fastify, Webpack 4, Babel 7 & :heart:

## Why?

### React

All of the popular UI frameworks are now converging around the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) spec which means they are actually very similar. I chose to use a Web Components inspired technology because of the ability it gives to encapsulate UI functionality and build beautiful, composable and re-usable user interfaces. I am a big fan of composable code. The component life-cycle is an invaluable tool for creating consistently-behaving and easily understandable component code, and libraries such as `ng-animate` and `ReactCSSTransitionGroup` empower you to animate them quickly and performantly. The eco-system and ideology around Web Component technologies are excellent for accelerating productivity and reducing duplicated effort.

Why I chose to use React in particular: I am fan of the idea of JavaScript all the way through your tech stack, and React embodies this idea with JSX. There is no learning curve or question marks around how to interact with the template, it's just JavaScript!

### Webpack 4

Webpack 4 boasts the 'no config' config, and while this isn't totally true for complex projects it is a huge improvement. I chose to use Webpack because it provides ES Module resolution/bundling at a time where ES Modules are still a mess in browsers. Besides that, it provides compilation tools and allows us to do cool things with our components such as importing SCSS and templates into the component `.js` file itself and have them be bundled appropriately while removing all of the complexity of bundling, compiling and aggregating those things out of the hands of the developer. Some of these things wouldn't even be possible without Webpack.

### Node 11 and Fastify

Node 11 comes with ES2018 out of the box and it's a dream to work with, as for fastify - the API is clean, it supports async/await and [the bechmarks speak for themselves](https://github.com/fastify/fastify#benchmarks).

### :heart:

I love JavaScript!

# What would I do with more time?

Admittedly because of the scope of the project, I compromised on some of the design to keep the component architecture simple and avoid complex inter-component communication. I work heavily with Redux in my professional life and I know just how time consuming it can be to implement, the benefits of simple and consolidated state are excellent but my time-budget for this project meant that Redux was out-of-scope.

With more time I'd like to implement Redux, and stop using local state altogether. I would abstract some of the component/template logic that currently lives in functions and move them into their own more granular components. Last but not least, I would like to write some unit tests using `tape`.

Missing from the project is a production webpack config, I would remove hot-module-reloading and enable Webpack `--mode=production` to avail of its production optimisations.

![sample](https://i.imgur.com/OQFmdyq.gif)