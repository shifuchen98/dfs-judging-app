const AV = require("leanengine");
AV.Cloud.define('updateUser', async request => {
  if (request.currentUser) {
    const roles = await request.currentUser.getRoles();
    if (roles.filter(role => role.get('name') === 'Admin').length) {
      return request.params.user
        .set('name', request.params.name)
        .set('email', request.params.email)
        .save();
    } else {
      throw new AV.Cloud.Error('You are not an admin.');
    }
  } else {
    throw new AV.Cloud.Error('You are not logged in.');
  }
});
AV.Cloud.beforeDelete('Event', request => {
  const eventJudgesQuery = new AV.Query('EventJudge');
  eventJudgesQuery
    .equalTo('event', request.object)
    .find()
    .then(eventJudges => {
      AV.Object
        .destroyAll(eventJudges)
        .then(() => {
          const eventTeamsQuery = new AV.Query('EventTeam');
          eventTeamsQuery
            .equalTo('event', request.object)
            .find()
            .then(eventTeams => {
              AV.Object.destroyAll(eventTeams);
            });
        });
    });
});
AV.Cloud.beforeDelete('EventJudge', request => {
  const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
  judgeTeamPairsQuery
    .equalTo('eventJudge', request.object)
    .find()
    .then(judgeTeamPairs => {
      AV.Object.destroyAll(judgeTeamPairs);
    });
});
AV.Cloud.beforeDelete('EventTeam', request => {
  const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
  judgeTeamPairsQuery
    .equalTo('eventTeam', request.object)
    .find()
    .then(judgeTeamPairs => {
      AV.Object.destroyAll(judgeTeamPairs);
    });
});
AV.Cloud.beforeUpdate('JudgeTeamPair', async request => {
  const originalJudgeTeamPair = AV.Object.createWithoutData('JudgeTeamPair', request.object.id);
  const judgeTeamPair = await originalJudgeTeamPair.fetch();
  if (judgeTeamPair.get('scores').length) {
    throw new AV.Cloud.Error('Team already judged by the current judge.');
  }
});
