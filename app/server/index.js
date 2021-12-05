const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const http = require("http");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
    socket.to(data.room).emit("receive_message", data);
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  })
})

// /usr/local/mysql/bin/mysql -u admin -pcis557team12 -h database-557project.cxzfj2bee5gh.us-east-2.rds.amazonaws.com ccis557
/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get("/register/:username/:password", routes.register)
app.get("/login/:username/:password", routes.verifyLogin);
app.get("/profile/getmygroups/:username", routes.getMyGroups);
// group page api
app.get("/grouppage/public/:username", routes.getPublicGroups)
app.get("/grouppage/private/:username", routes.getPrivateGroups)
app.delete("/grouppage/public/:username", routes.deletePublicGroups)
app.delete("/grouppage/private/:username", routes.deletePrivateGroups)
app.get("/grouppage/join/:groupname/:username", routes.joinPublicGroup)
app.post("/grouppage/filter/:username", routes.filterByTopics)
// app.get("/grouppage/filter/:username", routes)
app.post("/grouppage/:groupname/:grouptype/:username", routes.createGroup)
server.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});