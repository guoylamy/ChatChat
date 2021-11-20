import React, { useState } from "react";
import GroupsPage from './GroupsPage';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  function checkIfAcountExists() {
    //should use username and password to get record
    if (username.username === '123') {
      window.location.href =
        window.location.protocol + "//" + window.location.host + "/groupsPage/" + username.username;
      
    }
    else {
      // if the username doesn't exist or password is right, should prompt warning
      alert("User name doesn't exist or password is not right");
    }
    
  }
  function handleUsername(event) {
    setUsername({
      username: event.target.value,
    }); 
  }

  function handlePassword(event) {
    setPassword({
      password: event.target.value,
    });
  }

  return (
    <div>
      <h1 className="chatchat-h1">chatchat!</h1>
      <br></br>
      <h2 className="title is-3">Login</h2>
      <div className="columns is-centered">
        <div class="column is-one-quarter">
          <div className="box">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input type="text" name="username" placeholder="e.g. user123" onChange={handleUsername}></input>
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input type="text" name="password" placeholder="********" onChange={handlePassword}></input>
              </div>
            </div>
            <div>
              <input
                class="button is-primary"
                type="button"
                value="Sign in"
                id="sign"
                onClick={checkIfAcountExists}
              ></input>
            </div>
          </div>
        </div>
      </div>
      <div className="login-redirect">
        Not a member? {" "}
        <a
          href={
            window.location.protocol + "//" + window.location.host + "/register"
          }
        >
          Register here
        </a>
      </div>
    </div>
  );
}
export default Login;
