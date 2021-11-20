import React, { useState } from "react";
function Register() {
  const [allValues, setAllValues] = useState({
    username: "",
    password: "",
  });
  function handleSubmit() {
    // detect if username is valid
    if (/^[a-zA-Z0-9]+$/.test(allValues.username) === false) {
      alert("User name is not alphanumeric");
    }
    // detect if password is valid
    else if (/^[a-zA-Z0-9]+$/.test(allValues.password) === false) {
      alert("Password is not alphanumeric");
    }
    // pass it to the backend
    else {
      window.location.href =
        window.location.protocol + "//" + window.location.host + "/profile";
    }
  }
  function handleUsername(event) {
    setAllValues({
      username: event.target.value,
    });
  }
  function handlePassword(event) {
    setAllValues({
      password: event.target.value,
    });
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
                <input
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
                <input type="text" name="password" placeholder="********" onChange={handlePassword}></input>
              </div>
            </div>
            <input class="button is-primary" type="button" onClick={handleSubmit} value="Create Account"></input>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
