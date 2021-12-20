import React, {useState, useEffect} from "react"
import NavBar from './NavBar'
import axios from "axios";
import { Link, useParams, Redirect  } from "react-router-dom";
function GroupsPage() {
    const {userName} = useParams()
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
    const [suggestGroup, setSuggestGroup] = useState([])
    const [publicGroupOrder, setPublicGroupOrder] = useState('1');
    const [allPublicGroups, setAllPublicGroups] = useState([])
    const baseUrl = 'http://localhost:8081/grouppage/'
    useEffect(() => {
        axios.get(baseUrl + 'getAllPublicGroups').then(res => {
            for (var i = 0; i < res.data.length; i++) {
                setAllPublicGroups(old => [...old, res.data[i].group_name])
            }
        })
        queryPublicGroups(publicGroupOrder);
        axios.get(baseUrl + 'private/' + userName).then(res => {
            setPrivateGroup([])
            setPrivateGroupTopics([])
            for (var i = 0; i < res.data[0].length; i++) {
                setPrivateGroup(old => [...old, res.data[0][i].group_name])
            }
            for (var i = 0; i < res.data[1].length; i++) {
                setPrivateGroupTopics(old => [...old, res.data[1][i].topics])
            }
        })
        axios.get(baseUrl + 'suggestgroup/' + userName).then(res => {
            setSuggestGroup(res.data);
        })
    }, [])

    function queryPublicGroups(publicGroupOrder) {
        axios.get(baseUrl + 'public/' + userName + "/" + publicGroupOrder).then(res => {
            setPublicGroup([])
            setPublicGroupTopics([])
            for (var i = 0; i < res.data.length; i++) {
                setPublicGroup(old => [...old, res.data[i].group_name])
            }
            for (var i = 0; i < res.data.length; i++) {
                setPublicGroupTopics(old => [...old, res.data[i].topics])
            }         
        })
    }

    function getPublicGroupByOrder(event) {
        setPublicGroupOrder(event.target.value);
        queryPublicGroups(event.target.value);
    }

    function getPublicGroups() {
        
        return (
            <div class="box">
                <h1 className="title is-5"> Your Public Groups</h1>
                <div class="select is-info"> 
                    <select value={publicGroupOrder} onChange={getPublicGroupByOrder}>
                        <option class="dropdown-item" value="1" disabled>None</option>
                        <option class="dropdown-item" value="2">Newest Message</option>
                        <option class="dropdown-item" value="3">Number of Posts</option>
                        <option class="dropdown-item" value="4">Number of Members</option>
                    </select>
                </div>
                {publicGroup.map((group_name, i) => (
                    <div key={group_name}>
                        <div class="is-clickable"
                            onClick = {e => jumpToGroupDetailsPage(group_name, userName)}
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

    function jumpToGroupDetailsPage(group_name, userName) {
        window.location.href =
        window.location.protocol + "//" + window.location.host + "/groupDetails/" + group_name + "/" + userName;
    //    return  <Redirect to='/login'/>
    }

    function getPrivateGroups() {
        
        return (
            <div class="box">
                <h1 className="title is-5"> Private Groups</h1>
                {privateGroup.map((group_name, i) => (
                    <div key={group_name}>
                        <div class="is-clickable"
                            onClick = {e => jumpToGroupDetailsPage(group_name, userName)}
                        >
                       <p class="has-text-info">{group_name}</p>
                        <div>topics: {privateGroupTopics[i]}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    function createGroupButton() {
        console.log(groupNameToBeCreated, groupTypeToBeCreated);
        // pass two parameters: group name and group type. connect database to create a group
        axios.post(baseUrl + groupNameToBeCreated + '/' + groupTypeToBeCreated + '/' + userName, {topics:topics}).then(res => {
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
        axios.post(baseUrl + 'join/' + joinGroupName + '/' + userName).then(res => {
            // console.log(res.data)
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
        axios.post(baseUrl + 'filter/' + userName, {topics:filterTopics}).then(res => {
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

    function GroupSuggestion() {
        return (
            <div className="box"> 
                <h1 className="title is-5">Group Suggestion</h1>
                <div>
                    {suggestGroup.map((group) => {
                        return (
                            <div>
                                <label class="label"> Group Name </label>
                                <div>{group.group_name}</div>
                                <label class="label"> Group Topic </label>
                                <div>{group.topics}</div>
                                <br></br>
                                <button class="button is-info" onClick={joinPublicGroupButton}>Join</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div>
             <NavBar />
            <div class="columns">
                
                <div class="column is-one-third">
                    <h2>All Public Groups</h2>
                    {allPublicGroups.map(each => (
                        <div>
                            {each}
                            </div>
                    ))}
                    {getPublicGroups()}
                    </div>
                <div class="column is-one-third"> {getPrivateGroups()}</div>
                <div class="column is-one-third">
                    <div class="columns">
                        <div class="row">
                            <div class="column">  {filterByGroup()}</div>
                            <div class="column"> {joinPublicGroup()}</div>
                            <div class="column"> {createGroup()}</div>
                            <div class="column"> {GroupSuggestion()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupsPage;
