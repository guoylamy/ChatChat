import axios from "axios";
import React, { useState } from "react";
function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? 'http://localhost:8081'
  : '';
  const baseUrl = `${domain}/register/`;
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
        window.location.protocol + "//" + window.location.host;
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
      <br></br>
      <h2 className="title is-3">Register</h2>
      <div className="columns is-centered">
        <div class="column is-one-quarter">
          <div className="box">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input id="registerInput"
                    type="text"
                    name="username"
                    placeholder="Please enter a valid username"
                    onChange={handleUsername}
                  ></input>
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input id='pwdInput' type="text" name="password" placeholder="********" onChange={handlePassword}></input>
              </div>
            </div>
            <input id="createButton" class="button is-primary" type="button" onClick={handleSubmit} value="Create Account"></input>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
