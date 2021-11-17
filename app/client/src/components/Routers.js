import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import "../App.css";
import GroupsPage from "./GroupsPage";
import GroupDetails from "./GroupDetails";
import ManageGroupMembers from './ManageGroupMembers'
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
          <Route exact path="/profile/:userId" render={userId => <Profile {...userId}/>} />
          {/* probably need more params to pass, such as username and password*/}
          <Route exact path="/groupDetails/:groupName" render={groupName => <GroupDetails />}/>
          <Route exact path="/manageGroupMembers" render={groupName => <ManageGroupMembers />}/>
        </Switch>
      </Router>
    </div>
  );
}

export default Routers;
