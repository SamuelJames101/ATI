import CronJobManager from "cron-job-manager"

export default class CronManager{
  constructor(){
    this.manager = new CronJobManager();
  };

  static getInstance(){
    if (!this.instance){
      this.instance = new CronManager();
    }
    return this.instance;
  };

  add(deviceID, port, time, cmd){
    this.manager.add(deviceID, `00 ${time} * * *`, () => {
      cmd.stdout.on('data', function (data){
        process.stdout.write(data.toString());
      })

      cmd.stderr.on('data', function (data){
        process.stderr.write(data.toString());
      })
    }, {
      start: true,
      timeZone: "Europe/London"
    });
  }

  start(deviceID){
    this.manager.start(deviceID);
  }

  stop(deviceID){
    this.manager.stop(deviceID);
  }

  deleteJob(deviceID){
    this.manager.deleteJob(deviceID);
    if (!this.manager.exists(deviceID)){
      return true
    }else {
      return false
    }
  }

  getCrons(){
    let jobs = this.manager.jobs;
    let output = [];
    for (let key of Object.keys(jobs)){
      output.push({
        deviceID: key,
        time: Object.keys(jobs[key].cronTime.hour)[0] + ":00",
        status: jobs[key].running ? "Running" : "Not Running"
      })
    }
    return output;
  }
}
