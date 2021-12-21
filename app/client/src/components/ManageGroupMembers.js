import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
function ManageGroupMembers() {
    const {groupName} = useParams()
    const [creator, setCreator] = useState([])
    const [admins, setAdmins] = useState([])
    const [normalUsers, setNormalUsers] = useState([])
    const [adminToBeAdded, setAdminToBeAdded] = useState('')
    const [adminToBeRemoved, setAdminToBeRemoved] = useState('')
    const [userToBeInvited, setUserToBeInvited] = useState('')
    const userName = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)[0]
    const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:8081'
        : '';
    const previousUrl = `${domain}/api/groupDetails/`
    const baseUrl = `${domain}/api/manageGroupMembers/`
    useEffect(() => {
    // get creator name
    setCreator([])
    setAdmins([])
    setNormalUsers([])
    axios.get(previousUrl + 'getCreatorName/' + groupName).then(res => {
          setCreator(old => [...old, res.data[0].user_name])
        })

    // get all admins of this group except for creator
    axios.get(previousUrl + 'getAdminsNames/' + groupName).then(res => {
          for (var i = 0; i < res.data.length; i++) {
            // eslint-disable-next-line no-loop-func
            setAdmins(old => [...old, res.data[i].user_name])
          }
        })
    // normal users
    axios.get(previousUrl + 'getNormalUsersNames/' + groupName).then(res => {
        //   console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            // eslint-disable-next-line no-loop-func
            setNormalUsers(old => [...old, res.data[i].user_name])
          }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (normalUsers.includes(adminToBeAdded)) {
            axios.post(baseUrl + 'addAdmin', {groupName:groupName, userName:adminToBeAdded}).then(res => {
                console.log(res.data)
                
            })
            window.location.reload(false);
        }
        else {
            if (admins.includes(adminToBeAdded) || creator.includes(adminToBeAdded)) {
                alert("The user is already a adminstrator!")
            }
            else {
                alert("The user is not in this group!!!")
            }
        }
    }

    // only can remove admin among admins
    function removeAdmin() {
        if (admins.includes(adminToBeRemoved)) {
            axios.post(baseUrl + 'removeAdmin', {groupName:groupName, userName:adminToBeRemoved}).then(res => {
                // console.log(res.data)
                
            })
            window.location.reload(false);
        }
        else {
            if (creator.includes(adminToBeRemoved)) {
                alert("You can't remove creator.")
            }
            else if (normalUsers.includes(adminToBeAdded)){
                alert("The user is not a adminstrator.")
            }
            else {
                alert("The user is not in this group.")
            }
        }
    }

    // three conditions
    function leaveGroup() {
        axios.post(baseUrl + 'leaveGroup', {groupName:groupName, userName:userName}).then(res => {
                
            })
            window.location.href =
        window.location.protocol + "//" + window.location.host + '/groupsPage/' + userName
    }

    // only for user who is not in this group
    function inviteUser() {
       if (!normalUsers.includes(userToBeInvited) && !admins.includes(userToBeInvited) && !creator.includes(userToBeInvited)) {
            axios.post(baseUrl + 'inviteUser', {groupName:groupName, inviter:userName, userToBeInvited:userToBeInvited}).then(res => {
                // console.log(res.data)
                
            })
       }
       else {
           alert("The user is already in the group!")
       }
    }

    return (
        <div>
            <NavBar />
            <div>
                {getAllMembers()}
            </div>
            <div>
                {normalUsers.includes(userName) ? "":
                <div>
                    <input type="text" value={adminToBeAdded} onChange={e => setAdminToBeAdded(e.target.value)}></input>
                    <button onClick={addAdmin}>Add Admin</button>
                </div>
                
                }

                {normalUsers.includes(userName) ? "":
                <div>
                    <input type="text" value={adminToBeRemoved} onChange={e => setAdminToBeRemoved(e.target.value)}></input>
                    <button onClick={removeAdmin}>Remove Admin</button>
                </div>
                
                }
                <button onClick={leaveGroup}>Leave Group</button>
                <input type="text" value={userToBeInvited} onChange={e => setUserToBeInvited(e.target.value)}></input>
                <button onClick={inviteUser}>Invite User</button>
            </div>
        </div>
    )
}

export default ManageGroupMembers