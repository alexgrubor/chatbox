import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window w-full h-full flex flex-col">
      <div className="chat-header w-full py-4 text-lg font-semibold text-white bg-gray-800 flex justify-center items-center">
        Live Chat
      </div>
      <div className="chat-body flex-grow w-full overflow-y-auto">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className={
                  username === messageContent.author
                    ? "message flex flex-row-reverse"
                    : "message flex flex-row"
                }
                key={messageContent.time}
              >
                <div
                  className={
                    username === messageContent.author
                      ? "bg-gray-200 rounded-lg ml-3 my-1 p-3 w-1/3 text-right"
                      : "bg-blue-600 rounded-lg mr-3 my-1 p-3 w-1/3 text-left"
                  }
                >
                  <p className="text-sm text-gray-700">{messageContent.message}</p>
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-xs text-gray-500">{messageContent.author}</p>
                    <p className="text-xs text-gray-500">{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer w-full py-4 flex justify-center items-center">
        <input
          type="text"
          className="border rounded-lg py-2 px-4 w-4/5 mr-4"
          placeholder="Hey..."
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button
          className="bg-blue-600 text-white rounded-lg px-4 py-2"
          onClick={sendMessage}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}

export default Chat;