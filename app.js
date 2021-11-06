const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
const DbPath = path.join(__dirname, "cricketTeam.db");
let Dbobj = null;

const startDbobjandserver = async () => {
  try {
    Dbobj = await open({
      filename: DbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB error: ${error.message}`);
    process.exit(1);
  }
};
startDbobjandserver();
//list of all players in the team
app.get("/players/", async (Request, Response) => {
  const DbQuery = `SELECT * FROM cricket_team;`;
  const dbresponce = await Dbobj.all(DbQuery);
  Response.send(dbresponce);
});

//Creates a new player in the team

app.post("/players/", async (Request, Response) => {
  const RequestBody = Request.body;
  const { playerName, jerseyNumber, role } = RequestBody;
  const DBquery = `INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      ('${playerName}',${jerseyNumber},'${role}');`;
  const DBresponce = await Dbobj.run(DBquery);
  Response.send("Player Added to Team");
});

//Returns a player based on a player ID

app.get("/players/:playerId/", async (Request, Response) => {
  const { playerId } = Request.params;
  const DbQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const dbresponce = await Dbobj.get(DbQuery);
  Response.send(dbresponce);
});

//Updates the details of a player

app.put("/players/:playerId/", async (Request, Response) => {
  const { playerId } = Request.params;
  const RequestBody = Request.body;
  const { playerName, jerseyNumber, role } = RequestBody;

  const DBquery = `
UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role='${role}'
      WHERE player_id=${playerId};`;
  const DBresponce = await Dbobj.run(DBquery);
  Response.send("Player Details Updated");
});

//Deletes a player from the team
app.delete("/players/:playerId/", async (Request, Response) => {
  const { playerId } = Request.params;
  const DbQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
  const dbresponce = await Dbobj.get(DbQuery);
  Response.send("Player Removed");
});
