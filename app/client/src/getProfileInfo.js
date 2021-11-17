const getUserGroups = async (userName) => {
  return ["Group0", "Group1"];
};

const getFriendList = async (userName) => {
  return ["Gretchen", "Brandon", "Marcus"];
};

const getUserData = async (userName) => {
  return {userId: "12345", userName: "user1", country: "US", age: 20};
};

module.exports = {
  getUserGroups, getFriendList, getUserData
};
  