import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import "../App.css";
import GroupsPage from "./GroupsPage";
import Chat from "./Chat";
import GroupDetails from "./GroupDetails";
import ManageGroupMembers from './ManageGroupMembers'
import PostDetails from "./PostDetails";
function Routers() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Login />} />
          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/register" render={() => <Register />} />
          <Route exact path="/profile" render={() => <Profile />} />
          <Route exact path="/groupsPage/:username" render={() => <GroupsPage />} />
          {/* <Route exact path="/profile/:userId" render={userId => <Profile {...userId}/>} /> */}
          {/* probably need more params to pass, such as username and password*/}
          <Route exact path="/groupDetails/:groupName/:username" render={groupName => <GroupDetails />}/>
          <Route exact path="/postDetails/:postId" render={postId => <PostDetails />}/>

          <Route exact path="/manageGroupMembers" render={groupName => <ManageGroupMembers />}/>
          <Route exact path="/profile/:userName" render={userName => <Profile {...userName}/>} />
          <Route exact path="/chat/:userName/:friendName" render={(userName, friendName) => <Chat userName={userName} friendName={friendName}/>} />
        </Switch>
      </Router>
    </div>
  );
}

export default Routers;
