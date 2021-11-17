import { useParams } from "react-router-dom";

const getProfileInfoLab = require('../getProfileInfo');

function Profile() {
  const { userName } = useParams();

  async function UserGroupBox() {
    let userGroupList;
    try {
      userGroupList = await getProfileInfoLab.getUserGroups(userName);
    } catch (error) {
      return;
    }
    const userGroupDiv = document.getElementById('group-list');
    for (let i = 0; i < userGroupList.length; i += 1) {
      const groupItem = document.createElement(`li`);
      groupItem.setAttribute('id', `groupItem${i}`);
      groupItem.setAttribute('className', 'group-item');
      groupItem.innerHTML = userGroupList[i];
      userGroupDiv.appendChild(groupItem);
    }
  }

  async function FriendsBox() {
    let userFriendList;
    try {
      userFriendList = await getProfileInfoLab.getFriendList(userName);
    } catch (error) {
      return;
    }
    const userFriendDiv = document.getElementById('friend-list');
    for (let i = 0; i < userFriendList.length; i += 1) {
      const friendItem = document.createElement(`li`);
      friendItem.setAttribute('id', `friendItem${i}`);
      friendItem.setAttribute('className', 'friend-item');
      friendItem.innerHTML = userFriendList[i];
      userFriendDiv.appendChild(friendItem);
    }
  }

  async function UserInfoBox() {
    let userInfo;
    try {
      userInfo = await getProfileInfoLab.getUserData(userName);
    } catch (error) {
      return;
    }
    const userCountry = userInfo.country;
    const userAge = userInfo.age;
    const userInfoDiv = document.getElementById('UserinfoBox');
    const userInfoElement = document.createElement(`dl`);
    userInfoElement.setAttribute('id', "user-info");
    const userNameTitle = document.createElement(`dt`);
    userNameTitle.innerHTML = "Name";
    userInfoElement.appendChild(userNameTitle);
    const userNameContent = document.createElement(`dd`);
    userNameContent.setAttribute('data-testid', "user-name");
    userNameContent.innerHTML = userName;
    userInfoElement.appendChild(userNameContent);
    const contryTitle = document.createElement(`dt`);
    contryTitle.innerHTML = "Country";
    userInfoElement.appendChild(contryTitle);
    const countryContent = document.createElement(`dd`);
    countryContent.setAttribute('data-testid', "user-country");
    countryContent.innerHTML = userCountry;
    userInfoElement.appendChild(countryContent);
    const ageTitle = document.createElement(`dt`);
    ageTitle.innerHTML = "Age";
    userInfoElement.appendChild(ageTitle);
    const ageContent = document.createElement(`dd`);
    ageContent.setAttribute('data-testid', "user-age");
    ageContent.innerHTML = userAge;
    userInfoElement.appendChild(ageContent);
    userInfoDiv.appendChild(userInfoElement);
  }

  window.onload = function(){
    UserGroupBox();
    FriendsBox();
    UserInfoBox();
  }
  
  return (
    <div>
      <h1 className="chatchat-h1">chatchat!</h1>
      <h2 data-testid="page-title">
        My Profile
      </h2>
      <div className="page-content">
        <div id="profile-group">
          <h2 className="component-title">
            My Groups
          </h2>
          <ul data-testid="group-list" id="group-list">
          </ul>
        </div>
        <div id="profile-Friends">
          <h2 className="component-title">
            My Friends
          </h2>
          <ul data-testid="friend-list" id="friend-list">
          </ul>
        </div>
        <div id="profile-info">
          <h2 className="component-title">
            About Me
          </h2>
          <div id="UserinfoBox">
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
