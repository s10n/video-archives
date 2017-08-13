export const setStorage = (props, prevProps) => {
  const prevBoards = JSON.stringify(prevProps.boards)
  const nextBoards = JSON.stringify(props.boards)
  const prevVideos = JSON.stringify(prevProps.videos)
  const nextVideos = JSON.stringify(props.videos)

  if (prevBoards !== nextBoards) localStorage.setItem('boards', nextBoards)
  if (prevVideos !== nextVideos) localStorage.setItem('videos', nextVideos)
}

export const slugify = string =>
  string
    .trim()
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=|%|\./g, '-')
    .replace(/--+/g, '-')

export const storageTest = () => {
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
  let mod = 'modernizr'
  try {
    localStorage.setItem(mod, mod)
    localStorage.removeItem(mod)
    return true
  } catch (e) {
    return false
  }
}

export const isIE = () => {
  const ua = window.navigator.userAgent
  return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0
}

export const getParam = uri => {
  try {
    const url = new URL(uri)
    const searchParams = new URLSearchParams(url.search)
    return searchParams.get('v')
  } catch (error) {
    return null
  }
}
