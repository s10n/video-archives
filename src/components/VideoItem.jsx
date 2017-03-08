import React from 'react'
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
  video: React.PropTypes.object.isRequired
}

const defaultProps = {
  video: {}
}

class VideoItem extends React.Component {
  render() {
    const videoSnippet = this.props.video.data.snippet
    const videoUrl = `https://www.youtube.com/watch?v=${this.props.video.data.id}`
    const publishedAt = new Date(videoSnippet.publishedAt)
    const categoryTitle = CATEGORY_LIST.find(category => {
      return category.id === videoSnippet.categoryId
    }).title

    return (
      <article className="VideoItem">
        {/* TODO: Change thumbnail ratio to 16:9 */}
        <img src={videoSnippet.thumbnails.high.url} role="presentation" height="120" />

        <h3 className="VideoTitle">
          <a href={videoUrl} target="_blank">{videoSnippet.title}</a>
        </h3>

        <section className="VideoMeta">
          <date>{publishedAt.toLocaleString('en-US')} </date>
          <span hidden>{categoryTitle.en_US}</span>
        </section>
      </article>
    )
  }
}

VideoItem.propTypes = propTypes
VideoItem.defaultProps = defaultProps

export default VideoItem
