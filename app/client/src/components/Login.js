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
      <h1>login</h1>
      <div>
        username{" "}
        <input type="text" name="username" onChange={handleUsername}></input>
      </div>
      <div>
        password{" "}
        <input type="text" name="password" onChange={handlePassword}></input>
      </div>
      <div>
        <input
          type="button"
          value="submit"
          onClick={checkIfAcountExists}
        ></input>
      </div>
      <div>
        If you don't a account, please register here :{" "}
        <a
          href={
            window.location.protocol + "//" + window.location.host + "/register"
          }
        >
          Sign in
        </a>
      </div>
    </div>
  );
}
export default Login;
