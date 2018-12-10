const colors = ['#01bf8f', '#01bfbd', '#01a8bf', '#0176bf', '#0146bf', '#013cbf', '#6901bf', '#9401bf', '#bf01a0', '#bf0152']

export const getBackgroundColour = index => {
  const inBoundsIndex = index > 9
    ? index % 10
    : index

  return colors[inBoundsIndex]
}
