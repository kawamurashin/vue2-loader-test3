import express = require("express");
import EventEmitter = require("events");
import {createServer} from "http";
import {ModelManager} from "../model/modelManager";
import {SocketIOManager} from "./io/socketIOManager";

const multer = require('multer');
const path = require("path");
const fs = require('fs');
const bodyParser = require('body-parser')
let PORT: number = 9100;

export class ExpressManager extends EventEmitter {
    private static UPLOAD_DIR: string = "dist/public/uploads";
    private _socketIOManager: SocketIOManager;

    constructor() {
        super();
    }

    public start = () => {
        const update = (data: any) => {
            this.updateHandler(data);

        }
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
            res.json(modelManager.json);
        });
        app.get("/getMessage", (req, res) => {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.getMessage().then(result => {
                res.json(result);
            })
        });
        app.get("/getList", (req, res) => {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.get().then(result => {
                res.json(result);
            })
        });
        app.get("/room", (req, res) => {
            const room_id: string = req.query.room_id.toString();
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.room(room_id).then(result => {
                res.json(result);
            })
        });

        app.get("/reload", (req, res) => {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.reload().then(result => {
                res.json(result);
            })
        });
        app.post("/saveJson", (req, res) => {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.saveJson(req.body).then(result => {
                res.json(result);
            })
        });


        app.post("/sendMessage", (req, res) => {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.sendMessage(req.body).then(result => {
                update(result);
                res.json(result);
            })
        });

        app.post('/post', function (req, res) {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.post(req.body).then(result => {
                update(result);
                res.json(result);
            })
        })

        let count: number = 0;
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, ExpressManager.UPLOAD_DIR)
            },
            filename: function (req, file, cb) {
                count++;
                if (count >= 1000) {
                    count = count - 1000;
                }
                const countStr = String(1000 + count).substring(1);
                const list: string[] = file.originalname.split(".");
                const extension = list[list.length - 1]
                const date: Date = new Date();
                const year: string = String(date.getFullYear());
                const month: string = String(date.getMonth() + 1 + 100).substring(1);
                const day: string = String(date.getDate() + 100).substring(1);
                const hour: string = String(date.getHours() + 100).substring(1);
                const minute: string = String(date.getMinutes() + 100).substring(1);
                const second: string = String(date.getSeconds() + 100).substring(1);
                const name: string = year + month + day + hour + minute + second + "-" + countStr + "." + extension;

                cb(null, name)
            }
        })
        const upload = multer({storage: storage})

        //lost
        /**
         * おとしものデータの送信先
         */
        app.post('/post_lost', upload.array('files'), function (req: any, res: any, next: Function) {
            const save = () =>
            {
                const modelManager:ModelManager = ModelManager.getInstance();
                modelManager.saveLost(data).then(result =>{
                    update(result);
                    res.json(result);
                })
            }

            const room_id: string = req.body.room_id;
            const images: string[] = [];
            const message: string = req.body.message;
            let data: any = {
                "date": new Date(),
                "room_id": room_id,
                "message": message,
                "images": images

            };
            let completeCount = 0;
            const header: string = req.body.room_id
            const files: any[] = req.files;
            const n = files.length;
            if(n == 0)
            {
                save()
            }
            else{
                for (let i = 0; i < n; i++) {
                    const file: string = files[i].filename;
                    const filename = path.join(ExpressManager.UPLOAD_DIR, file);
                    const rename = path.join(ExpressManager.UPLOAD_DIR, header + "-" + file);
                    const imagePath = rename.replace("dist\\public\\uploads\\", "/uploads/");
                    images.push(imagePath)
                    fs.rename(filename, rename, err => {
                        if (err) throw err;
                        completeCount++
                        if (completeCount == n) {
                            save();
                        }
                    });
                }
            }
        })

        /**
         * 削除予定
         */
        app.post("/lost_list", (req, res) => {
            //console.log("lostList")
            console.log("post lost_list 削除されました。" + new Date())
            /*
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.lostList(req.body).then(result => {
                res.json(result);
            })*/
        });
        app.get("/lost_items", (req, res) => {
            //console.log("lost_items")
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.getLostList().then(result => {
                res.json(result);
            })
        });

        app.post("/lost_comment", (req, res) => {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.saveLostComment(req.body).then(result => {
                update(result);
                res.json(result);
            })
        });


        app.post('/delete_lost', function (req, res) {
            let modelManager: ModelManager = ModelManager.getInstance();
            modelManager.deleteLost(req.body).then(result => {
                if(result.status == "ok")
                {
                    let obj = {"status":"ok",
                    "type":"lost"}
                    update(obj);
                }
                res.json(result);
            })
        });

        const httpServer = createServer(app);
        this._socketIOManager = new SocketIOManager();
        this._socketIOManager.setHttpServer(httpServer);

        httpServer.listen(PORT, () => {
            console.log("express listening on port " + PORT + " " + new Date());
        });
    }


    private updateHandler = (data: any) => {
        this._socketIOManager.update(data);
    }
}