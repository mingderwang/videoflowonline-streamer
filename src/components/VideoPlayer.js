import React, { useEffect, createRef, useState, Fragment } from 'react'
import * as helper from './utils'
import SuperfluidSDK from '@superfluid-finance/js-sdk'
import Web3Modal from 'web3modal'
const { Web3Provider } = require('@ethersproject/providers')
var bob
const providerOptions = {
  /* See Provider Options Section */
}

const websocket = require('websocket-stream')
const Buffer = require('safe-buffer').Buffer
var ws, wsCommand
var mediaStream
var mediaRecorder
const serverUrl = 'localhost:4000' // or 51.15.52.186:4000 for mars.muzamint.com (fix steamKey)
//var myStreamID = '0d19-wi38-udkl-jwam'
var myAddress = '0xf3e06eeC1A90A7aEB10F768B924351A0F0158A1A'

const VideoPlayer = ({ onCapture }) => {
  var videoRef = createRef()
  const [container, setContainer] = useState({ width: 640, height: 480 })
  const [onAir, setOnAir] = useState(false)
  const [address, setAddress] = useState('')
  const [streamKey, setStreamKey] = useState('🚀')
  const [inflow, setInflow] = useState('🚀')
  const [netflow, setNetflow] = useState('🚀')
  const [network, setNetwork] = useState('')

  const startSuperFlow = async (provider) => {
    const sf = new SuperfluidSDK.Framework({
      ethers: provider,
      version: 'v1', //"test"
      tokens: ['fDAI']
    })
    await sf.initialize()
    return sf
  }

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
    wsCommand.on('data', function (o) {
      console.log('on data', o)
      const str = String.fromCharCode.apply(null, o)
      console.log('skey', str)
      setStreamKey(str)
    })
    var constraints = {
      video: { facingMode: 'environment' },
      audio: true
    }

    async function run() {
      const web3Modal = new Web3Modal({
        //network: 'ropsten', // optional
        cacheProvider: true, // optional
        providerOptions // required
      })
      const provider = new Web3Provider(window.ethereum)

      if (typeof provider !== 'undefined') {
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        console.log('address:', address)
        setAddress(address)
        let network = await provider.getNetwork()
        setNetwork(network)
        console.log('provider:', provider)
        getMedia(constraints)

        let sf = await startSuperFlow(provider)
        console.log('sf', sf.tokens.fDAIx)
        
        bob = sf.user({ address: myAddress, token: sf.tokens.fDAIx.address })
        const details = await bob.details()
        const inflow = details.cfa.flows.inFlows
        if (inflow.length > 0) {
          setInflow(inflow[0].sender)
          console.log(
            '⚡🌙 🌄❤️💖 🔑🎛💧💬📟🏷🌐💯📚💄☀️⚛️ ✨💵🔗🏷🗺',
            details
          )
        }

        ws = websocket('ws://' + serverUrl, { binary: true })

        // start streaming
        mediaStream = document.querySelector('video').captureStream(30) // 30 FPS
        mediaRecorder = new MediaRecorder(mediaStream, {
          mimeType: 'video/webm;codecs=h264',
          videoBitsPerSecond: 3 * 640 * 480
        })
        console.log('mediaStream', mediaStream)
        console.log('mediaRecorder', mediaRecorder)
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
      <Fragment>
        <div>
          livepeer stream key: {streamKey}
          <p style={onAir ? onAirStyle : offAirStyle}>
            {onAir ? 'ON AIR' : 'OFFLINE'}
          </p>
          <button onClick={onAir ? goOff : golive}>
            {onAir ? 'Stop Streaming' : 'Start Streaming'}
          </button>
          <video
            ref={videoRef}
            autoPlay
            width='320'
            height='240'
            controls
          ></video>
          <p>{address}</p>
          <p>$$$ flow in from: {inflow}</p>
          <p>netflow total: {netflow}</p>
        </div>
      </Fragment>
    </>
  )
}

export default VideoPlayer
