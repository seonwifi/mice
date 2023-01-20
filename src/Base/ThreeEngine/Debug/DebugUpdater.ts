import * as dat from 'lil-gui';
 
 

export interface IDebugGUIUpdate {
   
    //override IDebugGUIUpdateBase
    update():void;
 
    //override IDebugGUIUpdateBase
    dispose():void;
}

export class DebugControllerUpdate<USER_T> implements IDebugGUIUpdate{
    controller? : dat.Controller;
    protected autoUpdate : boolean = true;

    private userData? : USER_T;
    private callback? : (controller? : dat.Controller, userData? : USER_T) => void;

    constructor(guiController? : dat.Controller, autoUpdate : boolean = true, userData?: USER_T,  callback? : (controller? : dat.Controller, userData? : USER_T) => void){
 
        this.controller = guiController;
        this.autoUpdate = autoUpdate;
        this.userData = userData;
        this.callback = callback;
    }
 
    //override IDebugGUIUpdateBase
    update(){ 

        if(this.autoUpdate){
            if(this.controller){
                this.controller.updateDisplay();
            }
        }

        if(this.callback){
            this.callback(this.controller, this.userData);
        }
    }

    //override IDebugGUIUpdateBase
    dispose() {
        this.controller = undefined;
        this.userData = undefined;
        this.callback = undefined;
    }
}

export class DebugGUIUpdate implements IDebugGUIUpdate {
    private callback? : () => void;

    constructor(callback? : () => void){

        this.callback = callback;
    }
 
    //override IDebugGUIUpdateBase
    update(){ 
        if(this.callback){
            this.callback();
        }
    }

    //override IDebugGUIUpdateBase
    dispose() {
        this.callback = undefined;
    }
}


export class DebugUpdater {
    private updates = new Array<IDebugGUIUpdate>();

    parent? : DebugUpdater;
    parentUpdateHandle? : IDebugGUIUpdate;

    constructor(parent? : DebugUpdater){
        this.setParent(parent);
    }

    setParent(parent? : DebugUpdater){
        const scope = this;
        if(this.parent){
            this.removeParent();
        }

        this.parent = parent; 
        this.parentUpdateHandle = this.parent?.addUpdate(()=>{
            scope.update();
        });
    }

    addGUIControllerUpdateUserData<USER_T>(guiController? : dat.Controller, autoUpdate : boolean = true, userData? : USER_T, callback? : (controller? : dat.Controller, userData? : USER_T) => void) : DebugControllerUpdate<USER_T> {
        let debugUpdate = new  DebugControllerUpdate<USER_T>(guiController, autoUpdate, userData, callback);
        this.updates.push(debugUpdate);
        return debugUpdate;
    }

    addGUIControllerUpdate(guiController? : dat.Controller) : DebugControllerUpdate<undefined> {
        let debugUpdate = new  DebugControllerUpdate<undefined>(guiController, true, undefined, undefined);
        this.updates.push(debugUpdate);
        return debugUpdate;
    }


    addUpdate(callback? : () => void) : IDebugGUIUpdate {
        let debugUpdate = new DebugGUIUpdate(callback);
        this.updates.push(debugUpdate);
        return debugUpdate;
    }

    remove( debugGUIUpdate? : IDebugGUIUpdate){
        if(!debugGUIUpdate){
            return;
        }

        const i = this.updates.findIndex((item) =>{
            return item == debugGUIUpdate;
        });
        if(i !== -1){
            this.updates.splice(i, 1);
        }
    }

    update(){
        let controller;
        for(let i = 0, size = this.updates.length; i < size; ++i){
            controller = this.updates[i];
            controller.update();
        } 
    }

    removeParent(){
        this.parent?.remove(this.parentUpdateHandle);
        this.parentUpdateHandle = undefined;
        this.parent = undefined;
    }

    dispose(){
        this.removeParent();

        while(this.updates.length > 0){
            const item = this.updates.pop();
            if(item){
                item.dispose();
            }
        }
    }
}
