import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from './Comment'

function PostDetails() {
    const {postId} = useParams()
    const [postContent, setPostContent] = useState('')
    const [posterName, setPosterName] = useState('')
    const [postTime, setPostTime] = useState('')
    const [allCommentsIds, setAllCommentsIds] = useState([])
    const baseUrl = 'http://localhost:8081/postDetails/'
    useEffect(() => {
      axios.get(baseUrl + postId).then(res => {
            setPostContent(res.data[0].post_content)
            setPosterName(res.data[0].user_name)
            setPostTime(res.data[0].create_time)
        })
     axios.get(baseUrl + 'allCommentsIds/' + postId).then(res => {
            // console.log(res.data)
            for (var i = 0; i < res.data.length; i++) {
                setAllCommentsIds(old => [...old, res.data[i].comment_id])
            }
        })
    }, [])

    function getAllComments() {
        return (
            <div>
                {allCommentsIds.map((id, i) => (
                    <div key={id}>
                        <Comment commentId={id}/>
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div>
            <div>
                {postContent}
                <br></br>
                poster:{posterName}
                <br></br>
                post time:{postTime}
                <br></br>
            </div>
            <div>
                <h1>comments</h1>
                {getAllComments()}
            </div>
        </div>
    )
}

export default PostDetails