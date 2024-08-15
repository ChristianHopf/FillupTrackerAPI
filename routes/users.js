const express = require("express");
const router = express.Router();

// Will need:
// - API key
// - steamid (64 bit user id)
// - appid (game id)
// https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?appid=570940&key=D6563AA56822CAF6AC96C5B97018B5E9&steamid=76561198099631791
// My steamid: 76561198045534521
// Fillup steamid: 76561198099631791
// https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1
router.get("/getachievements", async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=570940&key=${process.env.API_KEY}&steamid=76561198099631791`
    );
    if (!response.ok) {
      console.error(`Error: Received status ${response.status}`);
      return res.status(response.status).json({
        error: true,
        message: `Failed to fetch data with status ${response.status}`,
      });
    }
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/getplayersummaries", async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.API_KEY}&steamids=[76561198099631791]`
    );
    if (!response.ok) {
      console.error(`Error: Received status ${response.status}`);
      return res.status(response.status).json({
        error: true,
        message: `Failed to fetch data with status ${response.status}`,
      });
    }
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/getownedgames", async (req, res, next) => {
  try {
    // 76561198099631791
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.API_KEY}&steamid=76561198099631791&include_appinfo=1&include_played_free_games=1&appids_filter[0]=570940&include_free_sub=1&language=english&include_extended_appinfo=0&format=json`
    );
    if (!response.ok) {
      console.error(`Error: Received status ${response.status}`);
      return res.status(response.status).json({
        error: true,
        message: `Failed to fetch data with status ${response.status}`,
      });
    }
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
