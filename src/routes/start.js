import express from "express";
import {commandController} from "../Controllers/commandController";

const routes = express.Router();

routes.get('/', commandController.startEggplant)

module.exports = routes;
