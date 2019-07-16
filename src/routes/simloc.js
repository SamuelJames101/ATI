import express from "express";
import {simController} from "../Controllers/simController";

const routes = express.Router();

routes.get('/', simController.showSimLoc);

module.exports = routes;
