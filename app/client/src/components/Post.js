import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";

function Post(props) {
    const [userName, setUserName] = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)
    const [postId, setPostId] = useState(props.postId)
    const [userId, setUserId] = useState('')
    const [postContent, setPostContent] = useState('')
    const [posterName, setPosterName] = useState('')
    const [postTime, setPostTime] = useState('')
    const baseUrl = 'http://localhost:8081/post/'
    useEffect(() => {
      axios.get(baseUrl + postId).then(res => {
            if (res.data[0].message_type === "string") {
                setPostContent(Buffer.from(res.data[0].post_content).toString('utf8'))
            }
            setPosterName(res.data[0].user_name)
            setPostTime(res.data[0].create_time)
        })
        axios.get(baseUrl + 'findUserId/' + userName).then(res => {
            setUserId(res.data[0].user_id)
            // console.log(res.data)
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
            </div>
            <div>
            {userName === posterName ? <button onClick={e => handleDeletePost()}>Delete</button> : ''}
            {userName === posterName ? '' : <button onClick={e => handleHidePost()}>Hide</button>}
            </div>
        </div>
    )
}

export default Post