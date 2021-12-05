import React, {useState} from "react";
// import { useParams } from "react-router-dom";

// const getProfileInfoLab = require('../getProfileInfo');

function NavBar() {
  // const { userName } = useParams(); 
  const userName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
  const profileUrl = window.location.protocol + "//" + window.location.host + "/profile/" + userName;
  const groupsUrl = window.location.protocol + "//" + window.location.host + "/groupsPage/" + userName;


    return (
      <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <img src="/images/logo-square.jpeg"/>
                </a>
            </div>

            <div class="navbar-start">
                <a class="navbar-item">
                    ChatChat!
                </a>
            </div>

            <div class="navbar-end">
                <a class="navbar-item">
                  {userName}
                </a>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                  More
                </a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" href = {profileUrl}>
                        My Profile
                    </a>
                    <a class="navbar-item" href = {groupsUrl}>
                        My Groups
                    </a>
                </div>
        </div>

        </nav>
      </div>
    )
}

export default NavBar