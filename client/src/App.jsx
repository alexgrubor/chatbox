import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      {!showChat ? (
        <div className="p-8 bg-white rounded-md shadow-lg">
          <h3 className="text-lg font-bold mb-2">Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            className="w-full px-3 py-2 rounded-md border border-gray-300 mb-2"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            className="w-full px-3 py-2 rounded-md border border-gray-300 mb-2"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button
            className="w-full px-3 py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-700"
            onClick={joinRoom}
          >
            Join A Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
