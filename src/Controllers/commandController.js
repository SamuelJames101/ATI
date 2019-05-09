import child_process from "child_process";
import cron from "node-cron";
import CronManager from "../Models/CronManager"
const spawn = child_process.spawn;

export class commandController{
  static startEggplant(req, res, next){
    let port = req.body.portNumber;
    let cmd = spawn('/Applications/Eggplant.app/Contents/MacOS/runscript', ['/Users/sam/BT-Mobile-Eggplant/BT\ Mobile\ Test.suite/Scripts/MainScript.script','-host','10.96.4.19', '-port',port]);
    cmd.stdout.on('data', function (data){
      process.stdout.write(data.toString());
    })

    cmd.stderr.on('data', function (data){
      process.stderr.write(data.toString());
    })
  };

  static autoStartEggplant(req, res, next){
    let port = req.body.port;
    let time = req.body.time;
    let deviceID = req.body.deviceID;
    let cmd = spawn('/Applications/Eggplant.app/Contents/MacOS/runscript', ['/Users/sam/BT-Mobile-Eggplant/BT\ Mobile\ Test.suite/Scripts/MainScript.script','-host','10.96.4.19', '-port',port]);

    CronManager.getInstance().add(deviceID, port, time, cmd);
    res.redirect('/');
  }

  static autoStopEggplant(req, res, next){
    let deviceID = req.body.deviceID;
    CronManager.getInstance().stop(deviceID);
    res.json(CronManager.getInstance().getCrons());
  }

  static autoGetEggplant(req, res, next){
    CronManager.getInstance().getCrons();
  }

  static autoDeleteEggplant(req, res, next){
    let deviceID = req.body.deviceID;
    let jobbie = CronManager.getInstance().deleteJob(deviceID);
    let obj={};
    obj.deleted = jobbie;
    obj.list = CronManager.getInstance().getCrons();
    res.json(obj);
  }

}
