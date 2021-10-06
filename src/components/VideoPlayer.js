import React, { useEffect, createRef, useState, Fragment } from 'react'
import * as helper from './utils'

const websocket = require('websocket-stream')
const Buffer = require('safe-buffer').Buffer
var ws, wsCommand
var mediaStream
var mediaRecorder
const serverUrl = 'localhost:4000' // or 51.15.52.186:4000 for mars.muzamint.com (fix steamKey)
//var myStreamID = '0d19-wi38-udkl-jwam'
var myAddress = '0xf3e06eeC1A90A7aEB10F768B924351A0F0158A1A'

import {
  CurrentProvider,
  ConnectComponent,
  Contract_ro
} from '@nftaftermarket/superxerox2'

const VideoPlayer = ({ onCapture }) => {
  var videoRef = createRef()
  const [container, setContainer] = useState({ width: 640, height: 480 })
  const [onAir, setOnAir] = useState(false)
  const [address, setAddress] = useState('')
  const [streamKey, setStreamKey] = useState('🚀')

  helper.useEffectAsync(async () => {
    console.log('address', address)
    if (address !== '') {
      const sk = await helper.checkAndCreateSteamKey(address)
      console.log('streamKey set to:', sk.streamKey)
      if (sk.streamKey !== '') {
        console.log('🚀🚀🚀🚀🚀🚀🚀', sk.streamKey)
        setStreamKey[sk.streamKey] // useless
        try {
          wsCommand.write(sk.streamKey)
        } catch (e) {
          alert('please start ffmpeg proxy server first.')
        }
      }
    }
  }, [address])

  useEffect(() => {
    wsCommand = websocket('ws://' + serverUrl + '/streamKey', {
      binary: false
    })
    wsCommand.on('data',function (o) {
      console.log('on data', o)
      const str = String.fromCharCode.apply(null, o);
      setStreamKey(str)
    })
    var constraints = {
      video: { facingMode: 'environment' },
      audio: true
    }

    async function run() {
      const x = await CurrentProvider.getNetwork()
      const signer = await CurrentProvider.getSigner()
      const y = await signer.getAddress()
      console.log('💋current network: ', await signer.getAddress())
      setAddress(y)
      getMedia(constraints)
      ws = websocket('ws://' + serverUrl, { binary: true })

      // start streaming
      mediaStream = document.querySelector('video').captureStream(30) // 30 FPS
      mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=h264',
        videoBitsPerSecond: 3 * 640 * 480
      })
      console.log('mediaStream', mediaStream)
      console.log('mediaRecorder', mediaRecorder)
      if ('ropsten' === x.name) {
        Contract_ro.getNetFlow().then((x) => {
          console.log('🧔🏻‍♀️ ', x)
        })
      }
    }

    async function getMedia(options) {
      const streamx = navigator.mediaDevices
        .getUserMedia(options)
        .then(function (mediaStream) {
          var video = document.querySelector('video')
          video.srcObject = mediaStream
          video.onloadedmetadata = function (e) {
            video.play()
          }
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message)
        })
    }
    run()
  }, [])

  const goOff = () => {
    setOnAir(false)
    mediaRecorder.stop()
  }

  const golive = () => {
    if (streamKey === '🚀') {
      alert('no streamKey')
      return
    }
    wsCommand.write(streamKey)
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
    <>
      <ConnectComponent text='📡' />
      <Fragment>
        <div>
          livepeer stream key: {streamKey}
          <p style={onAir ? onAirStyle : offAirStyle}>
            {onAir ? 'ON AIR' : 'OFFLINE'}
          </p>
          <button onClick={onAir ? goOff : golive}>
            {onAir ? 'Stop Streaming' : 'Start Streaming'}
          </button>
          <video ref={videoRef} autoPlay></video>
          <p>{address}</p>
        </div>
      </Fragment>
    </>
  )
}

export default VideoPlayer
