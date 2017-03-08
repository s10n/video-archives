import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import './BoardRead.css'
import VideoList from '../components/VideoList'
import ListAdd from '../components/ListAdd'

const propTypes = {
  videoStorage: React.PropTypes.object.isRequired
}

const defaultProps = {
  videoStorage: {}
}

class BoardRead extends React.Component {
  render() {
    const currentVideoStorage = this.props.videoStorage
    const currentBoardSlug = this.props.params.slug
    const currentBoard = _.find(currentVideoStorage.boards, board => {
      return board.slug === currentBoardSlug
    })

    return (
      <section className="BoardRead">
        <h1 className="BoardTitle">{currentBoard.name}</h1>

        <div className="BoardCanvas">
          <div className="BoardScroll">
            {currentBoard.lists.map(list => {
              return (
                <div className="VideoWrapper" key={list.slug}>
                  <VideoList list={list} videoList={currentVideoStorage.videos} />
                </div>
              )
            })}

            <div className="VideoWrapper">
              <article className="VideoList card">
                <ListAdd boardSlug={currentBoardSlug} />
              </article>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

BoardRead.propTypes = propTypes
BoardRead.defaultProps = defaultProps

export default connect(mapStateToProps)(BoardRead)
