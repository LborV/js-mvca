const Action = require('./Action');
globalThis.Middlewares = require('./Middlewares');
const Loader = require('./Loader');

class Actions extends Loader {
    constructor(configs) {       
        super();

        if(!configs.io) {
            return; 
         }
 
        this.actionList = [];
        this.load();

        this.io = configs.io;
        return this.listener();
    }
    
    load(dirName = 'actions') {
        try {
            globalThis.MiddlewaresPool = new Middlewares();

            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let action = require(`../${file}`).setParent(this);
                if(action instanceof Action) {
                    let actionName = action.getName();
                    this.actionList[actionName] = action;
                } else {
                    throw 'Inccorect class!';
                }
            });
        } catch(e) {
            console.error(e);
        }
    }

    onConnect() {
        console.log("onConnect method can be overwriten");
    }

    onDisconnect() {
        console.log("onDisconnect method can be overwriten");
    }

    listener() {
        this.io.on('connection', (socket) => {
            this.onConnect(socket);

            for(let actionName in this.actionList) {
                socket.on(actionName, (data) => {this.actionList[actionName].requestIn(data, socket);});
            }

            socket.on('disconnect', () => {
                this.onDisconnect(socket);
            });
        });

        return this;
    }

    call(actionName, data, socket = undefined) {
        if(actionName in this.actionList) {
            return this.actionList[actionName].requestIn(data, socket);
        }

        return this;
    }
}

module.exports = Actions;