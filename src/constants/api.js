import firebase from 'firebase'
import firebaseConfig from '../config/firebase'

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth
export const db = firebase.database()

const snippet = 'title,thumbnails,publishedAt,channelId,channelTitle,categoryId'

export const youtube = {
  url: 'https://www.googleapis.com/youtube/v3/videos',
  idLength: 11,
  params: {
    key: firebaseConfig.apiKey,
    part: 'snippet,contentDetails',
    fields: `items(id,snippet(${snippet}),contentDetails(duration))`
  }
}
