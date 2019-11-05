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
AV.Cloud.afterSave('EventJudge', request => {
  const presentationScoreACL = new AV.ACL();
  presentationScoreACL.setReadAccess(request.object.get('user'), true);
  presentationScoreACL.setWriteAccess(request.object.get('user'), true)
  presentationScoreACL.setRoleReadAccess(new AV.Role('Admin'), true);
  presentationScoreACL.setRoleWriteAccess(new AV.Role('Admin'), true);
  const eventTeamsQuery = new AV.Query('EventTeam');
  eventTeamsQuery
    .equalTo('event', request.object.get('event'))
    .find()
    .then(eventTeams => {
      AV.Object.saveAll(eventTeams.map(eventTeam => new AV.Object('PresentationScore').set('eventTeam', eventTeam).set('eventJudge', request.object).setACL(presentationScoreACL)));
    });
});
AV.Cloud.beforeDelete('EventJudge', request => {
  const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
  judgeTeamPairsQuery
    .equalTo('eventJudge', request.object)
    .find()
    .then(judgeTeamPairs => {
      const presentationScoresQuery = new AV.Query('PresentationScore');
      presentationScoresQuery
        .equalTo('eventJudge', request.object)
        .find()
        .then(presentationScores => {
          AV.Object.destroyAll([...judgeTeamPairs, ...presentationScores]);
        });
    });
});
AV.Cloud.afterSave('EventTeam', request => {
  const eventJudgesQuery = new AV.Query('EventJudge');
  eventJudgesQuery
    .equalTo('event', request.object.get('event'))
    .find()
    .then(eventJudges => {
      AV.Object.saveAll(eventJudges.map(eventJudge => {
        const presentationScoreACL = new AV.ACL();
        presentationScoreACL.setReadAccess(eventJudge.get('user'), true);
        presentationScoreACL.setWriteAccess(eventJudge.get('user'), true)
        presentationScoreACL.setRoleReadAccess(new AV.Role('Admin'), true);
        presentationScoreACL.setRoleWriteAccess(new AV.Role('Admin'), true);
        return new AV.Object('PresentationScore')
          .set('eventJudge', eventJudge)
          .set('eventTeam', request.object)
          .setACL(presentationScoreACL);
      }));
    });
});
AV.Cloud.beforeDelete('EventTeam', request => {
  const judgeTeamPairsQuery = new AV.Query('JudgeTeamPair');
  judgeTeamPairsQuery
    .equalTo('eventTeam', request.object)
    .find()
    .then(judgeTeamPairs => {
      const presentationScoresQuery = new AV.Query('PresentationScore');
      presentationScoresQuery
        .equalTo('eventTeam', request.object)
        .find()
        .then(presentationScores => {
          AV.Object.destroyAll([...judgeTeamPairs, ...presentationScores]);
        });
    });
});
AV.Cloud.beforeUpdate('JudgeTeamPair', async request => {
  const originalJudgeTeamPair = AV.Object.createWithoutData('JudgeTeamPair', request.object.id);
  const judgeTeamPair = await originalJudgeTeamPair.fetch();
  if (judgeTeamPair.get('scores').length) {
    throw new AV.Cloud.Error('Team already judged by the current judge.');
  }
});
AV.Cloud.beforeUpdate('PresentationScore', async request => {
  const originalPresentationScore = AV.Object.createWithoutData('PresentationScore', request.object.id);
  const presentationScore = await originalPresentationScore.fetch();
  if (presentationScore.get('score')) {
    throw new AV.Cloud.Error('Team already has a presentation score given by the current judge.');
  }
});
