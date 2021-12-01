import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
// https://github.com/machadop1407/react-socketio-chat-app/blob/main/client/src/App.css

const socket = io.connect("http://localhost:8081");

function Chat() {
    const {userName, friendName} = useParams();
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const roomID = 123

    socket.emit("join_room", roomID);


    const sendMessage = async () => {
        if (currentMessage === "") {
            return;
        }
        
        const messageData = {
            sender: userName,
            receiver: friendName,
            message: currentMessage,
            author: userName,
            time: new Date(Date.now()),
            displayTime: 
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
            room: roomID
        };
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div>
            <h1 className="chatchat-h1">chatchat!</h1>
            <div className="chat-window">
            <div className="chat-header">
                <p>Chat with {friendName}</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return (
                            <div
                                className="message"
                                id={userName === messageContent.author ? "you" : "other"}
                            >
                            <div>
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{messageContent.displayTime}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                            </div>
                        </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input 
                  type="text"
                  value={currentMessage}
                  placehoder="Type here..."
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                  }}
                  onKeyPress={(event) => {event.key === "Enter" && sendMessage();}}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
            </div>
        </div>
    )
}

export default Chat;