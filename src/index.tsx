import * as React from 'react'
import VideoPlayer from './components/VideoPlayer'
import { useState } from 'react'
const myStreamID = '0d19-wi38-udkl-jwam'
export const VideoPlayerComponent = () => {
  const [cardImage, setCardImage] = useState()
  return (
    <div className='player-wrapper'>
      <VideoPlayer
        onCapture={(blob: any) => {
          setCardImage(blob)
        }}
        streamID = {myStreamID}
      />
      {cardImage && (
        <div>
          <h2>Preview</h2>
          <img src={cardImage && URL.createObjectURL(cardImage)} />
        </div>
      )}
    </div>
  )
}
