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
    useEffect(() => {
      
    })
    function getPublicGroups() {
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
            <div>
                <h1>
                    Public Groups {public_group}
                </h1>
                {public_group.map((group_name) => (
                    <div key={group_name}>
                        <div
                            style = {{
                                background: 'yellow',
                                width: 100,
                                height: 100,
                            }}
                            onClick = {jumpToGroupDetailsPage}
                        >
                        <div>{group_name}</div>
                        {/* <div>topics : {topic_data[group_name]}</div> */}
                        </div>
                        <button onClick={deletePublicGroups(group_name)}>Delete</button>
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
            <div>
                <h1>
                    Private Groups
                </h1>
                {private_group.map((group_name) => (
                    <div key={group_name}>
                        <div
                            style = {{
                                background: 'yellow',
                                width: 100,
                                height: 100
                            }}
                            onClick = {jumpToGroupDetailsPage}
                        >
                            <div>{group_name}</div>
                            <div>topics: {topic_data[group_name]}</div>
                        </div>
                        <button onClick={deletePrivateGroups(group_name)}>Delete</button>
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
            <div> 
                <h1>Create Your Group</h1>
                <div>Group Name <input type="text" value={groupNameToBeCreated} onChange={createGroupGroupName}></input></div>
                <div>Group Type</div>
                <select onChange={createGroupSelectOption}>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                </select>
                <button onClick={createGroupButton}>create</button>
            </div>
        )
    }
    function joinPublicGroup(){
        return (
            <div> 
                <h1>Join Public Group</h1>
                <div>Group Name <input type="text"></input></div>
                <button>Join</button>
            </div>
        )
    }
    function handleFilterChange(event) {
        setTopic(event.target.value)
    }
    function filterByGroup() {
        return (
            <div>
                filter
                <input type="text" placeholder="topic" value={topic} onChange={handleFilterChange}></input>
            </div>
        )
    }
    return (
        <div>
            <NavBar />
            {getPublicGroups()}
            {getPrivateGroups()}
            {createGroup()}
            {joinPublicGroup()}
            {filterByGroup()}
        </div>
    )
}

export default GroupsPage;