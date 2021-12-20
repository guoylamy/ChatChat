import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";

function Post(props) {
    const [userName, setUserName] = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)
    const [postId, setPostId] = useState(props.postId)
    const [userId, setUserId] = useState('')
    const [groupId, setGroupId] = useState('')
    const [postContent, setPostContent] = useState('')
    const [posterName, setPosterName] = useState('')
    const [postTime, setPostTime] = useState('')
    const [adminsList, setAdminsList] = useState([])
    const [flag, setFlag] = useState(false)
    const [hashTags, setHashTags] = useState('')
    const baseUrl = 'http://localhost:8081/post/'
    useEffect(() => {
        setAdminsList([])
      axios.get(baseUrl + postId).then(res => {
            if (res.data[0].message_type === "string") {
                setPostContent(Buffer.from(res.data[0].post_content).toString('utf8'))
            }
            setPosterName(res.data[0].user_name)
            setHashTags(res.data[0].hash_tags)
            const date = new Date(res.data[0].create_time);
            const month = date.getMonth() < 12 ? date.getMonth() + 1 : 1;
            setPostTime(date.getFullYear() + "-" + month + "-" +  date.getDate() + " " + date.getHours() + ":" + date.getMinutes());
        })
        axios.get(baseUrl + 'findUserId/' + userName).then(res => {
            setUserId(res.data[0].user_id)
        })
         axios.get(baseUrl + 'getGroupId/' + postId).then(res => {
           axios.get(baseUrl + 'getAdminsList/' + res.data[0].group_id).then(res1 => {
                for (var i = 0; i < res1.data.length; i++) {
                    setAdminsList(old => [...old, res1.data[i].user_id])
                }
            })
        })
        axios.get(baseUrl + 'getFlagValue/' + postId).then(res => {
            // console.log(res.data)
            if (res.data[0].flag === 1) {
                setFlag(true)
            }
            else {
                setFlag(false)
            }
        })
    }, [])
    function jumpToPostDetailsPage() {
        window.location.href =
        window.location.protocol + "//" + window.location.host + "/PostDetails/" + postId
    }
    function handleDeletePost() {
         axios.delete(baseUrl + 'deletePost/' + postId).then(res => {
            
        })
        window.location.reload(false)
    }
    function handleHidePost() {
        axios.post(baseUrl + 'hidePost', {userId:userId, postId:postId}).then(res => {
            
        })
        window.location.reload(false)
    }
    function handleCheckBoxChange() {
         axios.post(baseUrl + 'updateFlagStatus/' + postId + '/' + flag).then(res => {
            
        })
        window.location.reload(false)
    }
    return (
        <div>
            <div class="is-clickable"
                            onClick = {e => jumpToPostDetailsPage()}
                        >
                {postContent}
                <br></br>
                poster:{posterName}
                <br></br>
                post time:{postTime}
                <br></br>
                hash tags:{hashTags}
                <br></br>
            </div>
            <div>
            {(userName === posterName || adminsList.includes(userId)) ? <button onClick={e => handleDeletePost()}>Delete</button> : ''}
            {userName === posterName ? '' : <button onClick={e => handleHidePost()}>Hide</button>}
             flag <input type='checkbox' checked={flag} onChange={() => handleCheckBoxChange()}/>
            </div>
        </div>
    )
}

export default Post