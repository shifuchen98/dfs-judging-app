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
