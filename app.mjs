import bodyParser from "body-parser";
import child_process from "child_process";
const spawn = child_process.spawn;
import express from "express";
import mysql from "mysql";

import { Device } from './Modules/Device';
import { DB } from './Database/DB';
const db = new DB();
//
var app = express();

import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//This is what runs when first opening the site
app.get('/', function(req, res) {
  Device.getAllDevices(db, function(getallError, deviceList){
    if(getallError){
      console.log('Could not get devices from device module: ', getallError);
    }else {
      res.render('home', {deviceList});
    }
  })
});

app.get('/getDevice/:id', function(req, res, next){
  var data = req.params.id;
  Device.getDevice(data, db, function(getDeviceError, gotDevice){
    let obj = {};
    if(!getDeviceError){
      obj.device = gotDevice;
        res.json(obj);
    }else {
      obj.error = getDeviceError.sqlMessage;
      res.render('home', obj);
    }
  })
})

//This what runs when you add a device
app.post('/addDevice', function(req, res, next){
  let connection = req.body.connected ? 1:0;
  var data = {name: req.body.friendlyName, model_name: req.body.modelName, port: req.body.port, os: req.body.os, os_version: req.body.osVersion, connection};

  Device.addDevice(data, db, function(addDeviceError, newDevice){
      Device.getAllDevices(db, function(getallError, deviceList){
        let obj = {};
        if(getallError){
          console.log('Could not get devices from device module: ', getallError);
        }else if (addDeviceError) {
          obj.error = addDeviceError.sqlMessage
        }
        obj.deviceList = deviceList;
        res.render('home', obj);
      })
  })
});

app.post('/removeDevice', function(req, res, next){
  var data = req.body.id;
  console.log(data)
  Device.removeDevice(data, db, function(removeDeviceError, removedDevice){
    res.json(removeDeviceError);
  })
});


app.post('/editDevice', function(req, res, next){
  let data = req.body
  Device.updateDevice(data, db, function(updateDeviceError, updatedDevice){
      let obj = {};
      if(!updateDeviceError){
        obj.device = updatedDevice;
        res.json(obj);
      }else {
        obj.error = updateDeviceError.sqlMessage
        res.render('home', obj);
      }
  })

})

app.listen(3000);
