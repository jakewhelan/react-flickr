import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import debounce from 'lodash.debounce'
import { Masonry } from './masonry/masonry.component'
import {
  calculateBreakpoint,
  getBreakpointWidthForBreakpoint,
  setColumnWidth
} from './masonry/masonry.helpers'

import './reset.scss'
import './app.component.scss'

if (module.hot) {
  module.hot.accept()
}

class App extends Component {
  state = {
    data: [],
    resolved: true,
    searchTerm: '',
    width: 0,
    fetching: false
  }
  page = 0
  pageLimit = 1
  searchInput = null
  columnWidth = 260
  get isDataDisplayed () {
    return Boolean(this.state.data.length)
  }

  constructor () {
    super()
    this.inputOnChange = debounce(this.inputOnChange.bind(this), 400)
    this.onResize = this.onResize.bind(this)
    this.NavigationBarElement = this.NavigationBarElement.bind(this)
    this.MasonryElement = this.MasonryElement.bind(this)
    this.InputPromptElement = this.InputPromptElement.bind(this)
    this.LoadingElement = this.LoadingElement.bind(this)
    this.GetMoreElement = this.GetMoreElement.bind(this)
    setColumnWidth(this.columnWidth)
  }

  componentDidMount () {
    window.addEventListener('resize', this.onResize)
    this.setContainerSizeForBreakpoint()
  }

  componentDidUpdate () {
    if (this.state.resolved && this.state.data.length > 0) {
      this.observe()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize)
  }

  observe () {
    const { IntersectionObserver } = window
    const observer = new IntersectionObserver(([entry], observer) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        if (this.canGetMorePhotos()) {
          this.getPhotos()
        }
      }
    })

    const element = document.getElementById('intersector')
    observer.observe(element)
  }

  canGetMorePhotos () {
    return Boolean(this.page < this.pageLimit)
  }

  async getPhotos () {
    if (this.state.searchTerm === '') return
    if (this.state.fetching) return

    this.setState({ fetching: true })
    this.page++

    const { fetch } = window
    const { photos, pageLimit } = await fetch(`http://localhost:3000/api/photos/${this.state.searchTerm}/${this.page}`)
      .then(response => response.json())
      .catch(err => {
        if (err) console.error(err)
      })

    if (!photos) {
      this.setState({ data: [], resolved: true, fetching: false })
    }

    const data = [
      ...this.state.data,
      ...photos
    ]

    this.pageLimit = pageLimit
    this.setState({ data, resolved: true, fetching: false })
  }

  getPromptMessage () {
    if (this.state.resolved && this.state.searchTerm !== '' && !this.state.data.length) {
      return `Darn, there are no results for that term. Try another!`
    }
    if (this.state.resolved) return 'Enter a search term to find related images :)'
    return ''
  }

  setContainerSizeForBreakpoint () {
    const breakpoint = calculateBreakpoint()
    const width = getBreakpointWidthForBreakpoint(breakpoint)

    console.log(breakpoint, width)
    this.setState({ width })
  }

  async inputOnChange () {
    const { value } = this.searchInput

    const trimmedValue = value.trim()

    if (trimmedValue === this.searchTerm) return
    if (trimmedValue === '') {
      this.page = 0
      this.setState({ data: [], resolved: true, searchTerm: '' })
      return
    }

    this.page = 0
    this.setState({ resolved: false, data: [], searchTerm: trimmedValue })

    // get new set of photos, starting back at page 1
    await this.getPhotos()
  }

  onResize () {
    this.setContainerSizeForBreakpoint()
  }

  NavigationBarElement (props) {
    return (
      <div
        className='nav'
        style={{
          width: props.width
        }}
      >
        <div className='circle' />
        <input
          onChange={this.inputOnChange}
          type='text'
          ref={input => { this.searchInput = input }}
          className='search-input'
          autoFocus
        />
        <div className='square' />
        <div className='square' />
        <div className='square' />
      </div>
    )
  }

  LoadingElement ({ small = false, message = '' }) {
    const parentClass = `${small ? 'small-' : ''}loader`
    return (
      <div className={parentClass}>
        <h1 className='loader-title'>{message}</h1>
        <div className='loader-icon'>
          <i className='dot-pink' />
          <i className='dot-blue' />
        </div>
      </div>
    )
  }

  MasonryElement () {
    const message = `One moment, looking for ${this.state.searchTerm}...`
    return this.state.resolved
      ? (this.state.data.length
        ? <Masonry
          columnData={this.state.data}
          columnWidth={this.columnWidth}
        />
        : null
      )
      : <this.LoadingElement
        message={message}
      />
  }

  InputPromptElement () {
    return this.isDataDisplayed
      ? null
      : (
        <div className='prompt'>
          {this.getPromptMessage()}
        </div>
      )
  }

  GetMoreElement () {
    const message = `Looking for more ${this.state.searchTerm}...`
    const isGettingMore = Boolean(this.state.fetching &&
      this.page > 0 && this.canGetMorePhotos())

    return isGettingMore
      ? <this.LoadingElement
        small
        message={message}
      />
      : null
  }

  render () {
    const getCorrectedWidth = width => width < 521
      ? '80%'
      : width
    const noMorePhotos = Boolean(this.page === this.pageLimit &&
      !this.state.fetching)
    return (
      <flickr-app>
        <this.NavigationBarElement
          width={getCorrectedWidth(this.state.width)}
        />
        <div
          className='rectangle'
          style={{
            width: getCorrectedWidth(this.state.width * 0.62)
          }}
        />
        <this.MasonryElement />
        <this.InputPromptElement />
        <this.GetMoreElement />
        {
          noMorePhotos
            ? <div className='no-more'>I couldn't find any more {this.state.searchTerm}, sorry! :(</div>
            : null
        }
        <div id='intersector' />
      </flickr-app>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
