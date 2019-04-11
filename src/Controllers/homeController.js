import { Device } from '../Models/Device';


export class homeController{

  static showHome(req, res) {
    Device.getAllDevices(function(getallError, deviceList){
      if(getallError){
        console.log('Could not get devices from device module: ', getallError);
      }else {
        res.render('home', {deviceList});
      }
    })
  }
}
