import './App.css';
import {FaceMesh} from '@mediapipe/face_mesh';
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import {useRef, useEffect, useState, createRef} from "react";
import Camera from './components/Camera';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;
  const connect = window.drawConnectors;
  var clientWidth, clientHeight, clientRatio;

  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }

  function onResults(results){
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.save();
    canvasCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
    //console.log(results.image.width);
    canvasCtx.drawImage(results.image,0,0, canvasElement.width,canvasElement.height);

    if(results.multiFaceLandmarks){
      for(const landmarks of results.multiFaceLandmarks){
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION,
          {color: '#C0C0C070', lineWidth: 1});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {color: 'blue'});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {color: '#30FF30'});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, {color: '#30FF30'});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
          connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {color: '#E0E0E0'});
      }
    }
    //console.log(webcamRef.current.video.clientWidth);
    clientWidth = webcamRef.current.video.clientWidth;
    clientHeight = webcamRef.current.video.clientHeight;
    clientRatio = clientWidth / clientHeight;
  }

  console.log(clientWidth);

  useEffect(() => {

    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    faceMesh.setOptions({
      maxNumFaces:1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: true
    });

    faceMesh.onResults(onResults);

    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null){
      camera = new cam.Camera(webcamRef.current.video,{
        onFrame: async()=>{
          await faceMesh.send({image: webcamRef.current.video})
        }
      })
      camera.start();
    }

  }, []);

  const size = useWindowSize();
  clientWidth = 640;
  clientHeight = 480;

  clientRatio = clientWidth / clientHeight;
  console.log(size);
  // const cameraRatio = results.image.width/results.image.height;
  //   let drawnWidth, drawnHeight;
  //   if (canvasElement.width > results.image.width) {
  //     drawnWidth = canvasElement.width;
  //     drawnHeight = canvasElement.width / cameraRatio;
  //     console.log("state 1");
  //   }else{
  //     drawnHeight = canvasElement.height;
  //     drawnWidth = canvasElement.height * cameraRatio;
  //     console.log("state 2");
  //   }

  const isLandscape = size.height <= size.width;

  // var v = document.getElementById("myVideo");
  //   v.addEventListener( "loadedmetadata", function (e) {
  //       var width = this.videoWidth,
  //           height = this.videoHeight;

  //           console.log(width);
  //           console.log(height);
  //   }, false );
  // const ratio = isLandscape ? (size.width / size.height) : (size.height / size.width);
  // console.log(ratio);
  // if(isLandscape){
  //   size.width = 640;
  // }else{
  //   size.height = 480;
  // }
  //console.log(isLandscape);
  
  // var h = clientHeight;
  // var w = clientHeight * clientRatio;
  var w = size.width;
  var h = w / clientRatio;



  return (
    <div>
      <Webcam id='myVideo' className='video-container' ref={webcamRef} mirrored={true}></Webcam>
      <canvas width={w} height={h} style={{height:"100%", width:"100%", display:"block", margin:0,padding:0}} ref={canvasRef}></canvas>
      {/* <Camera ref={webcamRef}/> */}
    </div>
  );
}

export default App;
