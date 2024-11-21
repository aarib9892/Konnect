import React, { useEffect , useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3000';



const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lobby, setLobby] = useState(false)
  const name = searchParams.get("name");

  useEffect(() => {
   const socket = io(URL);

    socket.on('connect',()=>{
      alert('connected')
    })

    socket.on('send-offer',({roomId}) => {
      alert('please send offer')
      socket.emit('offer',{
        roomId
      })
    })

    socket.on('offer',({roomId,offer})=>{
      alert('please send answerr')
      socket.emit('answer',{
        roomId,offer
      })
    })

    socket.on('answer',({roomId,offer})=>{
      alert('Connection Established')

    })

    socket.on('lobby',() => {
      setLobby(true)
    })
  }, [name]);


  if(lobby){
    return <div>Waiting for you to connect with someone ....</div>
  }

  return (
    <>
      <div> Hi {name}</div>
    </>
  );
};

export default Room;
