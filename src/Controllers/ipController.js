import { IP } from '../Models/ipAddress';

export class ipConstoller{

  static getALlIPAddresses{
    IP.geta
  }

  Device.getAllDevices(function(getallError, deviceList){
    let obj = {};
    if(getallError){
      obj.error = getallError.sqlMessage;
    }else if (addDeviceError) {
      console.log(addDeviceError);
      obj.error = addDeviceError.sqlMessage;
    }
    let cronList = CronManager.getInstance().getCrons();
    obj.deviceList = deviceList;
    obj.cronList = cronList
    res.render('home', obj);
  })
}
