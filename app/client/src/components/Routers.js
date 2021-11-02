import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import GroupsPage from "./GroupsPage";
function Routers() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Login />} />
          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/register" render={() => <Register />} />
          <Route exact path="/profile" render={() => <Profile />} />
          <Route exact path="/groupsPage" render={() => <GroupsPage />} />
          <Route exact path="/groupsPage/:username" render={() => <GroupsPage />} />
        </Switch>
      </Router>
    </div>
  );
}

export default Routers;
