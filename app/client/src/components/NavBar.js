import React from "react";
// import { useParams } from "react-router-dom";

// const getProfileInfoLab = require('../getProfileInfo');

function NavBar() {
  // const { userName } = useParams(); 
  const userName = JSON.parse(sessionStorage.getItem('sessionObject')).userName
  const profileUrl = window.location.protocol + "//" + window.location.host + "/profile/" + userName;
  const groupsUrl = window.location.protocol + "//" + window.location.host + "/groupsPage/" + userName;
  const logOutUrl = window.location.protocol + "//" + window.location.host

    return (
      <div>
        <nav class="navbar" id="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href={profileUrl}>
                    <img src="/images/logo-square.jpeg" alt="cannot load"/>
                </a>
            </div>

            <div class="navbar-start">
                <a class="navbar-item" href={profileUrl}>
                    ChatChat!
                </a>
            </div>

            <div class="navbar-end">
                <a class="navbar-item" href={profileUrl}>
                  {userName}
                </a>
            

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" href={profileUrl}>
                  More
                </a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" href = {profileUrl}>
                        My Profile
                    </a>
                    <a class="navbar-item" href = {groupsUrl}>
                        My Groups
                    </a>
                    <a class="navbar-item" href = {logOutUrl}>
                        Log Out
                    </a>
                </div>
        </div>
        </div>

        </nav>
      </div>
    )
}

export default NavBar