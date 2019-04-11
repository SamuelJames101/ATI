import { Device } from '../Models/Device';

export class deviceController{
  static getDevice(req, res, next){
    var data = req.params.id;
    Device.getDevice(data,function(getDeviceError, gotDevice){
      let obj = {};
      if(!getDeviceError){
        obj.device = gotDevice;
          res.json(obj);
      }else {
        obj.error = getDeviceError.sqlMessage;
        res.render('home', obj);
      }
    })
  };

  static removeDevice(req, res, next){
    var data = req.body.id;
    console.log(data);
    Device.removeDevice(data,function(removeDeviceError, removedDevice){
      res.json(removeDeviceError);
    })
  };

  static addDevice(req, res, next){
    let connection = req.body.connected ? 1:0;
    var data = {name: req.body.friendlyName, model_name: req.body.modelName, port: req.body.port, os: req.body.os, os_version: req.body.osVersion, connection};

    Device.addDevice(data,function(addDeviceError, newDevice){
        Device.getAllDevices(function(getallError, deviceList){
          let obj = {};
          if(getallError){
            obj.error = getallError.sqlMessage;
          }else if (addDeviceError) {
            console.log(addDeviceError);
            obj.error = addDeviceError.sqlMessage;
          }
          obj.deviceList = deviceList;
          res.render('home', obj);
          console.log(obj);
        })
    })
  };

  static editDevice(req, res, next){
    let data = req.body
    console.log(data)
    Device.updateDevice(data,function(updateDeviceError, updatedDevice){
      Device.getAllDevices(function(getallError, deviceList){
        let obj = {};
        if(getallError){
          obj.error = getallError.sqlMessage;
        }else if (updateDeviceError) {
          obj.error = updateDeviceError.sqlMessage;
        }
        obj.deviceList = deviceList;
        res.json(obj);
        console.log(obj.error);
      })
    })
  };
}
