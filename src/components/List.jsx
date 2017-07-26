import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import { ItemTypes, isIE } from '../config/constants'
import Card from './Card'
import ListEdit from './ListEdit'
import Video from './Video'
import VideoAdd from './VideoAdd'

const propTypes = {
  videos: PropTypes.array.isRequired,
  board: PropTypes.object.isRequired,
  list: PropTypes.object,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
}

const defaultProps = {
  list: {}
}

const listTarget = {
  canDrop(props, monitor) {
    const { list } = props
    const { video } = monitor.getItem()
    return list ? list.key !== video.list : false
  },

  drop(props) {
    return { list: props.list }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

const List = ({ videos, board, list, connectDropTarget, isOver, canDrop }) => {
  const videosFiltered = _.filter(videos, video => !video.deleted)
  const videosSorted = _.sortBy(videosFiltered, 'data.snippet.publishedAt').reverse()
  const header = <ListEdit board={board} list={list} videos={videos} />
  const footer = !_.isEmpty(list) && !list.isSyncing ? <VideoAdd board={board} list={list} /> : null

  return connectDropTarget(
    <div style={{ height: '100%' }}>
      <Card header={header} footer={footer} variant={{ padding: 0 }} canDrop={isOver && canDrop}>
        {!_.isEmpty(videosSorted) &&
          <div style={{ maxHeight: isIE() && window.innerHeight - 480 }}>
            {videosSorted.map(video =>
              <Video video={video} board={board} list={list} key={video.key} />
            )}
          </div>}
      </Card>
    </div>
  )
}

List.propTypes = propTypes
List.defaultProps = defaultProps

export default DropTarget(ItemTypes.VIDEO, listTarget, collect)(List)
