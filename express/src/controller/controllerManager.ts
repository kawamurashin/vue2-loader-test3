import {ModelManager} from "../model/modelManager";
import {ExpressManager} from "../express/expressManager";
export class ControllerManager
{
    private _expressManager:ExpressManager;
    constructor() {
        this._expressManager = new ExpressManager();

        let modelManager:ModelManager = ModelManager.getInstance();
        modelManager.addListener("model_init_complete", this.modelInitCompleteHandler)

        modelManager.init()
    }
    private modelInitCompleteHandler =() =>
    {
        this._expressManager.start();
    }
}