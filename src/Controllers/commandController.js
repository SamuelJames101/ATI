import child_process from "child_process";
const spawn = child_process.spawn;

export class commandController{
  static startEggplant(req, res, next){
    let port = req.body.portNumber;
    var cmd = spawn('/Applications/Eggplant.app/Contents/MacOS/runscript', ['/Users/sam/BT-Mobile-Eggplant/BT\ Mobile\ Test.suite/Scripts/MainScript.script','-host','10.96.4.19', '-port',port]);
    cmd.stdout.on('data', function (data){
      process.stdout.write(data.toString());
    })

    cmd.stderr.on('data', function (data){
      process.stderr.write(data.toString());
    })
  };
}
