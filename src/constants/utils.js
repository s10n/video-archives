export const slugify = string => {
  return string
    .trim()
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=|%|\./g, '-')
    .replace(/--+/g, '-')
}

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

export const getParams = uri => {
  let hashes = uri.slice(uri.indexOf('?') + 1).split('&')
  let params = {}
  hashes.map(hash => {
    let [key, value] = hash.split('=')
    params[key] = decodeURIComponent(value)
    return null
  })
  return params
}
