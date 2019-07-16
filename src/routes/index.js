module.exports = function(app){
  app.use("/", require("./home"));
  app.use("/device", require("./device"));
  app.use("/start", require("./start"));
  app.use("/api", require("./api"));
  app.use("/simloc", require("./simloc"))
  //app.use("/ip", require("./ip"));
}
