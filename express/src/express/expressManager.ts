import express = require("express");
import EventEmitter = require("events");
import {createServer} from "http";
import {ModelManager} from "../model/modelManager";
import {SocketIOManager} from "./io/socketIOManager";


const bodyParser = require('body-parser')
let PORT: number = 4100;

export class ExpressManager extends EventEmitter {
    private _socketIOManager: SocketIOManager;
    constructor() {
        super();
    }

    public start = () => {
        const app = express();
        app.use(bodyParser.urlencoded({extended: true}))
        const allowCrossDomain = function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, access_token, Accept')
            // intercept OPTIONS method
            if ('OPTIONS' === req.method) {
                res.send(200)
            } else {
                next()
            }
        }
        app.use(allowCrossDomain);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.static('dist/public'));

        app.get("/data.json", (req, res) => {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.get().then((result) =>{
                res.json(result);
            })
        });

        app.post('/post', function (req, res) {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.post(req.body).then(result => {
                res.json(result);
            })
        })

        const httpServer = createServer(app);
        this._socketIOManager = new SocketIOManager();
        this._socketIOManager.setHttpServer(httpServer);

        httpServer.listen(PORT, () => {
            console.log("express listening on port " + PORT + " " + new Date());
        });
    }
}