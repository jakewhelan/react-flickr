import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {
  getColumnWidth,
  setColumnWidth,
  ColumnsForBreakpoint,
  calculateBreakpoint,
  assignColumnDataForBreakpoint
} from './masonry.helpers'
import { MasonryBrick } from './masonry-brick/masonry-brick.component'

import './masonry.component.scss'

export class Masonry extends Component {
  static defaultProps = {
    columnData: [],
    columnWidth: 260
  }
  static propTypes = {
    columnData: PropTypes.array,
    columnWidth: PropTypes.number
  }

  breakpoint = null
  columnData = []
  state = {
    assignedColumnData: []
  }

  constructor (props) {
    super(props)

    const { columnWidth } = props

    setColumnWidth(columnWidth)

    this.onResize = this.onResize.bind(this)
    this.MasonryBrickElementList = this.MasonryBrickElementList.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.onResize)
    this.setBreakpoint()
  }

  componentWillReceiveProps ({ columnData }) {
    this.columnData = columnData.map((data, photoIndex) => ({ ...data, photoIndex }))
    this.assignColumnData()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize)
  }

  /**
   * Gets current breakpoint, updates state if the breakpoint is
   * different since the last check
   * @method setBreakpoint
   */
  setBreakpoint () {
    const breakpoint = calculateBreakpoint()
    if (this.breakpoint !== breakpoint) {
      this.breakpoint = breakpoint
      this.assignColumnData()
    }
  }

  /**
   * Spreads columnData evenly among visible columns for current
   * breakpoint, updates state
   * @method assignColumnData
   */
  assignColumnData () {
    const assignedColumnData = assignColumnDataForBreakpoint(this.columnData, this.breakpoint)
    this.setState({ assignedColumnData })
  }

  /**
   * onResize event handler, determines current breakpoint
   * when window resizes
   * @method onResize
   */
  onResize () {
    const { requestAnimationFrame } = window
    requestAnimationFrame(this.setBreakpoint.bind(this))
  }

  MasonryBrickElementList () {
    return this.state.assignedColumnData.map((_, index) => (
      <div
        className='masonry-column'
        style={{ width: `${getColumnWidth()}px` }}
        key={index}
      >
        <ReactCSSTransitionGroup
          transitionName='slide-up'
          transitionAppear
          transitionLeave={false}
          transitionAppearTimeout={0}
          transitionEnterTimeout={0}
        >
          {
            this.state.assignedColumnData[index]
              .map((data, i) => (
                <MasonryBrick
                  key={`masonry-brick ${index} ${i}`}
                  data={data}
                  photoIndex={data.photoIndex}
                  style={{ transitionDelay: `${(Math.round(Math.random() * (5 - 2) + 2) / 10)}s` }}
                />
              ))
          }
        </ReactCSSTransitionGroup>
      </div>
    ))
  }

  render () {
    const { [this.breakpoint]: columnCount } = ColumnsForBreakpoint
    const width = `${columnCount * getColumnWidth()}px`
    const columnStyle = {
      width,
      maxWidth: width,
      minWidth: width
    }

    return (
      <flickr-masonry style={columnStyle}>
        <this.MasonryBrickElementList />
      </flickr-masonry>
    )
  }
}
