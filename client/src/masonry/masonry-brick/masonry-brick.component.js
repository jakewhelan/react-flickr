import React, { Component } from 'react'
import { getBackgroundColour } from './masonry-brick.helpers'
import { MasonryBrickImage } from './masonry-brick-image/masonry-brick-image.component'
import './masonry-brick.component.scss'

export class MasonryBrick extends Component {
  backgroundColor = null
  state = {
    resolved: false
  }

  constructor (props) {
    super(props)
    this.backgroundColor = getBackgroundColour(props.photoIndex)
  }

  render () {
    const { backgroundColor } = this
    const { title, tags, height, date, src, url, profile, profilePicture } = this.props.data
    const tagList = tags.split(' ')
    return (
      <flickr-masonry-brick style={this.props.style}>
        <div
          className='thumbnail'
          style={{
            height: `${height}px`
          }}>
          <MasonryBrickImage
            src={src}
            link={url}
            backgroundColor={backgroundColor}
          />
        </div>
        <div className='title'>
          <span>{title}</span>
        </div>
        <div className='tags'>
          {tagList
            .filter(tag => tag !== '')
            .map((tag, i) => (
              <div
                key={`tag-${i}`}
                className='tag'
                style={{
                  background: getBackgroundColour(Math.round(Math.random() * (9 - 0) + 0)),
                  color: '#fff'
                }}
              >{tag}</div>
            ))
          }
        </div>
        <div className='user'>
          <MasonryBrickImage
            className='portrait'
            src={profilePicture}
            link={profile}
            backgroundColor={'#bfb001'}
            fit
          />
          <div className='date'>{date}</div>
        </div>
        {this.props.children}
      </flickr-masonry-brick>
    )
  }
}
