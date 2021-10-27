import React, { useState } from "react";
function Login() {
  const [allValues, setAllValues] = useState({
    username: "",
    password: "",
  });
  function checkIfAcountExists() {
    // check the backend
    if (true) {
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
        ></a>
      </div>
    </div>
  );
}
export default Login;
