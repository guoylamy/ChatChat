import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from './Post'
function GroupDetails() {
    const {groupName, username} = useParams()
    const [topics, setTopics] = useState('')
    const [allPostsIds, setAllPostsIds] = useState([])
    const members = ['Tom', 'Amy', 'Martin', 'Brandon', 'Talan']
    const baseUrl = 'http://localhost:8081/groupDetails/'
    useEffect(() => {
      axios.get(baseUrl + 'topics/' + groupName).then(res => {
            setTopics(res.data[0].topics)
        })
    // need to get all post_id
      axios.get(baseUrl + 'allpostsids/' + groupName).then(res => {
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            setAllPostsIds(old => [...old, res.data[i].post_id])
          }
        })
    }, [])
    function getTopics() {
        return (
            <div>
                Topics: {topics}
            </div>
        )
    }
    function getBoard() {
        return (
            <div>
                <h1>Board</h1>
                {allPostsIds.map((id, i) => (
                    <div key={id}>
                        <Post postId={id}/>
                    </div>
                ))}
            </div>
        )
    }
    function getMembers() {
        // need to get members from database (distinguish creator, adminstrator)
        return (
            <div>
                <h1>Members</h1>
                {members.map((member) => (
                    <div></div>
                ))}
            </div>
        )
    }
    function manageGroup() {
        // if only the member is adminstrator or creator
        // if user.status() == creator || user.status() == admin
        if (true) {
            return (
                <div>
                    <a href={window.location.protocol + "//" + window.location.host + "/manageGroupMembers"}>manage</a>
                </div>
            )
        }
    }
    return (
        <div>
            <NavBar />
            {getTopics()}
            {getBoard()}
            {getMembers()}
            {manageGroup()}
        </div>  
    )
}

export default GroupDetails