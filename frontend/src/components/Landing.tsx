import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [name, setName] = useState("");
  const localVideoRef = useRef(null);
  const [localAudioTrack, setLocalAudioTrack] = useState();
  const [localVideoTrack, setLocalVideoTrack] = useState();
  const [remoteAudioTrack, setRemoteAudioTrack] = useState();
  const [remoteVideoTrack, setremoteVideoTrack] = useState();

  const getPermission = async () => {
    let stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    let videoTrack = stream.getVideoTracks()[0];
    let audioTrack = stream.getAudioTracks()[0];
    setLocalAudioTrack(audioTrack)
    setLocalVideoTrack(videoTrack)
    localVideoRef.current.srcObject = new MediaStream([videoTrack]);
    localVideoRef.current.play=true

    
  };

  useEffect(() => {
    if (localVideoRef?.current) {
      getPermission();
    }
  }, [localVideoRef]);
  return (
    <div>
      <video autoPlay ref={localVideoRef}></video>
      <input onChange={(e) => setName(e.target.value)} type="text" />
      <Link to={`/room/?name=${name}`}>Join</Link>
    </div>
  );
};

export default Landing;
