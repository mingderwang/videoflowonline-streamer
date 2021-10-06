import React, { useEffect, createRef, useState, Fragment } from 'react'
import * as helper from './utils'

const websocket = require('websocket-stream')
const Buffer = require('safe-buffer').Buffer
var ws, wsCommand
var mediaStream
var mediaRecorder
const serverUrl = 'localhost:3000' // or 51.15.52.186:3000 for mars.muzamint.com (fix steamKey)
//var myStreamID = '0d19-wi38-udkl-jwam'
var myAddress = '0xf3e06eeC1A90A7aEB10F768B924351A0F0158A1A'
const address = '0d19-wi38-udkl-jwam'
const data = {
  name: address,
  profiles: [
    {
      name: '720p',
      bitrate: 2000000,
      fps: 30,
      width: 1280,
      height: 720
    },
    {
      name: '480p',
      bitrate: 1000000,
      fps: 30,
      width: 854,
      height: 480
    },
    {
      name: '360p',
      bitrate: 500000,
      fps: 30,
      width: 640,
      height: 360
    }
  ]
}
import {
  CurrentProvider,
  ConnectComponent,
  Contract_ro
} from '@nftaftermarket/superxerox2'

const VideoPlayer = ({ onCapture, streamID }) => {
  var videoRef = createRef()
  const [container, setContainer] = useState({ width: 640, height: 480 })
  const [onAir, setOnAir] = useState(false)
  const [address, setAddress] = useState('🐝')
  const [sreamKey, setStreamKey] = useState('🚀')

  helper.useEffectAsync(async () => {
    makeAPICall()
    const streamKey = helper.checkAndCreateSteamKey(address)
    console.log('skey', streamKey)
    setStreamKey[streamKey]
  }, [address])

  const makeAPICall = async () => {
    try {
      fetch('https://livepeer.com/api/stream', {
        mode: 'cors',
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: new Headers({
          Authorization: 'Bearer c14340ba-13ad-4c7d-a732-47dccc077599',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers':
            'Origin, Methods, Content-Type, Authorization',
          'Access-Control-Allow-Methods': '*'
        })
      })
        .then(res => res.json())
        .catch((error) => console.error('💬📟🏷🌐💯📚Error:', error))
        .then((response) => console.log('💬📟🏷🌐💯📚Success:', response))
    } catch (e) {
      console.log('🌄❤️💖 🔑🎛💧💬📟🏷🌐💯📚💄☀️⚛️ ✨💵🔗🏷🗺xxxx error', e)
    }

    try {
      const response = await fetch('http://localhost:8080/cors', {
        mode: 'cors'
      })
      const data = await response.json()
      console.log('xxxx⚡🌙 🌄❤️💖 🔑🎛💧💬📟🏷🌐💯📚💄☀️⚛️ ✨💵🔗🏷🗺xxxx data', {
        data
      })
    } catch (e) {
      console.log('🌄❤️💖 🔑🎛💧💬📟🏷🌐💯📚💄☀️⚛️ ✨💵🔗🏷🗺xxxx error', e)
    }
  }

  useEffect(() => {
    makeAPICall()
    var capture_options = {
      video: { facingMode: 'environment' },
      audio: true
    }

    async function run() {
      const x = await CurrentProvider.getNetwork()
      const signer = await CurrentProvider.getSigner()
      const address = await signer.getAddress()
      console.log('💋current network: ', await signer.getAddress())
      setAddress(address)
      if ('ropsten' === x.name) {
        Contract_ro.getNetFlow().then((x) => {
          console.log('🧔🏻‍♀️ ', x)
        })
      }
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
    run()
    getMedia(capture_options)
    ws = websocket('ws://' + serverUrl, { binary: true })
    wsCommand = websocket('ws://' + serverUrl + '/streamKey', { binary: false })
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
    <>
      <ConnectComponent text='📡' />
      <Fragment>
        <div>
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
