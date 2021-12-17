import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
import Comment from './Comment'

function PostDetails() {
    const {postId} = useParams()
    const [postContent, setPostContent] = useState([])
    const [posterName, setPosterName] = useState('')
    const [postTime, setPostTime] = useState('')
    const [allCommentsIds, setAllCommentsIds] = useState([])
    const baseUrl = 'http://localhost:8081/postDetails/'
    useEffect(() => {
      axios.get(baseUrl + postId).then(res => {
            let resList = [];
            resList.push({
                post_content: res.data[0].post_content,
                post_type: res.data[0].message_type,
                mimetype: res.data[0].mimetype,
            });
            console.log(res.data[0]);
            setPostContent(resList);
            setPosterName(res.data[0].user_name)
            const date = new Date(res.data[0].create_time);
            setPostTime(date.getFullYear() + "-" + date.getMonth() + "-" +  date.getDate() + " " + date.getHours() + ":" + date.getMinutes());
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
            <div class="rows">
                {allCommentsIds.map((id, i) => (
                    <div class="box" key={id}>
                        <Comment commentId={id}/>
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div>
            <NavBar />
            <div class="row px-6">
                <div class="has-text-weight-bold has-text-left has-text-info"> View Post </div>
            </div>
            <article class="media">
                   {postContent.map((postContent) => {
                        if (postContent.post_type === "string") {
                            return (
                                <div class="media-content">
                                    <div className="message-content">
                                    <p>{Buffer.from(postContent.post_content).toString('utf8')}</p>
                                </div>
                                    <div className="message-meta">
                                        <p id="time">post time: {postTime}</p>
                                        <p id="author">posted by: {posterName}</p>
                                    </div>
                                </div>
                            );
                        } else if (postContent.post_type === "image") {
                            const img = `data:${postContent.mimetype};base64,` + Buffer.from(postContent.post_content).toString('base64');
                            return (
                                <div class="media-content">
                                    <div className="message-content">
                                        <img src={img} />
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">post time: {postTime}</p>
                                        <p id="author">posted by: {posterName}</p>
                                    </div>
                                </div>
                            );
                        } else if (postContent.post_type === "audio") {
                            const audio = `data:${postContent.mimetype};base64,` + Buffer.from(postContent.post_content).toString('base64');
                            return (
                                <div class="media-content">
                                    <div className="message-content">
                                        <audio controls src={audio} />
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">post time: {postTime}</p>
                                        <p id="author">posted by: {posterName}</p>
                                    </div>                                
                                </div>
                            );
                        } else {
                            const video = `data:${postContent.mimetype};base64,` + Buffer.from(postContent.post_content).toString('base64');
                            return (
                                <div class="media-content">
                                    <div className="message-content">
                                        <video width="400" height="300" controls>
                                            <source src={video} type={postContent.mimetype} />
                                        </video>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">post time:{postTime}</p>
                                        <p id="author">posted by: {posterName}</p>
                                    </div>                                
                                </div>
                            );
                        }
                    })}
            </article>
            <div>
                <div class="is-size-4 has-text-info">comments:</div>
                <br></br>
                <div class="columns is-half is-centered">
                    {getAllComments()}
                </div>
                
            </div>
        </div>
    )
}

export default PostDetails