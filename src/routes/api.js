import express from "express";
import {simController} from "../Controllers/simController";

const routes = express.Router();

routes.post('/simInfo', simController.updateList);

module.exports = routes;
