import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
  import Room from "./Room";
const Landing = () => {
  const [name, setName] = useState("");
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState();

  const [remoteAudioTrack, setRemoteAudioTrack] = useState();
  const [remoteVideoTrack, setremoteVideoTrack] = useState();
  const [enterRoom, setEnterRoom] = useState(false);

  const getPermission = async () => {
    let stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    
    // let videoTrack = stream.getVideoTracks()[0];
    // let audioTrack = stream.getAudioTracks()[0];
    setLocalStream(stream)
    localVideoRef.current.srcObject = new MediaStream(stream);
    localVideoRef.current.play=true

    
  };

  useEffect(() => {
    if (localVideoRef?.current) {
      getPermission();
    }
  }, [localVideoRef]);


  if(enterRoom){
    return <Room  localStream={localStream}/>
  }
  return (
    <div>
      <video autoPlay ref={localVideoRef}></video>
      <input onChange={(e) => setName(e.target.value)} type="text" />
      <button onClick={() => setEnterRoom(true)}>Join</button>
    </div>
  );
};

export default Landing;
