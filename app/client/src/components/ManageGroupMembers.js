import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from './Post'
function ManageGroupMembers() {
    const {groupName} = useParams()
    const [creator, setCreator] = useState([])
    const [admins, setAdmins] = useState([])
    const [normalUsers, setNormalUsers] = useState([])
    const [adminToBeAdded, setAdminToBeAdded] = useState('')
    const [adminToBeRemoved, setAdminToBeRemoved] = useState('')
    const [userToBeInvited, setUserToBeInvited] = useState('')
    const previousUrl = 'http://localhost:8081/groupDetails/'
    const baseUrl = 'http://localhost:8081/manageGroupMembers/'
    useEffect(() => {
    // get creator name
    setCreator([])
    setAdmins([])
    setNormalUsers([])
    axios.get(previousUrl + 'getCreatorName/' + groupName).then(res => {
          console.log(res.data)
          setCreator(old => [...old, res.data[0].user_name])
        })

    // get all admins of this group except for creator
    axios.get(previousUrl + 'getAdminsNames/' + groupName).then(res => {
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            setAdmins(old => [...old, res.data[i].user_name])
          }
        })
    // normal users
    axios.get(previousUrl + 'getNormalUsersNames/' + groupName).then(res => {
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            setNormalUsers(old => [...old, res.data[i].user_name])
          }
        })
    }, [])

    function getAllMembers() {
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

    // only can add admin among normalUsers
    function addAdmin() {
        
    }

    // only can remove admin among admins
    function removeAdmin() {

    }

    // three conditions
    function leaveGroup() {

    }

    // only for user who is not in this group
    function inviteUser() {
       
    }

    return (
        <div>
            <div>
                {getAllMembers()}
            </div>
            <div>
                <input type="text" value={adminToBeAdded} onChange={e => setAdminToBeAdded(e.target.value)}></input>
                <button onClick={addAdmin}>Add Admin</button>
                <input type="text" value={adminToBeRemoved} onChange={e => setAdminToBeRemoved(e.target.value)}></input>
                <button onClick={removeAdmin}>Remove Admin</button>
                <button onClick={leaveGroup}>Leave Group</button>
                <input type="text" value={userToBeInvited} onChange={e => setUserToBeInvited(e.target.value)}></input>
                <button onClick={inviteUser}>Invite User</button>
            </div>
        </div>
    )
}

export default ManageGroupMembers