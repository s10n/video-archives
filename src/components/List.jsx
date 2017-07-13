import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { isIE } from '../config/constants'
import Card from './Card'
import ListEdit from './ListEdit'
import Video from './Video'
import VideoAdd from './VideoAdd'

const propTypes = {
  videos: PropTypes.array.isRequired,
  board: PropTypes.object.isRequired,
  list: PropTypes.object
}

const List = ({ videos, board, list }) => {
  const videosSorted = _.sortBy(videos, 'data.snippet.publishedAt').reverse()

  const header = (
    <div className="ListHeader">
      <ListEdit board={board} list={list} videos={videos} />
    </div>
  )

  const footer = (!_.isEmpty(list) && !list.isSyncing) ? (
    <VideoAdd board={board} list={list} />
  ) : null

  return (
    <Card header={header} footer={footer}>
      {!_.isEmpty(videosSorted) && (
        <div style={{ maxHeight: isIE() && window.innerHeight - 480 }}>
          {videosSorted.map(video =>
            !video.deleted && <Video video={video} board={board} list={list} key={video.key} />
          )}
        </div>
      )}
    </Card>
  )
}

List.propTypes = propTypes

export default List
