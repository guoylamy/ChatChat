import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from './Comment'
import './PostDetails.css';
var uuid = require("react-uuid");

function PostDetails() {
    const userName = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)[0]
    const {postId} = useParams()
    const [userId, setUserId] = useState('')
    // const [postContent, setPostContent] = useState([])
    const [postContentList, setPostContent] = useState([])
    const [posterName, setPosterName] = useState('')
    const [postTime, setPostTime] = useState('')
    const [allCommentsIds, setAllCommentsIds] = useState([])
    const [comment, setComment] = useState('')
     const [hashTags, setHashTags] = useState([])
     const [hashTagsToBeAdded, setHashTagsToBeAdded] = useState([])
    const [currentHashTag, setCurrentHashTag] = useState('')
    const [currentHashTagToBeAdded, setCurrentHashTagToBeAdded] = useState('')
    const [commentIdsWithHashTags, setCommentIdsWithHashTags] = useState([-1])
    const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:8081'
        : '';
    const baseUrl = `${domain}/postDetails/`;
    useEffect(() => {
      let resList = [];
      axios.get(baseUrl + postId).then(res => {
            resList.push({
                post_content: res.data[0].post_content,
                post_type: res.data[0].message_type,
                mimetype: res.data[0].mimetype,
            });
            // console.log("text res");
            // console.log(resList);
            // setPostContent(resList);
            setPosterName(res.data[0].user_name)
            const date = new Date(res.data[0].create_time);
            const month = date.getMonth() < 12 ? date.getMonth() + 1 : 1;
            setPostTime(date.getFullYear() + "-" + month + "-" +  date.getDate() + " " + date.getHours() + ":" + date.getMinutes());
        });
      axios.get(baseUrl + 'attachments/' + postId).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            resList.push({
                post_content: res.data[i].post_content,
                post_type: res.data[i].message_type,
                mimetype: res.data[i].mimetype,
            });
            console.log("attach res");
            console.log(resList);
          }; 
        //   console.log("resList");
          setPostContent(resList);
        });
      axios.get(baseUrl + 'allCommentsIds/' + postId).then(res => {
            // console.log(res.data)
            for (var i = 0; i < res.data.length; i++) {
                // eslint-disable-next-line no-loop-func
                setAllCommentsIds(old => [...old, res.data[i].comment_id])
            }
        })
    axios.get(baseUrl + 'getUserId/' + userName).then(res => {
        // console.log(res.data)
        setUserId(res.data[0].user_id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getAllComments() {
        return (
            <div class="rows">
                {allCommentsIds.map((id, i) => (
                    commentIdsWithHashTags.length === 1 && commentIdsWithHashTags[0] === -1 ? 
                    <div class="box" key={id}>
                        <Comment commentId={id}/>
                    </div> : (commentIdsWithHashTags.includes(id) ? <div class="box" key={id}>
                        <Comment commentId={id}/>
                    </div> : '')
                ))}
            </div>
        )
    }

    function handleMakeComment() {
        axios.post(baseUrl + 'makeComment', {hashTags: hashTagsToBeAdded, commentId:uuid(), commentContent:comment, creatTime:Date.now(), creatorId: userId, postId:postId}).then(res => {
            // console.log(res.data)
    })
    window.location.reload(false)
    }

    function makeComment() {
        return (
            <div>
                <input type="text" name="commentBox" placeholder="input your comment" onChange={e => setComment(e.target.value)} value={comment}></input>
                <button onClick={handleMakeComment}>Make a comment</button>
                
            </div>
        )
    }
      function handleAddTag() {
        if (currentHashTag !== '') {
            setHashTags(old => [...old, currentHashTag])
            setCurrentHashTag('')
        }
    }
    function handleHashTagsSubmit() {
        setCommentIdsWithHashTags([])
        axios.post(baseUrl + 'getCommentsIdsByHashTags', {hashTags:hashTags, postId:postId}).then(res => {
            for (var i = 0; i < res.data.length; i++) {
                console.log(res.data[i])
                // eslint-disable-next-line no-loop-func
                setCommentIdsWithHashTags(old => [...old, res.data[i]])
            }
        })
    }
    function getHashTags() {
        return (
            <div>
                 <h1>Filter By HashTag</h1>
                <div>{hashTags.map((each) => (
                    <div>{each}</div>
                ))}</div>
                <input type="text" value={currentHashTag} onChange={e => setCurrentHashTag(e.target.value)}></input>
                <button onClick={handleAddTag}>Add Tag</button>
                <button onClick={handleHashTagsSubmit}>Submit</button>
            </div>
        )
    }

    function handleAddHashTagToBeAdded() {
        if (currentHashTagToBeAdded !== '') {
            setHashTagsToBeAdded(old => [...old, currentHashTagToBeAdded])
            setCurrentHashTagToBeAdded('')
        }
    }
    
    function addHashTags() {
        return (
            <div>
                <div>{hashTagsToBeAdded.map((each) => (
                    <div>{each}</div>
                ))}</div>
                <input type="text" value={currentHashTagToBeAdded} onChange={e => setCurrentHashTagToBeAdded(e.target.value)}></input>
                <button onClick={handleAddHashTagToBeAdded}>Add Tag</button>
            </div>
        )
    }
    return (
        <div>
            <NavBar />
            <div class="row px-6">
                <div class="has-text-weight-bold has-text-left has-text-info"> View Post </div>
            </div>
            <div className="media-container">
                   {postContentList.map((postContent) => {
                    //    console.log("postContentList has length " + postContentList.length);
                    //    console.log(postContentList);
                        if (postContent.post_type === "string") {
                            return (
                                    <div className="message-content">
                                    <p>{Buffer.from(postContent.post_content).toString('utf8')}</p>
                                    </div>
                            );
                        } else if (postContent.post_type === "image") {
                            const img = `data:${postContent.mimetype};base64,` + Buffer.from(postContent.post_content).toString('base64');
                            return (
                                    <div className="message-content">
                                        <img src={img} alt="cannot load" width="200px" height="200px"/>
                                    </div>
                            );
                        } else if (postContent.post_type === "audio") {
                            const audio = `data:${postContent.mimetype};base64,` + Buffer.from(postContent.post_content).toString('base64');
                            return (
                                    <div className="message-content">
                                        <audio controls src={audio} />
                                    </div>
                            );
                        } else {
                            const video = `data:${postContent.mimetype};base64,` + Buffer.from(postContent.post_content).toString('base64');
                            return (
                                    <div className="message-content">
                                        <video width="400" height="300" controls>
                                            <source src={video} type={postContent.mimetype} />
                                        </video>
                                    </div>
                            );
                        }
                    })}
                    <div className="message-meta">
                        <p id="time">post time:{postTime}</p>
                        <p id="author">posted by: {posterName}</p>
                    </div>
            </div>
            <div className="media-container">
                <div class="is-size-4 has-text-info">comments:</div>
                {makeComment()}
                <br></br>
                <div class="columns is-half is-centered">
                    {getAllComments()}
                </div>
            </div>
            {makeComment()}
            {addHashTags()}
            {getHashTags()}
        </div>
    )
}

export default PostDetails