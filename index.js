const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
var multer = require('multer');
const path = require('path');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,  
  },
});
const port = process.env.PORT || 8081;
app.use(cors({ credentials: true, origin: "http://localhost:" + port }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './app/client/build')));
// /usr/local/mysql/bin/mysql -u admin -h database-557project.cxzfj2bee5gh.us-east-2.rds.amazonaws.com cis557 -p

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:" + port,
    method: ["GET", "POST"],
  }
});

io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    // console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    // console.log(`message in group: ${data}`);
    socket.to(data).emit("receive_message", data);
  })

  socket.on("disconnect", () => {
    // console.log("User Disconnected", socket.id);
  })
})

// /usr/local/mysql/bin/mysql -u admin -pcis557team12 -h database-557project.cxzfj2bee5gh.us-east-2.rds.amazonaws.com ccis557
/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get("/register/:userName/:password", routes.register)
app.get("/login/:userName/:password", routes.verifyLogin);
app.get("/login/:userName", routes.ifUserNameExists);

// profile page api
app.get("/profile/getmygroups/:userName", routes.getMyGroups);
app.get("/profile/getRegsiterDate/:userName", routes.getRegsiterDate);
app.post("/profile/changePassword/:userName/:password", routes.changePassword);
app.get("/profile/getGroupsInvitations/:userName", routes.getGroupsInvitations);
app.post("/profile/acceptInvitation/:userName/:groupId", routes.acceptInvitation)
app.post("/profile/declineInvitation/:userName/:groupId", routes.declineInvitation)
app.get("/profile/getAdminGroupsIds/:userName", routes.getAdminGroupsIds);
app.get("/profile/getPublicGroupsRequestsIds/:userName", routes.getPublicGroupsRequestsIds);
app.post("/profile/approveRequest/:userId/:groupId", routes.approveRequest);
app.post("/profile/declineRequest/:userId/:groupId", routes.declineRequest);
app.post("/profile/approvePublicRequest/:userId/:groupId", routes.approvePublicRequest);
app.post("/profile/declinePublicRequest/:userId/:groupId", routes.declinePublicRequest);
app.get("/profile/getNotifications/:userName", routes.getNotifications);
app.delete("/profile/resolveNotification/:userId/:groupId", routes.resolveNotification);
app.post("/profile/uploadavatar/:userName", upload.single('fileUpload'), routes.uploadAvatar);
app.get("/profile/getavatar/:userName", routes.getAvatar);
app.delete("/profile/deleteavatar/:userName", routes.deleteAvatar);
app.delete("/profile/deleteAccount/:userName", routes.deleteAccount)

// group page api
app.get("/grouppage/public/:userName/:order", routes.getPublicGroups)
app.get("/grouppage/private/:userName", routes.getPrivateGroups)
app.delete("/grouppage/public/:userName", routes.deletePublicGroups)
app.delete("/grouppage/private/:userName", routes.deletePrivateGroups)
app.post("/grouppage/join/:groupname/:userName", routes.joinPublicGroup)
app.post("/grouppage/filter/:userName", routes.filterByTopics)
app.post("/grouppage/:groupname/:grouptype/:userName", routes.createGroup)
// app.get("/grouppage/filter/:userName", routes)
app.get("/grouppage/suggestgroup/:userName", routes.suggestgroup);
app.get("/grouppage/getAllPublicGroups", routes.getAllPublicGroups);

// group details api
app.get("/groupDetails/topics/:groupName", routes.getGroupDetailsTopics)
app.get("/groupDetails/allpostsids/:groupName", routes.getGroupDetailsAllPostsIds)
app.get("/groupDetails/getCreatorName/:groupName", routes.getCreatorName)
app.get("/groupDetails/getAdminsNames/:groupName", routes.getAdminsNames)
app.get("/groupDetails/getNormalUsersNames/:groupName", routes.getNormalUsersNames)
app.get("/groupDetails/getUserId/:userName", routes.getGroupDetailsUserId)
app.get("/groupDetails/getGroupId/:groupName", routes.getGroupDetailsGroupId)
app.get("/groupDetails/getHidePostIds/:userName", routes.getHidePostIds)
app.post("/groupDetails/getPostsIdsByHashTags", routes.getPostsIdsByHashTags)

// post api
app.get("/post/:postId", routes.getPostInfo)
app.delete("/post/deletePost/:postId", routes.deletePost)
app.get("/post/findUserId/:userName", routes.getPostUserId)
app.post("/post/hidePost", routes.hidePost)
app.get("/post/getGroupId/:postId", routes.getGroupId)
app.get("/post/getAdminsList/:groupId", routes.getAdminsList)
app.get("/post/getFlagValue/:postId", routes.getFlagValue)
app.post("/post/updateFlagStatus/:postId/:flag", routes.updateFlagStatus)

// postDetails api
app.get("/postDetails/:postId", routes.getPostDetails)
app.get("/postDetails/allCommentsIds/:postId", routes.getPostDetailsAllCommentsIds)
app.get("/postDetails/getUserId/:userName", routes.getPostDetailsGetUserId)
app.post("/postDetails/makeComment", routes.getPostDetailsMakeComment)
app.get("/postDetails/attachments/:postId", routes.getPostAttachmentDetails);
app.post("/postDetails/getCommentsIdsByHashTags", routes.getCommentsIdsByHashTags);

// comment api
app.get("/comment/:commentId", routes.getCommentInfo)
app.get("/comment/getCreatorName/:creatorId", routes.getCommentCreatorName)
app.delete("/comment/deleteComment/:commentId", routes.deleteComment)
app.post("/comment/editComment", routes.editComment)

// manageGroupMembers api
app.post("/manageGroupMembers/addAdmin", routes.addAdmin)
app.post("/manageGroupMembers/removeAdmin", routes.removeAdmin)
app.post("/manageGroupMembers/inviteUser", routes.inviteUser)
app.post("/manageGroupMembers/leaveGroup", routes.leaveGroup)

// NewPost api
app.get("/newPost/:creatorId/:groupId", routes.getNewPostCreatorNameAndGroupName)


app.post("/sendfile/:group_id/:timestamp/:sender/:type/:receiver", upload.single('fileUpload'), routes.sendFile);
app.post("/sendmessage", routes.sendMessage);
app.get("/receivemessage/:group_id", routes.receiveMessage);
app.post("/postmessage", routes.postMessage);
app.post("/postfile/:post_id/:type", upload.single('fileUpload'), routes.postFile);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './app/client/build/index.html'));
});
// Default response for any other request
app.use((req, res) => {
  res.status(404);
});
server.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});

module.exports = app;
