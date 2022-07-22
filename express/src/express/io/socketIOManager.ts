
import {Server} from "socket.io";
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
        });
    }

    public update = (data:any) =>
    {
        //console.log("update " + new Date())
        this._server.emit('update',data);
    }

}