import React from 'react'
import { connect } from 'react-redux'
import { editVideo, deleteVideo } from '../actions/index'
import './VideoItem.css'

const CATEGORY_LIST = [
  { id: '1', title: { en_US: 'Film & Animation', ko_KR: '영화/애니메이션' } },
  { id: '2', title: { en_US: 'Cars & Vehicles', ko_KR: '자동차' } },
  { id: '10', title: { en_US: 'Music', ko_KR: '음악' } },
  { id: '15', title: { en_US: 'Pets & Animals', ko_KR: '동물' } },
  { id: '17', title: { en_US: 'Sports', ko_KR: '스포츠' } },
  { id: '19', title: { en_US: 'Travel & Events', ko_KR: '여행/이벤트' } },
  { id: '20', title: { en_US: 'Gaming', ko_KR: '게임' } },
  { id: '22', title: { en_US: 'People & Blogs', ko_KR: '인물/블로그' } },
  { id: '23', title: { en_US: 'Comedy', ko_KR: '코미디' } },
  { id: '24', title: { en_US: 'Entertainment', ko_KR: '엔터테인먼트' } },
  { id: '25', title: { en_US: 'News & Politics', ko_KR: '뉴스/정치' } },
  { id: '26', title: { en_US: 'How-to & Style', ko_KR: '노하우/스타일' } },
  { id: '27', title: { en_US: 'Education', ko_KR: '교육' } },
  { id: '28', title: { en_US: 'Science & Technology', ko_KR: '과학기술' } },
  { id: '29', title: { en_US: 'Non-profits & Activism', ko_KR: '비영리/사회운동' } }
]

const propTypes = {
  video: React.PropTypes.object.isRequired,
  editVideo: React.PropTypes.func.isRequired,
  deleteVideo: React.PropTypes.func.isRequired
}

const defaultProps = {
  video: {},
  editVideo: () => console.log('editVideo not defined'),
  deleteVideo: () => console.log('deleteVideo not defined')
}

class VideoItem extends React.Component {
  constructor(props) {
    super(props)
    this.onMoveClick = this.onMoveClick.bind(this)
    this.onTrashClick = this.onTrashClick.bind(this)
    this.onRecoverClick = this.onRecoverClick.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onMoveClick() {
    const list = prompt(`Type a slug of list`)

    if (list) {
      this.props.editVideo(this.props.video, { list: list })
    }
  }

  onTrashClick() {
    this.props.editVideo(this.props.video, { deleted: true })
  }

  onRecoverClick() {
    const board = this.props.video.board || prompt(`Type a slug of board`)
    this.props.editVideo(this.props.video, { board, deleted: false })
  }

  onDeleteClick() {
    this.props.deleteVideo(this.props.video)
  }

  render() {
    const video = this.props.video
    const url = `https://www.youtube.com/watch?v=${video.data.id}`
    const publishedAt = new Date(video.data.snippet.publishedAt)
    const categoryTitle = CATEGORY_LIST.find(category => {
      return category.id === video.data.snippet.categoryId
    }).title.en_US

    return (
      <article className="VideoItem">
        {/* TODO: Change thumbnail ratio to 16:9 */}
        <img src={video.data.snippet.thumbnails.high.url} role="presentation" height="120" />

        <h3 className="VideoTitle">
          <a href={url} target="_blank">{video.data.snippet.title}</a>
        </h3>

        <section className="VideoMeta">
          <date>{publishedAt.toLocaleString('en-US')}</date>
          <span hidden>{categoryTitle}</span>
          {/* TODO: if not video-add */}
          {
            !video.deleted ?
              <section>
                <button className="btn-link" onClick={this.onMoveClick}>
                  Move
                </button>
                &middot;
                <button className="btn-link" onClick={this.onTrashClick}>
                  🗑
                </button>
              </section>
            :
              <section>
                <button className="btn-link" onClick={this.onRecoverClick}>
                  Recover {video.board && ` to ${video.board}`}{video.list && ` - ${video.list}`}
                </button>
                &middot;
                <button className="btn-link" onClick={this.onDeleteClick}>
                  Delete
                </button>
              </section>
          }
        </section>
      </article>
    )
  }
}

VideoItem.propTypes = propTypes
VideoItem.defaultProps = defaultProps

export default connect(null, { editVideo, deleteVideo })(VideoItem)
