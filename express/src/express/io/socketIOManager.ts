
import {Server} from "socket.io";
import {ModelManager} from "../../model/modelManager";
export class SocketIOManager
{
    private _server:Server
    constructor() {
    }
    public setHttpServer(httpServer):void
    {
        this._server = new Server(httpServer, { /* options */});
        this._server.on('connection', function (socket) {
            //console.log("connection" + new Date())
            /*
            socket.on('message', function (msg: any, callback) {
                try {
                    let clientIp = socket.request.socket.remoteAddress;
                    //
                    let title: string = msg.title;
                    let message: string = msg.message;
                    let tags:string = msg.tags
                    let gender: string = msg.gender;
                    let age: string = msg.age;
                    let place:string = msg.place;
                    let ip: string = clientIp;
                    let date: Date = new Date();
                    let rate: string = "0";
                    let obj = {
                        "title":title,
                        "message":message,
                        "tags":tags,
                        "age":age,
                        "gender":gender,
                        "ip":ip,
                        "date":date,
                        "rate":rate,
                        "place":place
                    }

                    let modelManager:ModelManager = ModelManager.getInstance();
                    modelManager.set(obj).then((response) =>
                    {
                        callback({
                            status: "ok"
                        });
                        //console.log(JSON.stringify(response.data))
                        io.emit('message', response.data);
                    })

                } catch (e) {
                    console.log("data error")
                    callback({
                        status: "error"
                    });
                }
            });

            socket.on('read', function ( obj: any, callback:Function) {
                try {

                    //console.log("read express")
                    //console.log("place :" + obj.place)

                    this._server.emit('readToViewer',obj);
                    callback({
                        status: "ok"
                    });
                } catch (e) {
                    console.log("data error")
                    callback({
                        status: "error"
                    });
                }
            });*/
        });
    }

    public update = (data:any) =>
    {
        //console.log("update " + new Date())
        this._server.emit('update',data);
    }

}