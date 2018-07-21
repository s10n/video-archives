import _ from 'lodash'
import React from 'react'
import { array } from 'prop-types'
import { connect } from 'react-redux'
import Page from './Page'
import Card from './Card'
import Video from './Video'

const propTypes = { videos: array.isRequired }

const All = ({ videos }) => (
  <Page page="All" title="All">
    <Card>{videos.map(video => <Video video={video} flex key={video.key} />)}</Card>
  </Page>
)

All.propTypes = propTypes

const mapStateToProps = ({ videos = [] }) => ({
  videos: _.filter(videos, o => !o.deleted).reverse()
})

export default connect(mapStateToProps)(All)
