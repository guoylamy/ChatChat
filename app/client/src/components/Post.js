import React, {useState} from "react"
import {useParams} from "react-router-dom"
import axios from "axios";
import "./Post.css";
// https://github.com/machadop1407/react-socketio-chat-app/blob/main/client/src/App.css
const baseUrl = 'http://localhost:8081';

function Post() {
    const {creator_id, group_id} = useParams(); // creator_id = 5b746bd-cdee-301d-fe5-cfe4064af26f, group_id = 0863ccd-d673-71d1-ddb4-4f1b1f2ad8a
    const [currentMessage, setCurrentMessage] = useState("");
    // const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage === "") {
            return;
        }

        const messageData = {
            group_id: group_id,
            timestamp: Date.now(),
            sender: creator_id,
            message: currentMessage,
        };
        axios.post(baseUrl + `/postmessage`, messageData)
        .then(res => {
            document.getElementById("post-result").innerHTML = 'post message successfully!';
        }).catch(err => {
            document.getElementById("post-result").innerHTML = `error: ${err}`;
        })
        // setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
    }

    const sendFile = async (fileType, selectedFile) => {
        if (selectedFile === undefined) {
            return;
        }
        console.log("has selectedFile");
        const formData = new FormData();
        formData.append('fileUpload', selectedFile);
        axios.post(baseUrl + `/postfile/${group_id}/${Date.now()}/${creator_id}/${fileType}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            document.getElementById("post-result").innerHTML = 'post file successfully!';
        }).catch(err => {
            document.getElementById("post-result").innerHTML = `error: ${err}`;
        })
    }

    return (
        <div>
            <h1 className="chatchat-h1">chatchat!</h1>
            <div className="post-window">
              <div className="post-header">
                <p>Post to group {group_id}</p>
              </div>
              <div className="post-body">
                <div className="post-message">
                    <textarea 
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
                <div className="post-attachment">
                    <label htmlFor="imageUpload">Send Image</label>
                    <input type="file" name="fileUpload" id="imageUpload" onChange={(event) => {
                            sendFile("image", event.target.files[0]);
                    }} />
                </div>
                <div className="post-attachment">
                    <label htmlFor="audioUpload">Send Audio</label>
                    <input type="file" name="fileUpload" id="audioUpload" onChange={(event) => {
                            console.log(event.target.files[0]);
                            sendFile("audio", event.target.files[0]);
                    }} />
                </div>
                <div className="post-attachment">
                    <label htmlFor="videoUpload">Send Video</label>
                    <input type="file" name="fileUpload" id="videoUpload" onChange={(event) => {
                            console.log(event.target.files[0]);
                            sendFile("video", event.target.files[0]);
                    }} />
                </div>
              </div>
              <p id="post-result">{" "}</p>
            </div>
        </div>
    )
}

export default Post;