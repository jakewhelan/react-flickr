let columnWidth = 0

export const getColumnWidth = () => columnWidth
export const setColumnWidth = width => {
  columnWidth = width
}

/**
 * Viewport breakpoint names
 * @readonly
 * @enum {String}
 */
export const Breakpoints = {
  GIANT: 'GIANT',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
  TINY: 'TINY'
}

/**
 * Number of masonry columns for breakpoint
 * @readonly
 * @enum {Number}
 */
export const ColumnsForBreakpoint = {
  GIANT: 5,
  LARGE: 4,
  MEDIUM: 3,
  SMALL: 2,
  TINY: 1
}

/**
 * Returns column width, with consideration for consumer input
 * of columnWidth
 * @readonly
 * @enum {Breakpoints}
 */
export const BreakpointWidths = {
  get GIANT () { return getBreakpointWidthForBreakpoint(Breakpoints.GIANT) },
  get LARGE () { return getBreakpointWidthForBreakpoint(Breakpoints.LARGE) },
  get MEDIUM () { return getBreakpointWidthForBreakpoint(Breakpoints.MEDIUM) },
  get SMALL () { return getBreakpointWidthForBreakpoint(Breakpoints.SMALL) },
  get TINY () { return getBreakpointWidthForBreakpoint(Breakpoints.TINY) }
}

/**
 * Multipies column count for breakpoint by provided columnWidth
 * and adds provided spacing
 * @method getBreakpointWidthForBreakpoint
 * @param {String} breakpoint a valid value of Breakpoints enum
 * @returns {Number}
 */
export const getBreakpointWidthForBreakpoint = breakpoint => {
  const columns = ColumnsForBreakpoint[breakpoint]
  return columnWidth * columns
}

/**
 * Determines the breakpoint for current viewport width
 * @method calculateBreakpoint
 */
export const calculateBreakpoint = () => {
  const viewportWidth = window.innerWidth
  if (viewportWidth >= BreakpointWidths.GIANT) return Breakpoints.GIANT
  if (viewportWidth >= BreakpointWidths.LARGE) return Breakpoints.LARGE
  if (viewportWidth >= BreakpointWidths.MEDIUM) return Breakpoints.MEDIUM
  if (viewportWidth >= BreakpointWidths.SMALL) return Breakpoints.SMALL
  return Breakpoints.TINY
}

/**
 * Spreads flat array into columns in sequence so that data
 * is rendered horizontally in order of importance
 * @param {Object[]} columnData flat array of data to order, in sequential order
 * @param {String} breakpoint a valid value of Breakpoints enum
 */
export const assignColumnDataForBreakpoint = (columnData, breakpoint) => {
  const { [breakpoint]: columnCount } = ColumnsForBreakpoint

  const assignedColumnData = Array.from(Array(columnCount)).map(() => [])
  let currentColumn = 0

  columnData.reduce((acc, cur, index) => {
    acc[currentColumn].push(cur)
    currentColumn++

    if (currentColumn > (assignedColumnData.length - 1)) currentColumn = 0

    return acc
  }, assignedColumnData)

  return assignedColumnData
}
