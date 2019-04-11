import express from "express";
import {deviceController} from "../Controllers/deviceController";

const routes = express.Router();

routes
  .get('/:id', deviceController.getDevice)
  .post('/remove', deviceController.removeDevice)
  .post('/add', deviceController.addDevice)
  .post('/edit', deviceController.editDevice);

module.exports = routes;
