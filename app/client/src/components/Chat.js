import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import "./Chat.css";
// https://github.com/machadop1407/react-socketio-chat-app/blob/main/client/src/App.css

const socket = io.connect("http://localhost:8081");

function Chat() {
    const {userName, friendName} = useParams();
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [currentFile, setCurrentFile] = useState([]);
    let group_id;
    if (userName < friendName) {
        group_id = userName + ";" + friendName;
    } else {
        group_id = friendName + ";" + userName;
    }
    const baseUrl = 'http://localhost:8081';

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
        // await socket.emit("send_message", messageData);
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
        console.log("sendFile");
        if (selectedFile === undefined) {
            return;
        }
        console.log("has selectedFile");
        const formData = new FormData();
        formData.append('fileUpload', selectedFile);
        axios.post(baseUrl + `/sendfile/${group_id}/${Date.now()}/${userName}/${fileType}/${friendName}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(`error: ${err}`);
        })
        await receiveMessage();
    }

    // useEffect(() => {
    //     socket.on("receive_message", (data) => {
    //         setMessageList((list) => [...list, data]);
    //     });
    // }, [socket]);
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
                <label htmlFor="imageUpload">Send Image</label>
                <input type="file" value={currentFile} name="fileUpload" id="imageUpload" onChange={(event) => {
                        sendFile("image", event.target.files[0]);
                }} />
                <label htmlFor="audioUpload">Send Audio</label>
                <input type="file" value={currentFile} name="fileUpload" id="audioUpload" onChange={(event) => {
                        sendFile("audio", event.target.files[0]);
                }} />
                <label htmlFor="videoUpload">Send Video</label>
                <input type="file" value={currentFile} name="fileUpload" id="videoUpload" onChange={(event) => {
                        sendFile("video", event.target.files[0]);
                }} />
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