import React ,  { useState, useEffect, useRef } from "react";

import Room from "./Room";
const Landing = () => {
  const [name, setName] = useState("");
  console.log(name)
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = React.useState<MediaStream | undefined>(
    undefined
  );

 
  const [enterRoom, setEnterRoom] = useState(false);

  const getPermission = async () => {
    let stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    // let videoTrack = stream.getVideoTracks()[0];
    // let audioTrack = stream.getAudioTracks()[0];
    setLocalStream(stream);
    localVideoRef.current.srcObject = new MediaStream(stream);
    localVideoRef.current.play = true;
  };

  useEffect(() => {
    if (localVideoRef?.current) {
      getPermission();
    }
  }, [localVideoRef]);

  if (enterRoom) {
    return <Room localStream={localStream} />;
  }
  return (
    <div className="flex justify-center gap-12 items-center min-h-[100vh] min-w-[100vw]">
      <div className="flex  justify-center items-center w-[40%] m-12 ">
        <video
          className="rounded-xl"
          width={600}
          autoPlay
          ref={localVideoRef}
        ></video>
      </div>
      <div className="flex flex-col gap-6">
        <p className="text-white text-xl mb-4">Enter your name :</p>
        <input
          className="rounded-xl p-4 border-[#00b687] border-2 bg-gray-800 text-xl text-white"
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      <button className='bg-[#00b687] rounded-xl p-6 text-white uppercase text-2xl' onClick={() => setEnterRoom(true)}>Join</button>
      </div>
    </div>
  );
};

export default Landing;
