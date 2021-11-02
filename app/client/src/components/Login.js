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
