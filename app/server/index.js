const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// /usr/local/mysql/bin/mysql -u admin -pcis557team12 -h database-557project.cxzfj2bee5gh.us-east-2.rds.amazonaws.com database-557project
/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get("/register/:username/:password", routes.register)
app.get("/login/:username/:password", routes.verifyLogin);
app.get("/profile/getmygroups/:username", routes.getMyGroups);
app.get("/grouppage/:username", routes.getPublicGroups)
app.post("/grouppage/:groupname/:grouptype/:username", routes.createGroup)
app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
