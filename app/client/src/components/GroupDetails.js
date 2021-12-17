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
            <div class="has-text-left has-text-justified">
                Topics: {topics}
            </div>
        )
    }
    function getBoard() {
        return (
            <div class = "column is-half">
                <div class="is-size-4"> Board </div>
                {allPostsIds.map((id, i) => (
                    <div class="box" key={id}>
                        <Post postId={id}/>
                    </div>
                ))}
            </div>
        )
    }
    function getMembers() {
        // need to get members from database (distinguish creator, adminstrator)
        return (
            <div class = "column is-half">
                <div class="is-size-4">Members</div>
                <div class="is-size-5">Creator</div>
                {creator.map((member) => (
                    <div>{member}</div>
                ))}
                <div class="is-size-5">Admins</div>
                {admins.map((member) => (
                    <div>{member}</div>
                ))}
                <div class="is-size-5">Other Users</div>
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
                    <a href={window.location.protocol + "//" + window.location.host + "/manageGroupMembers/" + groupName}>Manage Group</a>
                </div>
            )
        }
    }
    return (
        <div>
            <NavBar />
            <div class="columns is-mobile is-vcentered">
                <div class="column is-three-quarters px-6">
                    <div class="row">
                        <div class="has-text-weight-bold has-text-left has-text-info"> Group: {groupName}</div>
                    </div>
                    <div class="row has-text-weight-bold">{getTopics()}</div> 
                </div>
                <div class="column is-one-third is-pulled-right"> {manageGroup()}</div>
                
            </div>

            <div class = "columns is-mobile">
                {getBoard()}
                {getMembers()}
            </div>
            
        </div>  
    )
}

export default GroupDetails