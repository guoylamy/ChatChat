import React, {useState, useEffect} from "react"
import axios from "axios";

function Post(props) {
    const userName = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)[0]
    const postId = useState(props.postId)[0]
    const [userId, setUserId] = useState('')
    const [postContent, setPostContent] = useState('')
    const [posterName, setPosterName] = useState('')
    const [postTime, setPostTime] = useState('')
    const [adminsList, setAdminsList] = useState([])
    const [flag, setFlag] = useState(false)
    const [flaggedId, setFlaggedId] = useState('')
    const [hashTags, setHashTags] = useState('')
    const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:8081'
        : '';
    const baseUrl = `${domain}/api/post/`;
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
                    // eslint-disable-next-line no-loop-func
                    setAdminsList(old => [...old, res1.data[i].user_id])
                }
            })
        })
        axios.get(baseUrl + 'getFlagValue/' + postId).then(res => {
            // console.log(res.data)
            if (res.data[0].flag === 1) {
                setFlag(true)
                setFlaggedId(res.data[0].flaggedId);
            }
            else {
                setFlag(false)
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        axios.post(baseUrl + 'updateFlagStatus/' + postId + '/' + flag + '/' + userName).then(res => {})
        window.location.reload(false)
    }
    function getFlaggedBy() {
        console.log(flag);
        console.log(adminsList);
        console.log(userId);
        if (adminsList.includes(userId) && flag){
            return (
                <div>Flagged By {flaggedId}</div>
            )
        } else {
            return (
                <div>{' '}</div>
            )
        }
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
             flag <input id="flagBox" type='checkbox' checked={flag} onChange={() => handleCheckBoxChange()} disabled={flag}/> {getFlaggedBy()}
            </div>
        </div>
    )
}

export default Post