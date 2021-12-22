import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import "../App.css";
import GroupsPage from "./GroupsPage";
import Chat from "./Chat";
import NewPost from "./NewPost";
import GroupDetails from "./GroupDetails";
import ManageGroupMembers from './ManageGroupMembers'
import PostDetails from "./PostDetails";
function Routers() {
  var currentDate = new Date()
  var sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'))
  if (sessionObject == null ) {
    return (
      <Router>
        <Switch>
          
          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/register" render={() => <Register />} />
          <Route exact path="/*" render={() => <Login />} />
        </Switch>
      </Router>
    )
  }
  // console.log(sessionObject)
  var expirationDate = sessionObject.expiresAt

  if (Date.parse(currentDate) < Date.parse(expirationDate)) {
    return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Login />} />
          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/register" render={() => <Register />} />
          <Route exact path="/profile" render={() => <Profile />} />
          <Route exact path="/groupsPage/:userName" render={() => <GroupsPage />} />
          {/* <Route exact path="/profile/:userId" render={userId => <Profile {...userId}/>} /> */}
          {/* probably need more params to pass, such as userName and password*/}
          <Route exact path="/groupDetails/:groupName/:userName" render={groupName => <GroupDetails />}/>
          <Route exact path="/postDetails/:postId" render={postId => <PostDetails />}/>

          <Route exact path="/manageGroupMembers/:groupName" render={groupName => <ManageGroupMembers />}/>
          <Route exact path="/profile/:userName" render={userName => <Profile {...userName}/>} />
          <Route exact path="/chat/:userName/:friendName" render={(userName, friendName) => <Chat userName={userName} friendName={friendName}/>} />
          <Route exact path="/post/:creator_id/:group_id" render={(creator_id, group_id) => <NewPost creator_id={creator_id} group_id={group_id} />} />
        </Switch>
      </Router>
    </div>
  );
  }
  else {
    sessionStorage.removeItem('sessionObject')
    return (
      <div>
        <Login />
      </div>
    )
  }
  
}

export default Routers;
