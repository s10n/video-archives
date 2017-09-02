import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DropTarget } from 'react-dnd'
import { editList, deleteList } from '../actions/list'
import { addVideo } from '../actions/video'
import { ItemTypes } from '../constants/app'
import { isIE } from '../constants/utils'
import Card from './Card'
import ListEdit from './ListEdit'
import Video from './Video'
import VideoAdd from './VideoAdd'

const propTypes = {
  app: PropTypes.object.isRequired,
  videos: PropTypes.array.isRequired,
  boards: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  list: PropTypes.object,
  editList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  addVideo: PropTypes.func.isRequired,
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

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
})

const List = ({ app, videos, boards, board, list, editList, deleteList, addVideo, ...rest }) => {
  const { connectDropTarget, isOver, canDrop } = rest
  const videosFiltered = _.filter(videos, video => !video.deleted)
  const videosSorted = _.sortBy(videosFiltered, 'data.snippet.publishedAt').reverse()

  const propsListEdit = {
    board,
    list,
    videos,
    appStatus: app.status,
    onEdit: editList,
    onDelete: deleteList
  }

  const propsVideoAdd = { board, list, boards, onAdd: addVideo }

  const header = <ListEdit {...propsListEdit} />
  const footer = !_.isEmpty(list) && !list.isSyncing ? <VideoAdd {...propsVideoAdd} /> : null

  return connectDropTarget(
    <div style={{ height: '100%' }}>
      <Card header={header} footer={footer} variant={{ padding: 0 }} canDrop={isOver && canDrop}>
        {!_.isEmpty(videosSorted) && (
          <div style={{ maxHeight: isIE() && window.innerHeight - 480 }}>
            {videosSorted.map(video => (
              <Video video={video} board={board} list={list} key={video.key} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

List.propTypes = propTypes
List.defaultProps = defaultProps

const mapStateToProps = ({ app, boards }) => ({ app, boards })

const mapDispatchToProps = dispatch =>
  bindActionCreators({ editList, deleteList, addVideo }, dispatch)

const enhance = _.flow(
  DropTarget(ItemTypes.VIDEO, listTarget, collect),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(List)
