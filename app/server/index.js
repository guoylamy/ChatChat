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

const connect = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "database-557project.cxzfj2bee5gh.us-east-2.rds.amazonaws.com",
      port: "3306",
      user : "admin",
      password: "cis557team12",
      database: "database-557project"
    });
      // Connected to db
    console.log(`Connected to database: ${connection.connection.config.database}`);
    return connection;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// const getChatID = async (db, userName, friendName) => {
//   const query = 'SELECT id from game_test.players (player , points) VALUES(?, ?)';
//   const params = [newPlayer.player, newPlayer.points];
//   try {
//     const [row] = await db.execute(query, params);
//     console.log(`Created player with id: ${row.insertId}`);
//   } catch (err) {
//     console.log(`error: ${err.message}`);
//   }
// };

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

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

// app.get("/user", routes.user);

server.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
