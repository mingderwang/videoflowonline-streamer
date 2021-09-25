import * as React from 'react'
import ReactPlayer from 'react-player'

export const VideoPlayerComponent = () => {
  return(
  <div className='player-wrapper'>
    <ReactPlayer
      url='https://vimeo.com/243556536'
      className='react-player'
      playing
      width='100%'
      height='100%'
    />
  </div>
  )
}
