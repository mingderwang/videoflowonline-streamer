import { useEffect } from 'react';
//const axios = require('axios').default;

export const version = 'v0.0.1'
export const checkAndCreateSteamKey = async (address: string): Promise<any> => {
    console.log('xxxx address input', address)
    /*
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
    
    const instance = axios.create({
        baseURL: 'https://livepeer.com/api/stream',
        timeout: 10000,
        headers: {'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Headers': 'Origin, Methods, Content-Type, Authorization','Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Origin': 'http://localhost:3001', 'Content-Type': 'application/json', 'authorization': 'Bearer c14340ba-13ad-4c7d-a732-47dccc077599' }
    });

    console.log(instance)

    instance.post('/', data)
        .then(function (response: any) {
            console.log(response);
        })
        .catch(function (error: any) {
            console.log(error);
        });
        */
        
}


export function useEffectAsync(effect: any, inputs: any) {
    useEffect(() => {
        effect();
    }, inputs);
}
