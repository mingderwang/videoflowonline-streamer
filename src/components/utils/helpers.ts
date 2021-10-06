import { useEffect } from 'react';
//const axios = require('axios').default;

export const version = 'v0.0.1'
export const checkAndCreateSteamKey = async (address: string): Promise<any> => {
    console.log('xxxx address input', address)
    const data = {
        "name": address,
        "profiles": [
            {
                "name": "720p",
                "bitrate": 2000000,
                "fps": 30,
                "width": 1280,
                "height": 720
            },
            {
                "name": "480p",
                "bitrate": 1000000,
                "fps": 30,
                "width": 854,
                "height": 480
            },
            {
                "name": "360p",
                "bitrate": 500000,
                "fps": 30,
                "width": 640,
                "height": 360
            }
        ]
    }
    const makeAPICall = async (): Promise<any> => { 
        try {
        return await fetch('https://livepeer.com/api/stream', {
            mode: 'cors',
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
              'Authorization': 'Bearer c14340ba-13ad-4c7d-a732-47dccc077599',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Headers':
                'Origin, Methods, Content-Type, Authorization',
              'Access-Control-Allow-Methods': '*'
            })
          })
        } catch (e) {
          console.log('🌄❤️💖 🔑🎛💧💬📟🏷🌐💯📚💄☀️⚛️ ✨💵🔗🏷🗺xxxx error', e)
        }
      }
      return makeAPICall()
    }


export function useEffectAsync(effect: any, inputs: any) {
    useEffect(() => {
        effect();
    }, inputs);
}
