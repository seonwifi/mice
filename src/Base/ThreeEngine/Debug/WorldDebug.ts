import { Activity } from "../Activity/Activity";
import { DebugGUIFolders  } from "./DebugGUI";
import { DebugUpdater, IDebugGUIUpdate } from "./DebugUpdater";
import { World } from "../World/World";
import * as dat from 'lil-gui';
 

export class WorldDisplayValue {
    static uniqId : number = 0;
    objectCount : number = 0;
    updateCount : number = 0;
    playTime : string = "";

    panel? :  dat.GUI;
    parent? : dat.GUI;
    folerFPS? :  dat.GUI;
    updateControlls = new Array< dat.Controller>();
    world? : World;
    lastWorldName : string = '';

    constructor(rootFolder : dat.GUI, world : World){
        this.init(rootFolder , world);
    }

    init(parent : dat.GUI, world : World){
        this.clear();
        this.parent = parent;
        this.world = world;
        this.objectCount = this.world.getSceneObjectCount();
        this.updateCount = this.world.getUpdateCount();

        this.lastWorldName = world.getName();
        let foler = parent.addFolder('World ' + WorldDisplayValue.uniqId + ' ' + this.lastWorldName);
        foler.open();
        this.panel = foler;
        WorldDisplayValue.uniqId++;

        this.updateControlls.push(foler.add(this, "objectCount"));
        this.updateControlls.push(foler.add(this, "updateCount"));
        this.updateControlls.push(foler.add(this, "playTime"));
        
        let fpsMananger = world.getFPSManager();
        let keys = Object.keys(fpsMananger.values);

        this.folerFPS = foler.addFolder('fps');
        this.folerFPS.open();
        this.folerFPS.open();
        for(const item of keys){ 
            let cont = this.folerFPS.add(fpsMananger.values, item);
            cont.decimals(3);
            this.updateControlls.push(cont);
        }
    }


    update(){
        if(this.world){
            if(this.lastWorldName !== this.world.getName()){
                this.init(this.parent!, this.world);
            }
        }

        if(this.world){
            this.objectCount = this.world.getSceneObjectCount();
            this.updateCount = this.world.getUpdateCount();
            let playSeconds = this.world.getPlaySeconds();

            let playDay = playSeconds/(3600*24); 
            let playDayStr = playDay.toFixed();
            playDay = parseInt(playDayStr);

            let playHour : number = playSeconds/3600;
            playHour = playHour%24;
            let playHourStr = playHour.toFixed();
            if(playHourStr.length === 1){
                playHourStr = '0' + playHourStr;
            }

            let playMinute : number = playSeconds/60;
            playMinute = playMinute%60;
            let playMinuteStr = playMinute.toFixed();
            if(playMinuteStr.length === 1){
                playMinuteStr = '0' + playMinuteStr;
            }
            let perSeconds = playSeconds%60;
            let perSecondsStr = perSeconds.toFixed();
            if(perSecondsStr.length === 1){
                perSecondsStr = '0' + perSecondsStr;
            }
            if(playDay > 0){
                this.playTime = playDayStr + ' day '+ playHourStr + ':' + playMinuteStr + ':' + perSecondsStr;
            }
            else{
                this.playTime = playHourStr + ':' + playMinuteStr + ':' + perSecondsStr;
            }
            
        }

        for(let i = 0, size = this.updateControlls.length; i <size; ++i){
            let item = this.updateControlls[i];
            item.updateDisplay();
        }
    }
 
    clear(){
        while( this.updateControlls.length > 0){
            let item = this.updateControlls.pop();
            item?.destroy(); 
        } 

        this.folerFPS?.destroy();
        this.panel?.destroy();
    }
    dispose(){
        this.clear();
    }
}

export class WorldDebugger extends DebugUpdater {
    worldMonitor? : WorldDisplayValue;


    activity? : Activity;
    static debugRootFolderId = 0;
    worldContentsFolder? : dat.GUI; 
    world? : World;

    constructor( activity : Activity, world : World, debugUpdate : DebugUpdater, folders : DebugGUIFolders){
        super(debugUpdate)
        this.activity = activity;
        this.world = world;
        const scope = this;
        if(folders.monitorFolder){
            this.worldMonitor = new WorldDisplayValue(folders.monitorFolder, world);
        }
        
         
    }

    requestDebugGUI(callback : (debugUpdate? : DebugUpdater, folder? : dat.GUI)=>void) {
        const scope = this;

        this.activity?.requestDebugRootFolder((debugUpdate? : DebugUpdater, folder? :  dat.GUI) =>{
            if(!debugUpdate || !folder){
                callback(undefined, undefined);
                return;
            }

            if(!scope.worldContentsFolder){
                let worldName = this.world?.getName();
                scope.worldContentsFolder = folder?.addFolder('World Contents' + WorldDebugger.debugRootFolderId + ' ' + worldName );
                scope.worldContentsFolder?.open();
                WorldDebugger.debugRootFolderId++;
            } 
        
            
            callback(debugUpdate, scope.worldContentsFolder);
        }); 

    }

    update(){
        if(this.world )
        this.worldMonitor?.update();
        super.update();
    }
    
    dispose(){
 
        this.worldMonitor?.dispose();
        if(this.worldContentsFolder){
            this.worldContentsFolder.destroy();
            
        }
        super.dispose();
    }
}