import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from './Post'
function GroupDetails() {
    const {groupName, username} = useParams()
    const [topics, setTopics] = useState('')
    const [allPostsIds, setAllPostsIds] = useState([])
    const [creator, setCreator] = useState([])
    const [admins, setAdmins] = useState([])
    const [normalUsers, setNormalUsers] = useState([])
    const members = ['Tom', 'Amy', 'Martin', 'Brandon', 'Talan']
    const baseUrl = 'http://localhost:8081/groupDetails/'
    useEffect(() => {
        setCreator([])
        setAdmins([])
        setNormalUsers([])
      axios.get(baseUrl + 'topics/' + groupName).then(res => {
            setTopics(res.data[0].topics)
        })
    // need to get all post_id
      axios.get(baseUrl + 'allpostsids/' + groupName).then(res => {
          for (var i = 0; i < res.data.length; i++) {
            setAllPostsIds(old => [...old, res.data[i].post_id])
          }
        })
    // get creator name
    axios.get(baseUrl + 'getCreatorName/' + groupName).then(res => {
          console.log(res.data)
          setCreator(old => [...old, res.data[0].user_name])
        })

    // get all admins of this group except for creator
    axios.get(baseUrl + 'getAdminsNames/' + groupName).then(res => {
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            setAdmins(old => [...old, res.data[i].user_name])
          }
        })
    // normal users
    axios.get(baseUrl + 'getNormalUsersNames/' + groupName).then(res => {
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            setNormalUsers(old => [...old, res.data[i].user_name])
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
                <h2>Creator</h2>
                {creator.map((member) => (
                    <div>{member}</div>
                ))}
                <h2>Admins</h2>
                {admins.map((member) => (
                    <div>{member}</div>
                ))}
                <h2>Normal Users</h2>
                {normalUsers.map((member) => (
                    <div>{member}</div>
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
                    <a href={window.location.protocol + "//" + window.location.host + "/manageGroupMembers/" + groupName}>manage</a>
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