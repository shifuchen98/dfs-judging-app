const AV = require("leanengine");
AV.Cloud.define("updateUser", async request => {
  if (request.currentUser) {
    const roles = await request.currentUser.getRoles();
    if (roles.filter(role => role.get("name") === "Admin").length) {
      return request.params.user
        .set("name", request.params.name)
        .set("email", request.params.email.toLowerCase())
        .save();
    } else {
      throw new AV.Cloud.Error("You are not an admin.");
    }
  } else {
    throw new AV.Cloud.Error("You are not logged in.");
  }
});
AV.Cloud.beforeDelete("Event", request => {
  const eventJudgesQuery = new AV.Query("EventJudge");
  eventJudgesQuery
    .equalTo("event", request.object)
    .limit(1000)
    .find()
    .then(eventJudges => {
      const eventTeamsQuery = new AV.Query("EventTeam");
      eventTeamsQuery
        .equalTo("event", request.object)
        .limit(1000)
        .find()
        .then(eventTeams => {
          AV.Object.destroyAll([...eventJudges, ...eventTeams]);
        });
    });
});
AV.Cloud.beforeDelete("EventJudge", request => {
  const judgeTeamPairsQuery = new AV.Query("JudgeTeamPair");
  judgeTeamPairsQuery
    .equalTo("eventJudge", request.object)
    .limit(1000)
    .find()
    .then(judgeTeamPairs => {
      const presentationScoresQuery = new AV.Query("PresentationScore");
      presentationScoresQuery
        .equalTo("eventJudge", request.object)
        .limit(1000)
        .find()
        .then(presentationScores => {
          AV.Object.destroyAll([...judgeTeamPairs, ...presentationScores]);
        });
    });
});
AV.Cloud.beforeDelete("EventTeam", request => {
  const judgeTeamPairsQuery = new AV.Query("JudgeTeamPair");
  judgeTeamPairsQuery
    .equalTo("eventTeam", request.object)
    .limit(1000)
    .find()
    .then(judgeTeamPairs => {
      const presentationScoresQuery = new AV.Query("PresentationScore");
      presentationScoresQuery
        .equalTo("eventTeam", request.object)
        .limit(1000)
        .find()
        .then(presentationScores => {
          AV.Object.destroyAll([...judgeTeamPairs, ...presentationScores]);
        });
    });
});
AV.Cloud.beforeUpdate("JudgeTeamPair", async request => {
  const originalJudgeTeamPair = AV.Object.createWithoutData(
    "JudgeTeamPair",
    request.object.id
  );
  const judgeTeamPair = await originalJudgeTeamPair.fetch();
  if (judgeTeamPair.get("scores").length) {
    throw new AV.Cloud.Error("Team already judged by the current judge.");
  }
});
AV.Cloud.beforeUpdate("PresentationScore", async request => {
  const originalPresentationScore = AV.Object.createWithoutData(
    "PresentationScore",
    request.object.id
  );
  const presentationScore = await originalPresentationScore.fetch();
  if (presentationScore.get("score")) {
    throw new AV.Cloud.Error(
      "Team already has a presentation score given by the current judge."
    );
  }
});
