import React, { forwardRef, useEffect, useRef } from 'react'

const Camera = forwardRef((props, ref) => {
    //const videoRef = useRef(null);

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({video: {width:1920, height:1080}})
        .then(stream => {
            let video = ref.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getVideo();
    },[ref]);

    return (
        <div className='camera'>
            <video ref={ref}></video>
        </div>
    )
})

export default Camera
