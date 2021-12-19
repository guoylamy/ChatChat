import React, {useState, useEffect} from "react"
import NavBar from './NavBar';
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from './Post'
function GroupDetails() {
    const {groupName, userName} = useParams()
    const [userId, setUserId] = useState('')
    const [groupId, setGroupId] = useState('')
    const [topics, setTopics] = useState('')
    const [allPostsIds, setAllPostsIds] = useState([])
    const [creator, setCreator] = useState([])
    const [admins, setAdmins] = useState([])
    const [normalUsers, setNormalUsers] = useState([])
    const [hidePostIds, setHidePostIds] = useState([])
    const [flaggedPostNum, setFlaggedPostNum] = useState(0);
    const [newestPostTime, setNewestPostTime] = useState('N/A');
    const baseUrl = 'http://localhost:8081/groupDetails/'
    useEffect(() => {
        setCreator([])
        setAdmins([])
        setNormalUsers([])
        setUserId('')
        setGroupId('')
      axios.get(baseUrl + 'topics/' + groupName).then(res => {
            setTopics(res.data[0].topics)
        })
    // need to get all post_id
      axios.get(baseUrl + 'allpostsids/' + groupName).then(res => {
          setAllPostsIds([]);
          let flaggedPost = 0;
          let pt= 0;
          for (var i = 0; i < res.data.length; i++) {
            setAllPostsIds(old => [...old, res.data[i].post_id])
            if (res.data[i].flag === 1) {
                flaggedPost += 1;
            }
            if (res.data[i].create_time > pt) {
                pt = res.data[i].create_time;
            }
          }
          setFlaggedPostNum(flaggedPost);
          const date = new Date(pt);
          const month = date.getMonth() < 12 ? date.getMonth() + 1 : 1;
          setNewestPostTime(date.getFullYear() + "-" + month + "-" +  date.getDate() + " " + date.getHours() + ":" + date.getMinutes());
        })

    // get creator name
    axios.get(baseUrl + 'getCreatorName/' + groupName).then(res => {
        //   console.log(res.data)
          setCreator(old => [...old, res.data[0].user_name])
        })

    // get all admins of this group except for creator
    axios.get(baseUrl + 'getAdminsNames/' + groupName).then(res => {
        //   console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            setAdmins(old => [...old, res.data[i].user_name])
          }
        })
    // normal users
    axios.get(baseUrl + 'getNormalUsersNames/' + groupName).then(res => {
        //   console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            setNormalUsers(old => [...old, res.data[i].user_name])
          }
        })
    // get user id
    axios.get(baseUrl + 'getUserId/' + userName).then(res => {
        //   console.log(res.data)
          setUserId(res.data[0].user_id)
        })
    // get hide post id
    axios.get(baseUrl + 'getHidePostIds/' + userName).then(res => {
        for (var i = 0; i < res.data.length; i++) {
            setHidePostIds(old => [...old, res.data[i].post_id])
          }
    })
    // get group id
    axios.get(baseUrl + 'getGroupId/' + groupName).then(res => {
        // console.log(res.data)
        setGroupId(res.data[0].group_id)
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
                {allPostsIds.map((id, i) => 
                    hidePostIds.includes(id) ? ('') : (<div class="box" key={id}>
                        <Post postId={id}/>
                    </div>)
                    
                )}
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
    function groupAnalysis() {
        return (
            <div className="box"> 
                <h1 className="title is-5">Group Analytics</h1>
                <label class="label"> Number of members: {creator.length + admins.length + normalUsers.length}</label>
                <label class="label"> Number of posts: {allPostsIds.length}</label>
                <label class="label"> Number of post hidden: {hidePostIds.length}</label>
                <label class="label"> Number of post flagged: {flaggedPostNum}</label>
                <label class="label"> Newest post time: {newestPostTime}</label>
            </div>
        )
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
            <div class="columns is-mobile"> {groupAnalysis()}</div>
            <a href={window.location.protocol + "//" + window.location.host + "/post/" + userId + '/' + groupId}>Make a post</a>
        </div>  
    )
}

export default GroupDetails