import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import axios from "axios";
import "./NewPost.css";
import io from "socket.io-client";
import NavBar from "./NavBar";
// https://github.com/machadop1407/react-socketio-chat-app/blob/main/client/src/App.css
const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? 'http://localhost:8081'
  : '';
const baseUrl = domain + "/api"
const socket = io.connect(domain);

function NewPost() {
    const {creator_id, group_id} = useParams(); // creator_id = 5b746bd-cdee-301d-fe5-cfe4064af26f, group_id = 0863ccd-d673-71d1-ddb4-4f1b1f2ad8a
    const [currentMessage, setCurrentMessage] = useState("");
    const [userName, setUserName] = useState('')
    const [groupName, setGroupName] = useState('')
    const [hashtagToAdd, setHashtagToAdd] = useState('');
    const [hashTags, setHashTags] = useState([]);
    socket.emit("join_room", groupName);
    useEffect(() => {
      axios.get(baseUrl +'/newPost/'+ creator_id + "/" + group_id).then(res => {
            // console.log(res.data[0][0].user_name)
            setUserName(res.data[0][0].user_name)
            setGroupName(res.data[1][0].group_name)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendMessage = async () => {
        if (currentMessage === "") {
            return;
        }

        const messageData = {
            group_id: group_id,
            timestamp: Date.now(),
            sender: creator_id,
            message: currentMessage,
            hashtag: hashTags.join(',')
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
            await new Promise(r => setTimeout(r, 200));
            await socket.emit("send_message", groupName);
            window.location.href =
            window.location.protocol + "//" + window.location.host + "/groupDetails/" + groupName + '/' + userName;
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

    function addHashtag() {
        if (hashtagToAdd !== '') {
            setHashTags(old => [...old, hashtagToAdd]);
            setHashtagToAdd('');
        }
    }

    return (
        <div>
            <NavBar />
            <div className="post-window">
              <div className="post-header">
                <p>Post to group {groupName}</p>
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
                <div>
                    <label class="label">Hashtags </label>
                    <div>{hashTags.map((each) => (
                        <div>{each}</div>
                    ))}</div>
                  <input type="text" value={hashtagToAdd} onChange={e => setHashtagToAdd(e.target.value)}></input>
                  <button onClick={addHashtag}>Add hashtag</button>
                </div>
                {/* <button id="videoSendBtn" onClick={async () => {
                        await sendFile("video", document.getElementById("videoUpload").files[0]); 
                        document.getElementById("videoUpload").value = null;
                    }}> Send Video</button> */}
              </div>
              <button onClick={async() => {
                    await sendMessage();
                }}>Send</button>
              <p id="post-result">{" "}</p>
            </div>
        </div>
    )
}

export default NewPost;