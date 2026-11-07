import express from 'express'
import {urls} from './urls/urls.js'
import {controller} from './controller/controller.js'

const router = express.Router();

controller(router, urls);

export default router;


