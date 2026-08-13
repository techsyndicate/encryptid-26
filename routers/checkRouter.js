const router = require("express").Router(),
  Challenge = require("../schemas/challengeSchema"),
  User = require("../schemas/userSchema");

router.post("/:id", async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { answer } = req.body;
    const foundChallenge = await Challenge.findOne({ challengeId: id });
    const userLogs = user.logs;
    if (!foundChallenge)
      return res.json({ success: false, message: "No such challenge!" });
    if (foundChallenge.solvers.includes(user.name)) {
      return res.json({ success: false, message: "Already answered!" });
    }
    const foundAnswer = foundChallenge.answer;
    const newDate = new Date();
    if (answer !== foundAnswer) {
      userLogs.push({
        challenge: foundChallenge.title,
        attempt: answer,
        correct: false,
        time: newDate.toLocaleString("en-IN", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        }),
        unixTime: Number(newDate),
        user: user.name,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $set: {
          logs: userLogs,
        },
      });
      return res.json({ success: false, message: "Wrong answer!" });
    } else {
      const points = user.points + foundChallenge.points;
      const solves = user.solves;
      var lockedLevels = user.unlockedLevels;
      const crypticSolves = [];
      for (let m = 0; m < solves.length; m++) {
        if (solves[m].includes("Level ")) {
          crypticSolves.push(solves[m]);
        }
      }
      // if (crypticSolves.length == 5 && foundChallenge.challengeId == 'level5cryptic') {
      //     lockedLevels = []
      // }
      // else if ((crypticSolves.includes('Level 3') && foundChallenge.challengeId == 'level4cryptic') || (crypticSolves.includes('Level 4') && foundChallenge.challengeId == 'level3cryptic')) {
      //     lockedLevels = ['level6cryptic']
      // }
      // else if ((crypticSolves.includes('Level 1') && foundChallenge.challengeId == 'level2cryptic') || (crypticSolves.includes('Level 2') && foundChallenge.challengeId == 'level1cryptic')) {
      //     lockedLevels = ['level5cryptic', 'level6cryptic']
      // }
      // else if (foundChallenge.challengeId == 'level0cryptic') {
      //     lockedLevels = ['level4cryptic', 'level5cryptic', 'level6cryptic']
      // }

      switch (foundChallenge.challengeId) {
        case "level0cryptic":
          lockedLevels = [
            "level2cryptic",
            "level3cryptic",
            "level4cryptic",
            "level5cryptic",
            "level6cryptic",
            "level7cryptic",
          ];
          break;
        case "level1cryptic":
          lockedLevels = [
            "level3cryptic",
            "level4cryptic",
            "level5cryptic",
            "level6cryptic",
            "level7cryptic",
          ];
          break;
        case "level2cryptic":
          lockedLevels = [
            "level4cryptic",
            "level5cryptic",
            "level6cryptic",
            "level7cryptic",
          ];
          break;
        case "level3cryptic":
          lockedLevels = ["level5cryptic", "level6cryptic", "level7cryptic"];
          break;
        case "level4cryptic":
          lockedLevels = ["level6cryptic", "level7cryptic"];
          break;
        case "level5cryptic":
          lockedLevels = ["level7cryptic"];
          break;
        case "level6cryptic":
          lockedLevels = [];
          break;
      }
      if (user.lockedLevels.includes(foundChallenge.challengeId)) {
        return res.json({ success: false, message: "This level is locked!" });
      }
      var challSolves = foundChallenge.solves,
        challSolvers = foundChallenge.solvers;
      challSolves += 1;
      challSolvers.push(user.name);
      solves.push(foundChallenge.title);
      userLogs.push({
        challenge: foundChallenge.title,
        attempt: answer,
        correct: true,
        time: newDate.toLocaleString("en-IN", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        }),
        unixTime: Number(newDate),
        user: user.name,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $set: {
          logs: userLogs,
          lastAnswered: Number(newDate),
          points: points,
          solves: solves,
          lockedLevels: lockedLevels,
        },
      });
      await Challenge.findByIdAndUpdate(foundChallenge.id, {
        solves: challSolves,
        solvers: challSolvers,
      });
      return res.json({ success: true, message: "Correct!" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
