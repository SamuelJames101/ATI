const table = 'devices';
import {DB} from '../Utilities/DB';

export class Device {
  constructor({ID, name, model_name, port, os, os_version, connection}){
    this.ID = ID || null;
    this.name = name;
    this.model_name = model_name;
    this.port = port;
    this.os = os;
    this.os_version = os_version;
    this.connection = connection;
  }

  static addDevice(data, callback){
    DB.insert(table, data, function(error, results){
      if (!error){
        let newDevice = new Device(results);
        callback(error, newDevice);
      }else{
        callback(error);
      }
    })
  }

  static getDevice(data, callback){
    DB.getDevice(table, data, function(getDeviceError, results){
      if(!getDeviceError){
        let newDevice = new Device(results);
        callback(getDeviceError, newDevice);
      }else {
        callback(getDeviceError)
      }
    })
  }

  static removeDevice(data, callback){
    DB.remove(table, data, function(removeError, results){
      if (!removeError){
        callback(removeError, results);
      }else{
        callback(removeError, results);
        }
      })
    }

  static getAllDevices(callback){
    console.log(DB)
    DB.getAll(table, function(getAllError, results){
      let deviceList = [];
      if (results !== undefined){
        for (let i = 0; i < results.length; i++){
          let newDevice = new Device(results[i]);
          deviceList.push(newDevice);
        }
      }
      console.log(deviceList)
      callback(getAllError, deviceList);
    })
  }

static  updateDevice(data, callback){
    DB.update(table, data, function(updateError, results){
      if(!updateError){
        let newDevice = new Device(results)
        callback(updateError, results)
      }else {
        callback(updateError)
      }
    })
  }
}
