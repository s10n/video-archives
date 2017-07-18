import firebase from 'firebase'
import { firebaseConfig, youtubeAPIKey } from './config'

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth
export const db = firebase.database()

const snippetFields = 'title,thumbnails,publishedAt,channelId,channelTitle,categoryId'
const contentDetailsFields = 'duration'

export const youtubeAPI = {
  url: 'https://www.googleapis.com/youtube/v3/videos',
  idLength: 11,
  params: {
    key: youtubeAPIKey,
    part: 'snippet,contentDetails',
    fields: `items(id,snippet(${snippetFields}),contentDetails(${contentDetailsFields}))`
  }
}

export const errorMessages = {
  board: {
    valid: 'Press enter key to create ↵',
    reserved: 'Reserved board title',
    exists: 'Board already exists'
  },
  list: {
    exists: 'List exists'
  },
  video: {
    invalid: 'Type valid url',
    exists: 'Video exists',
    fetching: 'Fetching...',
    noResults: 'No results',
    success: 'Press enter key to add this video ↵'
  }
}

export const reservedBoardSlug = ['trash', 'signup', 'signin', 'signout']

export const ItemTypes = { VIDEO: 'video', LIST: 'list' }

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
