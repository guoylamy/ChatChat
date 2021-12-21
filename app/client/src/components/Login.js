import React, { useState } from "react";
import axios from 'axios';

function Login() {
  const [userName, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:8081'
    : '';
  const baseUrl = `${domain}/api/login/`;
  function checkIfAcountExists() {
    // add expiresAt, if the userName is in forbidden, but the expirestime has passed, 
     console.log(sessionStorage)
    if (sessionStorage.getItem('attempt') != null && JSON.parse(sessionStorage.getItem('attempt')).forbiddenUserNames.includes(userName)) {
      var currentDate = new Date()
      var attempt = JSON.parse(sessionStorage.getItem('attempt'))
      var index
      for (var i = 0; i < attempt.userName.length; i++) {
        if (userName === attempt.userName[i]) {
          index = i
          break
        }
      }
      console.log(index, Date.parse(currentDate), Date.parse(attempt.expiresAt[index]))
      if (Date.parse(currentDate) < Date.parse(attempt.expiresAt[index])) {
        alert("You have tried 3 times. To protect your account, you can't login in 3 minutes.")
        return
      }
      else {
        // should remove it from forbidden, and set attempt as 0, expireAt time should be current time plus 3 mins
        const pos = attempt.forbiddenUserNames.indexOf(userName)
        if (pos > -1) {
          attempt.forbiddenUserNames.splice(pos, 1)
        }
        attempt.attemptTimes[index] = 0
        sessionStorage.setItem('attempt', JSON.stringify(attempt))
      }
    }
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
        console.log(window.location.protocol + "//" + window.location.host + "/groupsPage/" + userName);
        window.location.href =
        window.location.protocol + "//" + window.location.host + "/groupsPage/" + userName;
      }
      else {
        axios.get(baseUrl + userName).then(res => {
       if (res.data.length === 1) {
         var attempt = JSON.parse(sessionStorage.getItem('attempt'))
         if (attempt == null) {
          attempt = {
            forbiddenUserNames:[],
            userName:[userName],
            attemptTimes:[1],
            expiresAt:[-1]
          }
          sessionStorage.setItem('attempt', JSON.stringify(attempt))
         }
         // if sessionStorage contains attempt
         else {
        
           if (attempt.userName.includes(userName)) {
            for (var i = 0; i < attempt.userName.length; i++) {
              if (userName === attempt.userName[i]) {
                if (attempt.attemptTimes[i] === 3) {
                  attempt.forbiddenUserNames.push(userName)
                  var tmpObj = new Date()
                  tmpObj.setTime(tmpObj.getTime() + (3 * 60 * 1000));
                  attempt.expiresAt[i] = tmpObj
                  alert("You have tried 3 times. To protect your account, you can't login in 3 minutes.")
                  sessionStorage.setItem('attempt', JSON.stringify(attempt))
                  return 
                }
                else {
                  // console.log('sdafasfd')
                    attempt.attemptTimes[i] = attempt.attemptTimes[i] + 1
                    sessionStorage.setItem('attempt', JSON.stringify(attempt))
                }
              }
            }
           }
           else {
            attempt.userName.push(userName)
            attempt.attemptTimes.push(1)
            attempt.expiresAt.push(-1)
            sessionStorage.setItem('attempt', JSON.stringify(attempt))
           }
          }
          alert("Password is not right! You only have 3 chances to try! Be careful!")
        }
        else {
          alert("Username doesn't exist!")
        }
    })
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
                <input id='NameInput' type="text" name="userName" placeholder="e.g. user123" onChange={handleUsername} value={userName}></input>
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input type="text" id='pwdInput' name="password" placeholder="********" onChange={handlePassword} value={password}></input>
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
        <a id = 'registerButton'
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
