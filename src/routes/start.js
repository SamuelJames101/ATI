import express from "express";
import {commandController} from "../Controllers/commandController";

const routes = express.Router();

routes.post('/', commandController.startEggplant)


module.exports = routes;
