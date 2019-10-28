const AV = require("leanengine");
AV.Cloud.define('updateUser', request => {
  return request.params.user
    .set('name', request.params.name)
    .set('email', request.params.email)
    .save();
});
