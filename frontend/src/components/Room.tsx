import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import MeetControls from "./Controls";
// "undefined" means the URL will be computed from the `window.location` object
// const URL = "https://konnect-ql90.onrender.com";\
const URL = "http://localhost:3000";

const Room = ({ name }) => {
  const [searchParams] = useSearchParams();
  const [lobby, setLobby] = useState(false);
  const [recieversUsername, setRecieversUsername] = useState("");
  const [isVideoOn, setIsVideoOn] = React.useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = React.useState<boolean>(true);

  const [localPc, setLocalPc] = React.useState<RTCPeerConnection | undefined>(
    undefined
  );
  const [receivingPc, setReceivingPc] = React.useState<
    RTCPeerConnection | undefined
  >(undefined);
  const usr1Ref = useRef(null);
  const usr2Ref = useRef(null);
  const [remoteStream, setRemoteStream] = React.useState<
    MediaStream | undefined
  >(undefined);
  const [localStream, setLocalStream] = React.useState<MediaStream | undefined>(
    new MediaStream()
  );

  const createConnection = (socket, roomId, type) => {
    console.log(type, lobby);
    const peerConnection = new RTCPeerConnection();
    localStream.getTracks().forEach((track: MediaStreamTrack) => {
      peerConnection.addTrack(track, localStream)
    });

    peerConnection.ontrack = async (event) => {
      console.log(event.streams,'opopopopo');
      let testtrack = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        testtrack.addTrack(track)
      });
      usr2Ref.current.srcObject = testtrack
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log(event.candidate, "CANDIDATES");
        socket.emit("sendIceCandidate", {
          can: event.candidate,
          roomId,
        });
      }
    };
    // if(type === 'sender'){
    //    setLocalPc(peerConnection)
    // }else{
    //   setReceivingPc(peerConnection)
    // }
    return peerConnection;
  };

  const getPermission = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    setLocalStream((ls) => {
      stream.getTracks().forEach((track) => {
        ls.addTrack(track);
      });
      return ls;
    });
    console.log(usr1Ref.current, "loop");
    if (usr1Ref) {
      usr1Ref.current.srcObject = localStream;
      usr1Ref.current.play = true;
    }

    setRemoteStream(new MediaStream());
    if (usr2Ref) {
      usr2Ref.current.srcObject = remoteStream;
      usr2Ref.current.play = true;
    }
  };

  const handleVideoControl = () => {
    console.log(isVideoOn, "brgh");
    setIsVideoOn((prev) => {
      const videoTrack = localStream
        .getTracks()
        .find((track) => track.kind === "video");
      const updated = !prev;
      if (!updated) {
        videoTrack.enabled = false;
      } else {
        videoTrack.enabled = true;
      }
      return !prev;
    });
  };
  const handleAudioControl = () => {
    console.log(isAudioOn, "brgh");
    setIsAudioOn((prev) => {
      const audioTrack = localStream
        .getTracks()
        .find((track) => track.kind === "audio");
      const updated = !prev;
      if (!updated) {
        audioTrack.enabled = false;
      } else {
        audioTrack.enabled = true;
      }
      return !prev;
    });
  };
  useEffect(() => {
    if (usr1Ref?.current && usr2Ref?.current) {
      getPermission();
    }
  }, []);

  useEffect(() => {
    const socket = io(URL, {
      query: {
        userName: name,
      },
    });

    socket.on("connect", () => {
      // alert("connected");
      //  getPermission();
    });

    socket.on("send-offer", async ({ roomId }) => {
      const peerConnection = createConnection(socket, roomId, "sender");

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log("offer created");
      setLocalPc(peerConnection);
      console.log("I was SET", peerConnection);

      socket.emit("offer", {
        roomId,
        offer,
      });
    });

    socket.on("offer", async ({ roomId, offer, username }) => {
      // alert("please send answerr");
      setRecieversUsername(username);
      const peerConnection = createConnection(socket, roomId, "receiver");
      console.log(roomId, offer, "ONOFFER");
      peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      setReceivingPc(peerConnection);
      
      setLobby(false);

      socket.emit("answer", {
        roomId,
        answer,
      });
    });

    socket.on("answer", ({ answer, username }) => {
      // alert("Connection Established");
      setRecieversUsername(username);
      setLobby(false);
      setLocalPc((pc) => {
        pc?.setRemoteDescription(answer);

        return pc;
      });

    });

    socket.on("onIceCandidate", ({ can, type }) => {
      if (type === "sender") {
        setReceivingPc((pc) => {
          pc?.addIceCandidate(can);
          return pc;
        });
      } else {
        setLocalPc((pc) => {
          pc?.addIceCandidate(can);
          return pc;
        });
      }
    });

    socket.on("lobby", () => {
      setLobby(true);
    });
  }, []);

  // if (lobby) {
  //   return <div className="text-white">Waiting for you to connect with someone ....</div>;
  // }

  return (
    <>
      <div className="flex justify-center flex-col items-center gap-12 w-full text-white min-h-[100vh]">
        {lobby && <h1 className="tet-2xl">Waiting for others to join...</h1>}
        <div className="flex justify-center items-center gap-12 w-full">
          {" "}
          <div className="w-[40%]">
            <video
              className="rounded-xl w-full"
              ref={usr1Ref}
              autoPlay
              id="user-1"
            ></video>
            <h2>{name}</h2>
          </div>
          <div className={`${lobby ? "hidden" : "block"}  w-[40%] `}>
            <video
              className={`rounded-xl w-full`}
              ref={usr2Ref}
              autoPlay
              id="user-2"
            ></video>
            <h2>{recieversUsername}</h2>
          </div>
        </div>

        <MeetControls
          isVideoOn={isVideoOn}
          handleVideoControl={handleVideoControl}
          isAudioOn={isAudioOn}
          handleAudioControl={handleAudioControl}
        />
      </div>
    </>
  );
};

export default Room;
