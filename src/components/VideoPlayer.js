import React, { useEffect, createRef, useState } from 'react'
const websocket = require('websocket-stream')
const Buffer = require('safe-buffer').Buffer
var ws

const VideoPlayer = ({ onCapture }) => {
  var videoRef = createRef()
  var canvasRef = createRef()
  const [container, setContainer] = useState({ width: 640, height: 480 })
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true)
  useEffect(() => {
    var capture_options = {
      video: { facingMode: 'environment' },
      audio: true
    }

    async function getMedia(options) {
      let streamx = null
      try {
        streamx = await navigator.mediaDevices.getUserMedia(options)
        if (streamx && videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = streamx
        }
      } catch (err) {
        /* handle the error */
        console.log(err)
      }
    }
    getMedia(capture_options)
    ws = websocket('ws://localhost:3000', { binary: true })
  }, [])
  const offsets = { x: 0, y: 0 }

  const golive = () => {
    console.log('recorder cant not be stopped, data available')
  }
  const capture = () => {
    function toBuffer(ab) {
      var buf = Buffer.alloc(ab.byteLength)
      var view = new Uint8Array(ab)
      for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i]
      }
      return buf
    }
    const context = canvasRef.current.getContext('2d')

    context.drawImage(
      videoRef.current,
      offsets.x,
      offsets.y,
      container.width,
      container.height,
      0,
      0,
      container.width,
      container.height
    )

    canvasRef.current.toBlob((blob) => onCapture(blob), 'image/jpeg', 1)
    setIsCanvasEmpty(false)

    // recording
    let mediaStream = document.querySelector('video').captureStream(30) // 30 FPS
    let mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=h264',
      videoBitsPerSecond: 3 * 640 * 480
    })
    console.log('mediaStream', mediaStream)
    console.log('mediaRecorder', mediaRecorder)
    ws.on('data', function (o) {
      console.log('on data', o)
      ws.write(Buffer.from('hello'))
    })
    // ws.write(Buffer.from('hello'))

    mediaRecorder.ondataavailable = function (e) {
      console.log('-> e.data', e.data)
      let blob = e.data
      blob.arrayBuffer().then((buffer) => {
        ws.write(toBuffer(buffer))
      })
    }
    mediaRecorder.start(1000)
  }

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      <canvas
        ref={canvasRef}
        width={container.width}
        height={container.height}
      />
      <button onClick={capture}>
        {isCanvasEmpty ? 'Take a picture' : 'Take another picture'}
      </button>
      <button onClick={golive}>stop streaming</button>
    </div>
  )
}

export default VideoPlayer
