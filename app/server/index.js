const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
var multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,  
  },
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /usr/local/mysql/bin/mysql -u admin -h database-557project.cxzfj2bee5gh.us-east-2.rds.amazonaws.com cis557 -p

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data).emit("receive_message", data);
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  })
})

// /usr/local/mysql/bin/mysql -u admin -pcis557team12 -h database-557project.cxzfj2bee5gh.us-east-2.rds.amazonaws.com ccis557
/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get("/register/:userName/:password", routes.register)
app.get("/login/:userName/:password", routes.verifyLogin);

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

// group page api
app.get("/grouppage/public/:userName", routes.getPublicGroups)
app.get("/grouppage/private/:userName", routes.getPrivateGroups)
app.delete("/grouppage/public/:userName", routes.deletePublicGroups)
app.delete("/grouppage/private/:userName", routes.deletePrivateGroups)
app.post("/grouppage/join/:groupname/:userName", routes.joinPublicGroup)
app.post("/grouppage/filter/:userName", routes.filterByTopics)
app.post("/grouppage/:groupname/:grouptype/:userName", routes.createGroup)
// app.get("/grouppage/filter/:userName", routes)

// group details api
app.get("/groupDetails/topics/:groupName", routes.getGroupDetailsTopics)
app.get("/groupDetails/allpostsids/:groupName", routes.getGroupDetailsAllPostsIds)
app.get("/groupDetails/getCreatorName/:groupName", routes.getCreatorName)
app.get("/groupDetails/getAdminsNames/:groupName", routes.getAdminsNames)
app.get("/groupDetails/getNormalUsersNames/:groupName", routes.getNormalUsersNames)

// post api
app.get("/post/:postId", routes.getPostInfo)

// postDetails api
app.get("/postDetails/:postId", routes.getPostDetails)
app.get("/postDetails/allCommentsIds/:postId", routes.getPostDetailsAllCommentsIds)

// comment api
app.get("/comment/:commentId", routes.getCommentInfo)
app.get("/comment/getCreatorName/:creatorId", routes.getCommentCreatorName)

// manageGroupMembers api
app.post("/manageGroupMembers/addAdmin", routes.addAdmin)
app.post("/manageGroupMembers/removeAdmin", routes.removeAdmin)
app.post("/manageGroupMembers/inviteUser", routes.inviteUser)
app.post("/manageGroupMembers/leaveGroup", routes.leaveGroup)

app.post("/sendfile/:group_id/:timestamp/:sender/:type/:receiver", upload.single('fileUpload'), routes.sendFile);
app.post("/sendmessage", routes.sendMessage);
app.get("/receivemessage/:group_id", routes.receiveMessage);
app.post("/postmessage", routes.postMessage);
app.post("/postfile/:group_id/:timestamp/:creator_id/:type", upload.single('fileUpload'), routes.postFile);
server.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});

module.exports = app;
