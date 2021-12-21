import { useParams } from "react-router-dom";
import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import Post from './Post';
import './Profile.css';

function Profile() {
  const [userName, setUserName] = useState(JSON.parse(sessionStorage.getItem('sessionObject')).userName)
  const [registerDate, setRegisterDate] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [invitedGroupsIds, setInvitedGroupsIds] = useState([])
  const [adminGroupsIds, setAdminGroupsIds] = useState([])
  const [publicGroupsRequestsIds, setPublicGroupsRequestsIds] = useState([])
  const [notifications, setNotifications] = useState([])
  const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? 'http://localhost:8081'
  : '';
  const baseUrl = `${domain}/profile/`;
  useEffect(() => {
    axios.get(baseUrl + 'getRegsiterDate/' + userName).then(res => {
          setRegisterDate((res.data[0].register_date).slice(0, 10))
        })
    axios.get(baseUrl + 'getGroupsInvitations/' + userName).then(res => {
          // console.log(res.data)
          setInvitedGroupsIds([])
          for (var i = 0; i < res.data.length; i++) {
            setInvitedGroupsIds(old => [...old, [res.data[i].group_id, res.data[i].group_name]])
          }
        })
      axios.get(baseUrl + 'getAdminGroupsIds/' + userName).then(res => {
          // console.log(res.data)
          setAdminGroupsIds([])
          for (var i = 0; i < res.data.length; i++) {
            setAdminGroupsIds(old => [...old, [res.data[i].group_id, res.data[i].group_name, res.data[i].user_to_be_invited, res.data[i].user_name]])
          }
        })
        axios.get(baseUrl + 'getPublicGroupsRequestsIds/' + userName).then(res => {
          // console.log(res.data)
          setPublicGroupsRequestsIds([])
          for (var i = 0; i < res.data.length; i++) {
            setPublicGroupsRequestsIds(old => [...old, [res.data[i].group_id, res.data[i].group_name, res.data[i].user_id, res.data[i].user_name]])
          }
        })
        axios.get(baseUrl + 'getNotifications/' + userName).then(res => {
          setNotifications([])
          for (var i = 0; i < res.data.length; i++) {
            setNotifications(old => [...old, [res.data[i].group_id, res.data[i].group_name, res.data[i].notified, res.data[i].user_id]])
          }
          
        })
    }, [])
    
    function handleUploadAvatar(selectedFile) {
      const formData = new FormData();
      formData.append('fileUpload', selectedFile);
      axios.post(baseUrl + 'uploadavatar/' + userName, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
      }).then(res => {
        console.log(res.data);
      }).catch(err => {
        console.log(`error: ${err}`);
      })
    }

    function getAvatar() {
      axios.get(baseUrl + "getavatar/" + userName).then(res => {
        if (res.data[0].avatar == null) {
          return;
        }
        const img = `data:${res.data[0].mimetype};base64,` + Buffer.from(res.data[0].avatar).toString('base64');
        document.getElementById("avatar").src = img;
      }).catch(err => {
        console.log(`error: ${err}`);
      })
    }

    function deleteAvatar() {
      axios.delete(baseUrl + "deleteavatar/" + userName).then(res => {
        // console.log(res);
      }).catch(err => {
        console.log(`delete error: ${err}`);
      })
    }

    function handleChangePassword() {
      axios.post(baseUrl + 'changePassword/' + userName + '/' + newPassword).then(res => {
          
        })
      window.location.href =
        window.location.protocol + "//" + window.location.host 
    }

    // need to implement, it will delete the account from user_table
    function handleDeleteAccount() {
      axios.delete(baseUrl + 'deleteAccount/' + userName).then(res => {
          
        })
      window.location.href =
        window.location.protocol + "//" + window.location.host 
        
    }

    function handleAcceptInvitation(groupId) {
      // update invite table and update group_user_table
      axios.post(baseUrl + 'acceptInvitation/' + userName + '/' + groupId).then(res => {
          
        })
        window.location.reload(false);
    }

    function handleDeclineInvitation(groupId) {
      axios.post(baseUrl + 'declineInvitation/' + userName + '/' + groupId).then(res => {
          
        })
        window.location.reload(false);
    }

    function handleApproveRequest(groupId, userId) {
      axios.post(baseUrl + 'approveRequest/' + userId + '/' + groupId).then(res => {
          
        })
        window.location.reload(false);
    }

    function handleDeclineRequest(groupId, userId) {
      axios.post(baseUrl + 'declineRequest/' + userId + '/' + groupId).then(res => {
          
        })
        window.location.reload(false);
    }

    function handleApprovePublicRequest(groupId, userId) {
      axios.post(baseUrl + 'approvePublicRequest/' + userId + '/' + groupId).then(res => {
          
        })
        window.location.reload(false);
        
    }

    function handleDeclinePublicRequest(groupId, userId) {
      axios.post(baseUrl + 'declinePublicRequest/' + userId + '/' + groupId).then(res => {
          
        })
        window.location.reload(false);
    }

    function handleNotification(groupId, userId) {
      console.log(groupId, userId)
      axios.delete(baseUrl + 'resolveNotification/' + userId + '/' + groupId).then(res => {
          
        })
        window.location.reload(false);
    }

    function getInvitations() {
      return (
        <div>
          {invitedGroupsIds.length === 0 ? "":"Here are some group invitations for you"}
            
            {invitedGroupsIds.map((id, i) => (
                    <div key={id}>
                        Group {id[1]} invites you to join
                        <button onClick={e => handleAcceptInvitation(id[0])}>Accept</button>
                        <button onClick={e => handleDeclineInvitation(id[0])}>Decline</button>
                    </div>
                ))}
          
          {adminGroupsIds.length === 0 ? "":"Here are some requests for you to approve"}
          {adminGroupsIds.map((id, i) => (
                    <div key={id}>
                        User {id[3]} wants to join private group {id[1]}
                        <button onClick={e => handleApproveRequest(id[0], id[2])}>Approve</button>
                        <button onClick={e => handleDeclineRequest(id[0], id[2])}>Decline</button>
                    </div>
                ))}
          {publicGroupsRequestsIds.map((id, i) => (
                    <div key={id}>
                        User {id[3]} wants to join public group {id[1]}
                        <button onClick={e => handleApprovePublicRequest(id[0], id[2])}>Approve</button>
                        <button onClick={e => handleDeclinePublicRequest(id[0], id[2])}>Decline</button>
                    </div>
                ))}
            <h1>Notifications</h1>
            {notifications.map((id, i) => (
                    <div key={id}>
                        Your request to join group {id[1]} has been {id[2] === 1 ? "approved" : "declined"}
                        <button onClick={e => handleNotification(id[0], id[3])}>Got it</button>
                    </div>
                ))}
          </div>
      )
    }
    return (
      <div>
        <NavBar />
        <div>
          Name: {userName}
          Regsiter Date: {registerDate}
          <div>
            <label htmlFor="imageUpload">Upload you avatar</label>
            <input type="file" name="fileUpload" id="imageUpload" accept="image/*" onChange={async (event) => {
              await handleUploadAvatar(event.target.files[0]);
              event.target.value = null;
            }} />
            <button onClick={deleteAvatar}>Delete your avatar</button>
          </div>
          <div>
              <img id="avatar" src="/images/avatar.png" alt="Avatar" ></img>
              {getAvatar()}
          </div>
          {getInvitations()}
          <div>
            If you want to reset your password:
            {/* <input type="text" name="oldPassword" placeholder="input your old password" onChange={e => setOldPassword(e.target.value)} value={oldPassword}></input> */}
            <input type="text" name="newPassword" placeholder="input your new password" onChange={e => setNewPassword(e.target.value)} value={newPassword}></input>
            <button onClick={handleChangePassword}>Confirm change password</button>
            <button onClick={handleDeleteAccount}>Delete your account</button>
          </div>
        </div>
      </div>
    )
}

export default Profile;
