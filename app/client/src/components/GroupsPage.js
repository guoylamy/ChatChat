import React from "react"
import {useParams} from "react-router-dom"
function GroupsPage() {
    const {username} = useParams()
    let group_data = {"public_group" : ["Dua Lipa fans group", "Ed sheeran fans group"], "private_group" : ["cis557 project team", "cis521 team"],}
    let topic_data = {"Dua Lipa fans group" : ['pop'], "Ed sheeran fans group" : ["beautiful people"], 
                       "cis557 project team" : ['api'], "cis521 team":['robot']}
    function getPublicGroups() {
        let public_group = group_data.public_group

        return (
            <div>
                <h1>
                    Public Groups
                </h1>
                {public_group.map((group_name) => (
                    <div>
                        <div>{group_name}</div>
                        <div>topics : {topic_data[group_name]}</div>
                        <button>Delete</button>
                    </div>
                    
                ))}
            </div>
        )
    }

    function getPrivateGroups() {
        let private_group = group_data.private_group
        return (
            <div>
                <h1>
                    Private Groups
                </h1>
                {private_group.map((group_name) => (
                    <div>
                        <div>{group_name}</div>
                        <div>topics: {topic_data[group_name]}</div>
                        <button>Delete</button>
                    </div>
                    
                ))}
            </div>
        )
    }
    function createGroup() {
        return (
            <div> 
                <h1>Create Your Group</h1>
                <div>Group Name <input type="text"></input></div>
                <div>Group Type</div>
                <select>
                    <option>Private</option>
                    <option>Public</option>
                </select>
                <button>create</button>
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
    return (

        <div>
            <div>nav bar</div>
            {getPublicGroups()}
            {getPrivateGroups()}
            {createGroup()}
            {joinPublicGroup()}
        </div>
    )
}

export default GroupsPage