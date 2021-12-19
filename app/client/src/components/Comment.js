import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";

function Comment(props) {
    const [userName, setUserName] = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)
    const [commentId, SetCommentId] = useState(props.commentId)
    const [commentContent, setCommentContent] = useState('')
    const [createTime, setCreateTime] = useState('')
    const [creatorId, setCreatorId] = useState('')
    const [creatorName, setCreatorName] = useState('')
    const [editComment, setEditComment] = useState('')
    const [flag, setFlag] = useState(false)
    const baseUrl = 'http://localhost:8081/comment/'
    useEffect(() => {
      axios.get(baseUrl + commentId).then(res => {
            setCommentContent(res.data[0].comment_content)
            setCreateTime(res.data[0].create_time)
            setCreatorId(res.data[0].creator_id)
            setEditComment(res.data[0].comment_content)
            axios.get(baseUrl + 'getCreatorName/' + res.data[0].creator_id).then(res1 => {
                // console.log(res1.data)
                setCreatorName(res1.data[0].user_name)
            })
        })
    }, [])
    function handleEditComment() {
        setFlag(true)
    }

    function handleDeleteComment() {
         axios.delete(baseUrl + 'deleteComment/' + commentId).then(res => {
                
            })
            window.location.reload(false)
    }

    function handleReviseComment() {
        axios.post(baseUrl + 'editComment', {commentId:commentId, commentContent:editComment}).then(res => {
                
            })
            window.location.reload(false)
    }
    return (
        <div>
            content: {commentContent}
            <br></br>
            create time: {createTime}
             <br></br>
            commented by: {creatorName}
            <br></br>
            {userName === creatorName ? <button onClick={e => handleEditComment()}>Edit</button> : ''}
            {userName === creatorName ? <button onClick={e => handleDeleteComment()}>Delete</button> : ''}
             {flag ? <div>
                <input type="text" name="editComment" placeholder="input your comment" onChange={e => setEditComment(e.target.value)} value={editComment}></input>
                <button onClick={e => {handleReviseComment()}}>Submit</button>
            </div> : ''}
        </div>
    )
}

export default Comment