import EventEmitter = require("events");
import {MongoManager} from "./mongo/mongoManager";
export class ModelManager extends EventEmitter {
    private static _instance: ModelManager;
    private readonly _mongoManger: MongoManager

    public static getInstance(): ModelManager {
        if (this._instance == null) {
            this._instance = new ModelManager(new SingletonBlock());
        }
        return this._instance;
    }

    constructor(block: SingletonBlock) {
        super();
        block = null;
        this._mongoManger = new MongoManager();
    }

    public init = () => {
    }

    public get = async () =>
    {
        return await this._mongoManger.get();

    }
    public post = async (obj) => {
        return await this._mongoManger.post(obj);
    }




}

class SingletonBlock {

}
