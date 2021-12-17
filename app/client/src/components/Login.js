import React, { useState } from "react";
import GroupsPage from './GroupsPage';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

function Login() {
  const [userName, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const baseUrl = 'http://localhost:8081/login/'
  function checkIfAcountExists() {
    //should use userName and password to get record
    axios.get(baseUrl + userName + '/' + password).then(res => {
      if (res.data.length === 1) {
        var oldDateObj = new Date();
        var newDateObj = new Date();
        newDateObj.setTime(oldDateObj.getTime() + (60 * 60 * 1000));
        var sessionObject = {
          expiresAt:newDateObj,
          userName:userName,
          password:password
        }
        sessionStorage.setItem('sessionObject', JSON.stringify(sessionObject))
        window.location.href =
        window.location.protocol + "//" + window.location.host + "/groupsPage/" + userName;
      }
      else {
        alert("user doesn't exist or password is not right!")
      }
    })
  }
  function handleUsername(event) {
    setUsername(event.target.value); 
  }

  function handlePassword(event) {
    setPassword(event.target.value);
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
                <input type="text" name="userName" placeholder="e.g. user123" onChange={handleUsername} value={userName}></input>
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input type="text" name="password" placeholder="********" onChange={handlePassword} value={password}></input>
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
