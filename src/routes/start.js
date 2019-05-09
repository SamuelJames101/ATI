import express from "express";
import {commandController} from "../Controllers/commandController";

const routes = express.Router();

routes.post('/', commandController.startEggplant);
routes.post('/auto', commandController.autoStartEggplant);
routes.post('/auto/stop', commandController.autoStopEggplant);
routes.post('/auto/get', commandController.autoGetEggplant);
routes.post('/auto/delete', commandController.autoDeleteEggplant);

module.exports = routes;
