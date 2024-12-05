
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhone,
} from "react-icons/fa";

const MeetControls = ({isVideoOn , handleVideoControl , isAudioOn , handleAudioControl}) => {

  


  const leaveCall = () => {
    console.log("Leaving call...");
    // Add your leave call logic here
  };

  return (
    <div className="fixed bottom-4 w-full flex justify-center">
      <div className="bg-gray-800 rounded-lg flex space-x-4 p-3 shadow-lg">
        {/* Audio Control */}
        <button
          onClick={handleAudioControl}
          className={`p-3 rounded-full ${
            isAudioOn ? "bg-gray-700" : "bg-red-500"
          } text-white`}
          title={isAudioOn ? "Mute Audio" : "Unmute Audio"}
        >
          {isAudioOn ? (
            <FaMicrophone size={20} />
          ) : (
            <FaMicrophoneSlash size={20} />
          )}
        </button>

        {/* Video Control */}
        <button
          onClick={handleVideoControl}
          className={`p-3 rounded-full ${
            isVideoOn ? "bg-gray-700" : "bg-red-500"
          } text-white`}
          title={isVideoOn ? "Turn Off Video" : "Turn On Video"}
        >
          {isVideoOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
        </button>

        {/* Leave Call */}
        <button
          onClick={leaveCall}
          className="p-3 rounded-full bg-red-600 text-white"
          title="Leave Call"
        >
          <FaPhone size={20} />
        </button>
      </div>
    </div>
  );
};

export default MeetControls;
