import express from "express";
import {homeController} from "../Controllers/homeController";

const routes = express.Router();

routes.get('/', homeController.showHome);

module.exports = routes;
