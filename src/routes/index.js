module.exports = function(app){
  app.use("/", require("./home"));
  app.use("/device", require("./device"));
  app.use("/start", require("./start"))
}
