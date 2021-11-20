import React, {useState} from "react"
import NavBar from './NavBar'
import { useParams } from "react-router-dom";
function GroupDetails() {
    const {groupName} = useParams()
    const message1 = [{'sender':"Kinna", 'message':"This is a message I wanna share with u guys", 'comments':[{'sender':'Tom', 'comment':"cool!!!!!"}]}, {'sender':"Talan", 'message':"They are so cute", 'comments':[{'sender':'Karen', 'comment':"I love them!"}, {'sender':'Jerry', 'comment':"So cute!"}]}]
    const members = ['Tom', 'Amy', 'Martin', 'Brandon', 'Talan']
    function getTopics() {
        // need to connect to database to grab topics according to groupName
        return (
            <div>
                Topics: Travels, Pets
            </div>
        )
    }
    function getBoard() {
        return (
            <div>
                <h1>Board</h1>
                {message1.map((message) => (
                    <div>
                        <div>{message.message}</div>
                        <div>Posted by: {message.sender}</div>
                        <div>Comments:
                            {message.comments.map((comment) => (
                                <div>
                                    <div>{comment.comment}</div>
                                <div>{comment.sender}</div>
                                </div>
                            ))}
                        </div>
                        <br></br>
                        <br></br>
                    </div>
                    
                ))}
            </div>
        )
    }
    function getMembers() {
        // need to get members from database (distinguish creator, adminstrator)
        return (
            <div>
                <h1>Members</h1>
                {members.map((member) => (
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
                    <a href={window.location.protocol + "//" + window.location.host + "/manageGroupMembers"}>manage</a>
                </div>
            )
        }
    }
    return (
        <div>
            <NavBar />
            {getTopics()}
            {getBoard()}
            {getMembers()}
            {manageGroup()}
        </div>  
    )
}

export default GroupDetails