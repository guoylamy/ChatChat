import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import "./Chat.css";
// https://github.com/machadop1407/react-socketio-chat-app/blob/main/client/src/App.css
const baseUrl = 'http://localhost:8081';
const socket = io.connect(baseUrl);

function Chat() {
    const {userName, friendName} = useParams();
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    let group_id;
    if (userName < friendName) {
        group_id = userName + ";" + friendName;
    } else {
        group_id = friendName + ";" + userName;
    }

    socket.emit("join_room", group_id);

    const receiveMessage = async () => {
        axios.get(baseUrl + `/receivemessage/${group_id}`)
        .then(res => {
            console.log(res.data);
            let resList = [];
            for (let i = 0; i < res.data.length; i++) {
                const date = new Date(res.data[i].timestamp);
                resList.push({
                    author: res.data[i].sender,
                    message: res.data[i].message,
                    message_type: res.data[i].message_type,
                    mimetype: res.data[i].mimetype,
                    displayTime: date.getFullYear() + "-" + date.getMonth() + "-" +  date.getDate() + " " + date.getHours() + ":" + date.getMinutes(),
                })
            }
            setMessageList(resList);
            // setMessageList((list) => [...list, data]);
        }).catch(err => {
            console.log(`error: ${err}`);
        })
    }

    const sendMessage = async () => {
        if (currentMessage === "") {
            return;
        }

        const messageData = {
            group_id: group_id,
            timestamp: Date.now(),
            sender: userName,
            receiver: friendName,
            message: currentMessage,
        };
        await socket.emit("send_message", group_id);
        axios.post(baseUrl + `/sendmessage`, messageData)
        .then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(`error: ${err}`);
        })
        // setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
        await receiveMessage();
    }

    const sendFile = async (fileType, selectedFile) => {
        const formData = new FormData();
        formData.append('fileUpload', selectedFile);
        axios.post(baseUrl + `/sendfile/${group_id}/${Date.now()}/${userName}/${fileType}/${friendName}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(`error: ${err}`);
        })
        await socket.emit("send_message", group_id);
        await receiveMessage();
    }

    useEffect(() => {
        socket.on("receive_message", async (data) => {
            await receiveMessage();
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
                        if (messageContent.message_type === "string") {
                            return (
                                <div
                                    className="message"
                                    id={userName === messageContent.author ? "you" : "other"}
                                >
                                <div>
                                <div className="message-content">
                                    <p>{Buffer.from(messageContent.message).toString('utf8')}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.displayTime}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                                </div>
                            </div>
                            );
                        } else if (messageContent.message_type === "image") {
                            const img = `data:${messageContent.mimetype};base64,` + Buffer.from(messageContent.message).toString('base64');
                            return (
                                <div
                                    className="message"
                                    id={userName === messageContent.author ? "you" : "other"}
                                >
                                <div>
                                <div className="message-content">
                                    <img src={img} />
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.displayTime}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                                </div>
                            </div>
                            );
                        } else if (messageContent.message_type === "audio") {
                            const audio = `data:${messageContent.mimetype};base64,` + Buffer.from(messageContent.message).toString('base64');
                            return (
                                <div
                                    className="message"
                                    id={userName === messageContent.author ? "you" : "other"}
                                >
                                <div>
                                <div className="message-content">
                                    <audio controls src={audio} />
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.displayTime}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                                </div>
                            </div>
                            );
                        } else {
                            const video = `data:${messageContent.mimetype};base64,` + Buffer.from(messageContent.message).toString('base64');
                            return (
                                <div
                                    className="message"
                                    id={userName === messageContent.author ? "you" : "other"}
                                >
                                <div>
                                <div className="message-content">
                                    <video width="400" height="300" controls>
                                        <source src={video} type={messageContent.mimetype} />
                                    </video>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.displayTime}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                                </div>
                            </div>
                            );
                        }
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <div>
                    <label htmlFor="imageUpload">Send Image</label>
                    <input type="file" name="fileUpload" id="imageUpload" accept="image/*" />
                    <button id="imageSendBtn" onClick={async () => {
                        await sendFile("image", document.getElementById("imageUpload").files[0]); 
                        document.getElementById("imageUpload").value = null;
                    }}> Send Image</button>
                </div>
                <div>
                    <label htmlFor="audioUpload">Send Audio</label>
                    <input type="file" name="fileUpload" id="audioUpload" accept="audio/*" />
                    <button id="audioSendBtn" onClick={async () => {
                        await sendFile("audio", document.getElementById("audioUpload").files[0]); 
                        document.getElementById("audioUpload").value = null;
                    }}> Send Audio</button>
                </div>
                <div>
                    <label htmlFor="videoUpload">Send Video</label>
                    <input type="file" name="fileUpload" id="videoUpload" accept="video/*" />
                    <button id="videoSendBtn" onClick={async () => {
                        await sendFile("video", document.getElementById("videoUpload").files[0]); 
                        document.getElementById("videoUpload").value = null;
                    }}> Send Video</button>
                </div>
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
                <button onClick={receiveMessage}>&#11118;</button>
            </div>
            </div>
        </div>
    )
}

export default Chat;