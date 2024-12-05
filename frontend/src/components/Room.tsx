import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
// "undefined" means the URL will be computed from the `window.location` object
const URL = "https://konnect-ql90.onrender.com";

const Room = ({ localStream }) => {
  const [searchParams ] = useSearchParams();
  const [lobby, setLobby] = useState(false);
  const name = searchParams.get("name");
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

  const createConnection = (socket, roomId, type) => {
    console.log(type , lobby);
    const peerConnection = new RTCPeerConnection();
    localStream.getTracks().forEach((track: MediaStreamTrack) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = async (event) => {
      console.log(event.streams);
      let testtrack = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        testtrack.addTrack(track);
      });
      usr2Ref.current.srcObject = testtrack;
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
    let stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    // let videoTrack = stream.getVideoTracks()[0];
    // let audioTrack = stream.getAudioTracks()[0];
    console.log(usr1Ref.current, usr2Ref.current);

    usr1Ref.current.srcObject = new MediaStream(stream);
    usr1Ref.current.play = true;
    setRemoteStream(new MediaStream());
    if (usr2Ref) {
      usr2Ref.current.srcObject = remoteStream;
      usr2Ref.current.play = true;
    }
  };

  useEffect(() => {
    const socket = io(URL);

    if (usr1Ref?.current && usr2Ref?.current) {
      console.log(usr1Ref.current, usr2Ref.current);
      getPermission();
    }

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

    socket.on("offer", async ({ roomId, offer }) => {
      // alert("please send answerr");
      const peerConnection = createConnection(socket, roomId, "receiver");
      console.log(roomId, offer, "ONOFFER");
      peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      setLobby(false);
      setReceivingPc(peerConnection);
      console.log(receivingPc , localPc)

      socket.emit("answer", {
        roomId,
        answer,
      });
    });

    socket.on("answer", ({ answer }) => {
      // alert("Connection Established");
      setLobby(false);
      setLocalPc((pc) => {
        pc?.setRemoteDescription(answer);

        return pc;
      });
      // console.log(localPc,"LOCALPC",receivingPc)
      // if (!localPc.currentRemoteDescription) {
      //   localPc.setRemoteDescription(answer);
      // }
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
  }, [name]);

  // if (lobby) {
  //   return <div className="text-white">Waiting for you to connect with someone ....</div>;
  // }

  return (
    <>
      <div className="flex justify-center items-center gap-12 w-full text-white min-h-[100vh]">
        <video
          width={500}
          className="rounded-xl"
          ref={usr1Ref}
          autoPlay
          id="user-1"
        ></video>
        <video
          width={500}
          className="rounded-xl"
          ref={usr2Ref}
          autoPlay
          id="user-2"
        ></video>
      </div>
    </>
  );
};

export default Room;
