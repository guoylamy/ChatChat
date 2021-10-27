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
      <h1>register</h1>
      <div>
        <div>
          username{" "}
          <input
            type="text"
            name="username"
            placeholder="Please enter a valid username"
            onChange={handleUsername}
          ></input>
        </div>
        <div>
          password{" "}
          <input type="text" name="password" onChange={handlePassword}></input>
        </div>
        <input type="button" onClick={handleSubmit} value="submit"></input>
      </div>
    </div>
  );
}

export default Register;
