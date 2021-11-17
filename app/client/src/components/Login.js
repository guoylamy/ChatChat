import React, { useState } from "react";
import GroupsPage from './GroupsPage';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const baseUrl = 'http://localhost:8081/verifyLogin/'
  function checkIfAcountExists() {
    //should use username and password to get record
    // axios.get(baseUrl + username + '/' + password.password).then(res => {
    //   if (res.data.length === 1) {
    //     window.location.href =
    //     window.location.protocol + "//" + window.location.host + "/groupsPage/" + username.username;
    //   }
    //   else {
    //     alert("user doesn't exist or password is not right!")
    //   }
    // })
    if (username === '123') {
        window.location.href =
        window.location.protocol + "//" + window.location.host + "/groupsPage/" + username.username;
      
    }
    // else {
    //   // if the username doesn't exist or password is right, should prompt warning
    //   alert("User name doesn't exist or password is not right");
    // }
    
  }
  function handleUsername(event) {
    console.log(event.target.value)
    setUsername(event.target.value); 
    console.log(username)
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <div>
      <h1 className="chatchat-h1">chatchat!</h1>
      <h2 className="login-h2">Login</h2>
      <div className="login-div">
      <div>
        Username{" "}
        <input type="text" name="username" onChange={handleUsername}></input>
      </div>
      <div>
        Password{" "}
        <input type="text" name="password" onChange={handlePassword}></input>
      </div>
      <div>
        <input
          type="button"
          value="Sign in"
          id="sign"
          onClick={checkIfAcountExists}
        ></input>
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
