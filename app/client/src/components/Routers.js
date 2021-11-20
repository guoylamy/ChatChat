import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import "../App.css";
import GroupsPage from "./GroupsPage";
import Chat from "./Chat";
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
          <Route exact path="/profile/:userName" render={userName => <Profile {...userName}/>} />
          <Route exact path="/chat/:userName/:friendName" render={(userName, friendName) => <Chat userName={userName} friendName={friendName}/>} />
        </Switch>
      </Router>
    </div>
  );
}

export default Routers;
