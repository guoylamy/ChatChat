import { useParams } from "react-router-dom";

function Profile() {
  const { userId } = useParams();

  function UserGroupBox() {
    const userGroupList = ["Group0", "Group1"];
    const userGroupDiv = document.getElementById('group-list');
    for (let i = 0; i < userGroupList.length; i += 1) {
      const groupItem = document.createElement(`li`);
      groupItem.setAttribute('id', `groupItem${i}`);
      groupItem.setAttribute('className', 'group-item');
      groupItem.innerHTML = userGroupList[i];
      userGroupDiv.appendChild(groupItem);
    }
  }

  function FriendsBox() {
    const userFriendList = ["Gretchen", "Brandon", "Marcus"];
    const userFriendDiv = document.getElementById('friend-list');
    for (let i = 0; i < userFriendList.length; i += 1) {
      const friendItem = document.createElement(`li`);
      friendItem.setAttribute('id', `friendItem${i}`);
      friendItem.setAttribute('className', 'friend-item');
      friendItem.innerHTML = userFriendList[i];
      userFriendDiv.appendChild(friendItem);
    }
  }

  function UserInfoBox() {
    const userName = 'user1';
    const userCountry = 'US';
    const userAge = 20;
    return (
      <dl id="user-info">
        <dt>
          Name
        </dt>
        <dd id="user-name">
          {userName}
        </dd>
        <dt>
          Country
        </dt>
        <dd id="user-country">
          {userCountry}
        </dd>
        <dt>
          Age
        </dt>
        <dd id="user-age">
          {userAge}
        </dd>
      </dl>
    )
  }

  window.onload = function(){
    UserGroupBox();
    FriendsBox();
  }
  
  return (
    <div>
      <h1 className="chatchat-h1">chatchat</h1>
      <h2 className="page-title">
        My Profile
      </h2>
      <div className="page-content">
        <div id="profile-group">
          <h2 className="component-title">
            My Groups
          </h2>
          <ul id="group-list">
          </ul>
        </div>
        <div id="profile-Friends">
          <h2 className="component-title">
            My Friends
          </h2>
          <ul id="friend-list">
          </ul>
        </div>
        <div id="profile-info">
          <h2 className="component-title">
            About Me
          </h2>
          <div className="UserinfoBox"><UserInfoBox /></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
