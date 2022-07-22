import {ModelManager} from "../model/modelManager";
import {ExpressManager} from "../express/expressManager";
export class ControllerManager
{

    constructor() {
        ModelManager.getInstance();
        let expressManager = new ExpressManager();
        expressManager.start();
    }
}