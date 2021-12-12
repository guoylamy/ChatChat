import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";

function Post(props) {
    const [postId, setPostId] = useState(props.postId)
    const [postContent, setPostContent] = useState('')
    const [posterName, setPosterName] = useState('')
    const [postTime, setPostTime] = useState('')
    const baseUrl = 'http://localhost:8081/post/'
    useEffect(() => {
      axios.get(baseUrl + postId).then(res => {
            console.log(res.data)
            setPostContent(res.data[0].post_content)
            setPosterName(res.data[0].user_name)
            setPostTime(res.data[0].create_time)
        })
    }, [])
    function jumpToPostDetailsPage() {
        window.location.href =
        window.location.protocol + "//" + window.location.host + "/PostDetails/" + postId
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
        </div>
    )
}

export default Post