import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './masonry-brick-image.component.scss'

export class MasonryBrickImage extends Component {
  static defaultProps = {
    src: '',
    backgroundColor: '',
    fit: false,
    className: ''
  }
  static propTypes = {
    src: PropTypes.string,
    backgroundColor: PropTypes.string,
    fit: PropTypes.bool,
    className: PropTypes.string
  }

  state = {
    resolved: false
  }

  componentDidMount () {
    this.observe()
  }

  observe () {
    const { IntersectionObserver } = window
    const observer = new IntersectionObserver(([entry], observer) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        this.preloadImage()
      }
    })

    const element = this.refs.self
    observer.observe(element)
  }

  preloadImage () {
    const { Image } = window
    const image = new Image()
    image.onload = this.imageOnLoad.bind(this)
    image.src = this.props.src
  }

  imageOnLoad () {
    this.setState({ resolved: true })
  }

  render () {
    const { backgroundColor, fit } = this.props
    const imageStyle = fit
      ? { height: '100%', width: '100%' }
      : {}
    const unresolvedClass = this.state.resolved
      ? ''
      : 'unresolved'
    return (
      <flickr-masonry-brick-image
        ref='self'
        class={`${unresolvedClass} ${this.props.className}`}
        style={{ backgroundColor }}
      >
        {
          this.state.resolved
            ? (
              <a
                href={this.props.link}
                target='_blank'
                style={imageStyle}
              >
                <img
                  src={this.props.src}
                  style={imageStyle}
                />
              </a>
            )
            : null
        }

      </flickr-masonry-brick-image>
    )
  }
}
