import { Device } from '../Models/Device';
import CronManager from '../Models/CronManager';

export class homeController{

  static showHome(req, res) {
    Device.getAllDevices(function(getallError, deviceList){
      if(getallError){
        console.log('Could not get devices from device module: ', getallError);
      }else {
        let cronList = CronManager.getInstance().getCrons();
        res.render('home', {deviceList, cronList});
      }
    })
  }
}
