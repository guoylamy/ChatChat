import React, {useState, useEffect} from "react"
import NavBar from './NavBar'
import axios from "axios";
import { useParams } from "react-router-dom";
function GroupsPage() {
    const {username} = useParams()
    const [topic, setTopic] = useState('')
    const [public_group, setPublic_group] = useState([])
    const [groupNameToBeCreated, setGroupNameToBeCreated] = useState('')
    const [groupTypeToBeCreated, setGroupTypeToBeCreated] = useState('')
    const [isLoading, setLoading] = useState(true)
    const baseUrl = 'http://localhost:8081/grouppage/'
    let group_data = {"public_group" : ["Dua Lipa fans group", "Ed sheeran fans group"], "private_group" : ["cis557 project team", "cis521 team"],}
    let topic_data = {"another" : ['pop'], "Ed sheeran fans group" : ["beautiful people"], 
                       "cis557 project team" : ['api'], "cis521 team":['robot']}
    // useEffect(() => {
      
    // })
    function getPublicGroups() {
        let public_group = group_data.public_group;
        console.log(username)
        axios.get(baseUrl + username).then(res => {
            setPublic_group([])
            for (var i = 0; i < res.data.length; i++) {
                setPublic_group(old => [...old, res.data[i].group_name])
            }
            console.log(res.data)
            setLoading(false)
        })
        return (
            <div class="box">
                <h1 className="title is-5"> Public Groups</h1>
                {public_group.map((group_name) => (
                    <div key={group_name}>
                        <div class="is-clickable"
                            onClick = {jumpToGroupDetailsPage}
                        >
                       <p class="has-text-info">{group_name}</p>
                        <div>topics: {topic_data[group_name]}</div>
                        </div>
                        <button class="button is-light" onClick={deletePublicGroups(group_name)}>Delete</button>
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
        let private_group = group_data.private_group
        return (
            <div className="box">
                <h1 className="title is-5"> Private Groups</h1>
                {private_group.map((group_name) => (
                    <div key={group_name}>
                        <div class="is-clickable"
                            onClick = {jumpToGroupDetailsPage}
                        >
                        <p class="has-text-info">{group_name}</p>
                        <div>topics: {topic_data[group_name]}</div>
                        </div>
                        <button class="button is-light" onClick={deletePrivateGroups(group_name)}>Delete</button>
                    </div>
                ))}
            </div>
        )
    }
    function createGroupButton() {
        // pass two parameters: group name and group type. connect database to create a group
        axios.post(baseUrl + groupNameToBeCreated + '/' + groupTypeToBeCreated + '/' + username).then(res => {
            console.log(res.data)
            window.location.reload(false);
        })

    }
    function createGroupGroupName(event) {
        setGroupNameToBeCreated(event.target.value)
    }
    function createGroupSelectOption(event) {
        setGroupTypeToBeCreated(event.target.value)
    }
    function createGroup() {
        return (
            <div className="box"> 
                <h1 className="title is-5">Create Your Group</h1>
                <div class="field">
                <label class="label">Group Name </label> 
                    <input type="text" value={groupNameToBeCreated} onChange={createGroupGroupName}></input>
                </div>
                <label class="label">Group Type </label> 
                <div class="select is-info"> 
                    <select onChange={createGroupSelectOption}>
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
    function joinPublicGroup(){
        return (
            <div className="box"> 
                <h1 className="title is-5">Join Public Group</h1>
                <div>
                    <label class="label"> Group Name </label>
                    <input type="text"></input>
                </div>
                <br></br>
                <button class="button is-info">Join</button>
            </div>
        )
    }
    function handleFilterChange(event) {
        setTopic(event.target.value)
    }
    function filterByGroup() {
        return (
            <div className="box">
                 <h1 className="title is-5">Filter By Topic</h1>
                <input type="text" placeholder="topic" value={topic} onChange={handleFilterChange}></input>
                <br></br>
                <br></br>
                <button class="button is-info">Submit</button>
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
