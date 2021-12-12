import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";

function Comment(props) {
    const [commentId, SetCommentId] = useState(props.commentId)
    const [commentContent, setCommentContent] = useState('')
    const [createTime, setCreateTime] = useState('')
    const [creatorId, setCreatorId] = useState('')
    const [creatorName, setCreatorName] = useState('')
    const baseUrl = 'http://localhost:8081/comment/'
    useEffect(() => {
      axios.get(baseUrl + commentId).then(res => {
            setCommentContent(res.data[0].comment_content)
            setCreateTime(res.data[0].create_time)
            setCreatorId(res.data[0].creator_id)
            axios.get(baseUrl + 'getCreatorName/' + res.data[0].creator_id).then(res1 => {
                setCreatorName(res1.data[0].user_name)
            })
        })
    }, [])
    return (
        <div>
            content: {commentContent}
            <br></br>
            create time: {createTime}
             <br></br>
            commented by: {creatorName}
        </div>
    )
}

export default Comment