import React, {useState} from "react"
import {useParams} from "react-router-dom"
import axios from "axios";
import "./NewPost.css";
// https://github.com/machadop1407/react-socketio-chat-app/blob/main/client/src/App.css
const baseUrl = 'http://localhost:8081';

function NewPost() {
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
        .then(async (res) => {
            console.log(res);
            let success = true;
            let tmpSuccess;
            const postId = res.data; // todo
            const imageList =  document.getElementById("imageUpload").files;
            console.log("imageList");
            console.log(imageList);
            for (let i = 0; i < imageList.length; i++) {
                tmpSuccess = await sendFile("image", imageList[i], postId);
                console.log(tmpSuccess);
                if (!tmpSuccess) {
                    success = false;
                }
            }
            const audioList =  document.getElementById("audioUpload").files;
            console.log("audioList");
            console.log(audioList);
            for (let i = 0; i < audioList.length; i++) {
                tmpSuccess = await sendFile("audio", audioList[i], postId);
                console.log(tmpSuccess);
                if (!tmpSuccess) {
                    success = false;
                }
            }
            const videoList =  document.getElementById("videoUpload").files;
            console.log("videoList");
            console.log(videoList);
            for (let i = 0; i < audioList.length; i++) {
                tmpSuccess = await sendFile("video", videoList[i], postId);
                console.log(tmpSuccess);
                if (!tmpSuccess) {
                    success = false;
                }
            }
            if (success) {
                document.getElementById("post-result").innerHTML = 'post message successfully!';
            } else {
                document.getElementById("post-result").innerHTML = 'post message attachment failed!';
            }
            setCurrentMessage("");
            document.getElementById("imageUpload").value = null;
            document.getElementById("audioUpload").value = null;
            document.getElementById("videoUpload").value = null;
        }).catch(err => {
            document.getElementById("post-result").innerHTML = `error: ${err}`;
            setCurrentMessage("");
            document.getElementById("imageUpload").value = null;
            document.getElementById("audioUpload").value = null;
            document.getElementById("videoUpload").value = null;
        })
        // setMessageList((list) => [...list, messageData]);
    }

    const sendFile = async (fileType, selectedFile, postId) => {
        console.log("sending file...");
        console.log(selectedFile);
        if (selectedFile === undefined) {
            return;
        }
        console.log("attach element to " + postId + " with type " + fileType);
        const formData = new FormData();
        formData.append('fileUpload', selectedFile);
        axios.post(baseUrl + `/postfile/${postId}/${fileType}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            return true;
        }).catch(err => {
            console.log(`post attachment error: ${err}`);
            return false;
        })
        return true;
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
                </div>
                <div className="post-attachment">
                    <label htmlFor="imageUpload">Add Image</label>
                    <input type="file" name="fileUpload" id="imageUpload" accept="image/*" multiple/>
                </div>
                <div className="post-attachment">
                    <label htmlFor="audioUpload">Add Audio</label>
                    <input type="file" name="fileUpload" id="audioUpload" accept="audio/*" multiple/>
                </div>
                <div className="post-attachment">
                    <label htmlFor="videoUpload">Add Video</label>
                    <input type="file" name="fileUpload" id="videoUpload" accept="video/*" multiple/>
                </div>
                <button onClick={async() => {
                    await sendMessage();
                }}>&#9658;</button>
                {/* <button id="videoSendBtn" onClick={async () => {
                        await sendFile("video", document.getElementById("videoUpload").files[0]); 
                        document.getElementById("videoUpload").value = null;
                    }}> Send Video</button> */}
              </div>
              <p id="post-result">{" "}</p>
            </div>
        </div>
    )
}

export default NewPost;