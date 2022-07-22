import EventEmitter = require("events");
import {ModelManager} from "../modelManager";
import {promises as fs} from 'fs'

const mongoose = require('mongoose');

export class MongoManager extends EventEmitter {

    private readonly _cardModel:any


    constructor() {
        super();
        const config = {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            useUnifiedTopology: true
        }
        let Schema = mongoose.Schema;
        const cardDataSchema = new Schema({

            order: String,
            name: String,
            date: Date,
        }, {
            versionKey: false
        });
        this._cardModel = mongoose.model("test3-cards", cardDataSchema);

        mongoose.connect("mongodb://localhost/vue2-loader", config);
    }



    /**
     * 全部の部屋のデータの取得
     * @param collection
     */
    public getAllList = async () => {

        const result = await this._cardModel.find().sort({room_id: 1});
        return result;
    }







}