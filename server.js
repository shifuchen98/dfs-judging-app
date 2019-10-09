const AV = require("leanengine");
const express = require("express");
const path = require("path");
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});
AV.Cloud.useMasterKey();
require("./cloud");
const app = express();
app.use(AV.express());
app.enable("trust proxy");
app.use(AV.Cloud.HttpsRedirect());
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});
const port = parseInt(
  process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000,
  10
);
app.listen(port);
