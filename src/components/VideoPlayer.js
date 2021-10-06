import React, { useEffect, createRef, useState } from 'react'
const websocket = require('websocket-stream')
const Buffer = require('safe-buffer').Buffer
var ws, wsCommand
var mediaStream
var mediaRecorder
const serverUrl = 'localhost:3000' // or 51.15.52.186:3000 for mars.muzamint.com (fix steamKey)
//var myStreamID = '0d19-wi38-udkl-jwam'
var myAddress = '0xf3e06eeC1A90A7aEB10F768B924351A0F0158A1A'

const VideoPlayer = ({ onCapture, streamID }) => {
  var videoRef = createRef()
  const [container, setContainer] = useState({ width: 640, height: 480 })
  const [onAir, setOnAir] = useState(false)
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
    ws = websocket('ws://'+ serverUrl, { binary: true })
    wsCommand = websocket('ws://'+ serverUrl +'/streamKey', { binary: false })
    // start streaming
    mediaStream = document.querySelector('video').captureStream(30) // 30 FPS
    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=h264',
      videoBitsPerSecond: 3 * 640 * 480
    })
    console.log('mediaStream', mediaStream)
    console.log('mediaRecorder', mediaRecorder)
    wsCommand.write(streamID)
  }, [])

  const goOff = () => {
    setOnAir(false)
    mediaRecorder.stop()
  }

  const golive = () => {
    function toBuffer(ab) {
      var buf = Buffer.alloc(ab.byteLength)
      var view = new Uint8Array(ab)
      for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i]
      }
      return buf
    }

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
    setOnAir(true)
  }

  const onAirStyle = {
    color: 'red',
    fontSize: 24
  }

  const offAirStyle = {
    color: 'blue',
    fontSize: 16
  }

  return (
    <div>
      <p style={onAir ? onAirStyle : offAirStyle}>
        {onAir ? 'ON AIR' : 'OFFLINE'}
      </p>
      <button onClick={onAir ? goOff : golive}>
        {onAir ? 'Stop Streaming' : 'Start Streaming'}
      </button>
      <video ref={videoRef} autoPlay></video>
    </div>
  )
}

export default VideoPlayer
