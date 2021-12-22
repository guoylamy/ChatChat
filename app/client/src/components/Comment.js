import React, {useState, useEffect} from "react"
import axios from "axios";

function Comment(props) {
    const userName = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)[0];
    const commentId = useState(props.commentId)[0];
    const [commentContent, setCommentContent] = useState('')
    const [createTime, setCreateTime] = useState('')
    const setCreatorId = useState('')[1]
    const [creatorName, setCreatorName] = useState('')
    const [editComment, setEditComment] = useState('')
    const [hashTags, setHashTags] = useState('')
    const [flag, setFlag] = useState(false)
    const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:8081'
    : '';
    const baseUrl = `${domain}/api/comment/`;
    useEffect(() => {
      axios.get(baseUrl + commentId).then(res => {
            setCommentContent(res.data[0].comment_content)
            const date = new Date(Number(res.data[0].create_time));
            console.log(res.data[0], date)
            const month = date.getMonth() < 12 ? date.getMonth() + 1 : 1;
            setCreateTime(date.getFullYear() + "-" + month + "-" +  date.getDate() + " " + date.getHours() + ":" + date.getMinutes())

            setCreatorId(res.data[0].creator_id)
            setEditComment(res.data[0].comment_content)
            setHashTags(res.data[0].hash_tags)
            axios.get(baseUrl + 'getCreatorName/' + res.data[0].creator_id).then(res1 => {
                // console.log(res1.data)
                setCreatorName(res1.data[0].user_name)
            })
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            hash tags: {hashTags}
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