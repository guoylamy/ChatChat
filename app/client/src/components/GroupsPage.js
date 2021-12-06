import React, {useState, useEffect} from "react"
import NavBar from './NavBar'
import axios from "axios";
import { useParams } from "react-router-dom";
function GroupsPage() {
    const {username} = useParams()
    const [joinGroupName, setJoinGroupName] = useState('')
    const [filterTopic, setFilterTopic] = useState('')
    const [publicGroup, setPublicGroup] = useState([])
    const [publicGroupTopics, setPublicGroupTopics] = useState([])
    const [privateGroup, setPrivateGroup] = useState([])
    const [privateGroupTopics, setPrivateGroupTopics] = useState([])
    const [groupNameToBeCreated, setGroupNameToBeCreated] = useState('')
    const [groupTypeToBeCreated, setGroupTypeToBeCreated] = useState('1')
    const [topics, setTopics] = useState([])
    const [topicToBeAdded, setTopicToBeAdded] = useState('')
    const [filterTopics, setFilterTopics] = useState([])
    const baseUrl = 'http://localhost:8081/grouppage/'
    useEffect(() => {
      axios.get(baseUrl + 'public/' + username).then(res => {
            setPublicGroup([])
            setPublicGroupTopics([])
            for (var i = 0; i < res.data[0].length; i++) {
                setPublicGroup(old => [...old, res.data[0][i].group_name])
            }
            for (var i = 0; i < res.data[1].length; i++) {
                setPublicGroupTopics(old => [...old, res.data[1][i].topics])
            }         
        })
        axios.get(baseUrl + 'private/' + username).then(res => {
            setPrivateGroup([])
            setPrivateGroupTopics([])
            for (var i = 0; i < res.data[0].length; i++) {
                setPrivateGroup(old => [...old, res.data[0][i].group_name])
            }
            for (var i = 0; i < res.data[1].length; i++) {
                setPrivateGroupTopics(old => [...old, res.data[1][i].topics])
            }
        })
    }, [])
    function getPublicGroups() {
        
        return (
            <div class="box">
                <h1 className="title is-5"> Public Groups</h1>
                {publicGroup.map((group_name, i) => (
                    <div key={group_name}>
                        <div class="is-clickable"
                            onClick = {jumpToGroupDetailsPage}
                        >
                       <p class="has-text-info">{group_name}</p>
                        <div>topics: {publicGroupTopics[i]}</div>
                        </div>
                        {/* <button class="button is-light" onClick={deletePrivateGroups(group_name)}>Delete</button> */}
                    </div>
                ))}
            </div>
        )
        
    }

    function deletePublicGroups(group_name) {
        // need to connect database to delete group with group_name

    }

    function deletePrivateGroups(group_name) {
        // need to connect database to delete group with group_name
    }

    function jumpToGroupDetailsPage(group_name) {
        window.location.href =
        window.location.protocol + "//" + window.location.host + "/groupDetails/" + group_name;
    }

    function getPrivateGroups() {
        
        return (
            <div class="box">
                <h1 className="title is-5"> Private Groups</h1>
                {privateGroup.map((group_name, i) => (
                    <div key={group_name}>
                        <div class="is-clickable"
                            onClick = {jumpToGroupDetailsPage}
                        >
                       <p class="has-text-info">{group_name}</p>
                        <div>topics: {privateGroupTopics[i]}</div>
                        </div>
                        {/* <button class="button is-light" onClick={deletePublicGroups(group_name)}>Delete</button> */}
                    </div>
                ))}
            </div>
        )
    }
    function createGroupButton() {
        console.log(groupNameToBeCreated, groupTypeToBeCreated);
        // pass two parameters: group name and group type. connect database to create a group
        axios.post(baseUrl + groupNameToBeCreated + '/' + groupTypeToBeCreated + '/' + username, {topics:topics}).then(res => {
            console.log(res.data)
        })
        window.location.reload(false);
    }
    function createGroupGroupName(event) {
        setGroupNameToBeCreated(event.target.value)
    }
    function createGroupSelectOption(event) {
        setGroupTypeToBeCreated(event.target.value)
    }
    function addTopic() {
        if (topicToBeAdded !== '') {
            setTopics(old => [...old, topicToBeAdded])
            setTopicToBeAdded('')
        }
    }
    function createGroup() {
        return (
            <div className="box">
                <h1 className="title is-5">Create Your Group</h1>
                <div class="field">
                <label class="label">Group Name </label> 
                    <input type="text" value={groupNameToBeCreated} onChange={createGroupGroupName}></input>
                </div>
                <label class="label">Group Topics </label>
                <div>{topics.map((each) => (
                    <div>{each}</div>
                ))}</div>
                <input type="text" value={topicToBeAdded} onChange={e => setTopicToBeAdded(e.target.value)}></input>
                <button onClick={addTopic}>Add topic</button>
                <label class="label">Group Type </label> 
                <div class="select is-info"> 
                    <select value={groupTypeToBeCreated}onChange={createGroupSelectOption}>
                        <option class="dropdown-item" value="1" disabled>Select</option>
                        <option class="dropdown-item" value="Private">Private</option>
                        <option class="dropdown-item" value="Public">Public</option>
                    </select>
                </div>
                <br></br>
                <br></br>
                <button class="button is-info" onClick={createGroupButton}>Create</button>
            </div>
        )
    }
    function joinPublicGroupButton() {
        axios.get(baseUrl + 'join/' + joinGroupName + '/' + username).then(res => {
            console.log(res.data)
        })
        window.location.reload(false);
    }
    function joinPublicGroup(){
        return (
            <div className="box"> 
                <h1 className="title is-5">Join Public Group</h1>
                <div>
                    <label class="label"> Group Name </label>
                    <input type="text" value={joinGroupName} onChange={e => setJoinGroupName(e.target.value)}></input>
                </div>
                <br></br>
                <button class="button is-info" onClick={joinPublicGroupButton}>Join</button>
            </div>
        )
    }
    function handleFilterSubmit() {
        axios.post(baseUrl + 'filter/' + username, {topics:filterTopics}).then(res => {
            console.log(res.data)
            if (res.data !== 'empty') {
                setPublicGroup([])
                setPublicGroupTopics([])
                for (var i = 0; i < res.data[0].length; i++) {
                    setPublicGroup(old => [...old, res.data[0][i]])
                }
                for (var i = 0; i < res.data[1].length; i++) {
                    setPublicGroupTopics(old => [...old, res.data[1][i]])
                }  
            }
        })
    }
    function addTopicToFilter() {
        if (filterTopic !== '') {
            setFilterTopics(old => [...old, filterTopic])
            setFilterTopic('')
        }
    }
    function filterByGroup() {
        return (
            <div className="box">
                 <h1 className="title is-5">Filter By Topic</h1>
                <div>{filterTopics.map((each) => (
                    <div>{each}</div>
                ))}</div>
                <input type="text" value={filterTopic} onChange={e => setFilterTopic(e.target.value)}></input>
                <button onClick={addTopicToFilter}>Add topic</button>
                <button class="button is-info" onClick={handleFilterSubmit}>Submit</button>
            </div>
        )
    }
    return (
        <div>
             <NavBar />
            <div class="columns">
                <div class="column is-one-third">{getPublicGroups()}</div>
                <div class="column is-one-third"> {getPrivateGroups()}</div>
                <div class="column is-one-third">
                    <div class="columns">
                        <div class="row">
                            <div class="column">  {filterByGroup()}</div>
                            <div class="column"> {joinPublicGroup()}</div>
                            <div class="column"> {createGroup()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupsPage;
