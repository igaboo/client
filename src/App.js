import "./App.css";

import { useEffect, useRef, useState } from "react";

import io from "socket.io-client";

const socket = io.connect("http://10.0.0.77:3001");

function App() {
  const messageRef = useRef();

  const [message, setMessage] = useState("");

  const [history, setHistory] = useState([]);

  function sendMessage() {
    socket.emit("send_message", { message: messageRef.current.value });
    setHistory([
      { message: messageRef.current.value, type: "sent" },
      ...history,
    ]);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessage(data.message);
    });

    //eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    if (message !== "") setHistory([{ message, type: "received" }, ...history]);
    //eslint-disable-next-line
  }, [message]);

  return (
    <div className="App">
      <header>
        <input ref={messageRef} type="text" placeholder="Message" />
        <button onClick={sendMessage}>Send</button>
      </header>

      <div className="container">
        {history.map((msg, i) => {
          return (
            <h2 key={i} className={msg.type}>
              {msg.message}
            </h2>
          );
        })}
      </div>
    </div>
  );
}

export default App;
