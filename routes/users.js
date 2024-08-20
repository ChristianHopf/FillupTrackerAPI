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
router.get("/getachievements/:steamid", async (req, res, next) => {
  try {
    const playerAchievementsResponse = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=570940&key=${process.env.API_KEY}&steamid=${req.params.steamid}`
    );
    if (!playerAchievementsResponse.ok) {
      console.error(
        `Error: Received status ${playerAchievementsResponse.status}`
      );
      return res.status(playerAchievementsResponse.status).json({
        error: true,
        message: `Failed to fetch data with status ${playerAchievementsResponse.status}`,
      });
    }
    const achievementsSchemaResponse = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=570940&key=${process.env.API_KEY}`
    );
    if (!achievementsSchemaResponse.ok) {
      console.error(
        `Error: Received status ${achievementsSchemaResponse.status}`
      );
      return res.status(achievementsSchemaResponse.status).json({
        error: true,
        message: `Failed to fetch data with status ${achievementsSchemaResponse.status}`,
      });
    }
    const achievements = await playerAchievementsResponse.json();
    const schema = await achievementsSchemaResponse.json();

    // For each achievement:
    // - if its entry in achievements is achieved
    // - build a new object with its desired schema info
    // - push to result
    result = [];
    schema.game.availableGameStats.achievements.forEach(function (
      achievement,
      index
    ) {
      let playerAchievement = achievements.playerstats.achievements[index];
      if (playerAchievement.achieved) {
        let resultAchievement = {
          name: achievement.name,
          displayName: achievement.displayName,
          description: achievement.description,
          unlocktime: playerAchievement.unlocktime,
          icon: achievement.icon,
        };
        result.push(resultAchievement);
      }
    });
    // console.log(result[1].unlocktime > result[2].unlocktime);

    // If this steamid hasn't completed any achievements, don't bother sorting
    if (result.length > 0) {
      result.sort(({ unlocktime: a }, { unlocktime: b }) => b - a);
    }

    // console.log(result);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/getprofile/:steamid", async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.API_KEY}&steamids=[${req.params.steamid}]`
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
    res.json({
      personaname: data.response.players[0].personaname,
      avatarmedium: data.response.players[0].avatarmedium,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/gethours/:steamid", async (req, res, next) => {
  try {
    // 76561198099631791
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.API_KEY}&steamid=${req.params.steamid}&include_appinfo=1&include_played_free_games=1&appids_filter[0]=570940&include_free_sub=1&language=english&include_extended_appinfo=0&format=json`
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

    // Add case where response is empty (some kind of error on Steam's side?)

    // res.json(data);
    // If the user hasn't played the game in the last 2 weeks,
    // the playtime_2weeks property is absent
    data.response.games[0].playtime_2weeks
      ? res.json({
          playtime_forever: data.response.games[0].playtime_forever,
          playtime_2weeks: data.response.games[0].playtime_2weeks,
        })
      : res.json({
          playtime_forever: data.response.games[0].playtime_forever,
          playtime_2weeks: 0,
        });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
