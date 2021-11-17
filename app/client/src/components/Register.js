import axios from "axios";
import React, { useState } from "react";
function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const baseUrl = 'http://localhost:8081/register/'
  function handleSubmit() {
    // detect if username is valid
    if (/^[a-zA-Z0-9]+$/.test(username) === false) {
      alert("User name is not alphanumeric");
    }
    // detect if password is valid
    else if (/^[a-zA-Z0-9]+$/.test(password) === false) {
      alert("Password is not alphanumeric");
    }
    // pass it to the backend
    else {
      axios.get(baseUrl + username + '/' + password).then(res => {
        console.log(res.data)
        if (res.data.length === 1) {
          alert("Username already exists!");
        }
        else {
          window.location.href =
        window.location.protocol + "//" + window.location.host + "/profile";
        }
      })
      
    }
  }
  function handleUsername(event) {
    setUsername(event.target.value)
  }
  function handlePassword(event) {
    setPassword(event.target.value)
  }
  return (
    <div>
      <h1 className="chatchat-h1">chatchat!</h1>
      <h2 className="login-h2">Register</h2>
      <div className="login-div">
        <div>
          Username{" "}
          <input
            type="text"
            name="username"
            placeholder="Please enter a valid username"å
            onChange={handleUsername}
          ></input>
        </div>
        <div>
          Password{" "}
          <input type="text" name="password" onChange={handlePassword}></input>
        </div>
        <input type="button" onClick={handleSubmit} value="Create Account"></input>
      </div>
    </div>
  );
}

export default Register;
