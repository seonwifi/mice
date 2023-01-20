import { ThreeEngine } from "../Engine/ThreeEngine";
import { World } from "../World/World";
import { WorldScreen } from "../Screen/WorldScreen";
import { IWorldPreset } from "../World/WorldPreset";
import { DebugGUI, DebugGUIFolders } from "../Debug/DebugGUI";
import { eScenePlayState } from "../Common/EngineDefine";
import { DebugUpdater } from "../Debug/DebugUpdater";
import * as dat from 'lil-gui';

enum eWorldPlayType {
    single,
    additive
}

export class Activity{
   protected engine  = new ThreeEngine();
   private panel? : dat.GUI;
   private debugGUI? : DebugGUI;
   
   constructor(){

   }
 
   async runAsync(htmlViews : HTMLElement[], enableDebug: boolean){
        if(enableDebug){ 
            await this.initDebugGUIAsync();
        }
    // 
   }

   async initDebugGUIAsync(){
        if(!this.debugGUI){
            this.debugGUI = new DebugGUI();
            await this.debugGUI.initAsync();
        } 
   }

   isEnableDebug() : boolean{
        return this.debugGUI !== undefined;
   }

   requestFolders(callback : (debugUpdate? : DebugUpdater, rootFolder? : DebugGUIFolders)=>void) {
        const scope = this;
        if(!this.debugGUI){
            callback(this.debugGUI, undefined);
        }
        else{
            this.debugGUI.requestFolders(callback);
        } 
    }

    requestDebugRootFolder(callback : (debugUpdate? : DebugUpdater, rootFolder? :  dat.GUI)=>void) {
        const scope = this;
        if(!this.debugGUI){
            callback(this.debugGUI, undefined);
        }
        else{
            this.debugGUI.requestRootFolder(callback);
        } 
    }

    requestDebugMonitorFolder(callback : (debugUpdate? : DebugUpdater, folder? : dat.GUI)=>void) {
        const scope = this;
        if(!this.debugGUI){
            callback(this.debugGUI, undefined);
        }
        else{
            this.debugGUI.requestMonitorFolder(callback);
        } 
    }

    showDebug(){ 
        this.debugGUI?.run(this);
    }
 
   getEngine() {
        return this.engine;
   }

    dispose() {
        this.engine.dispose();
    }
 
    //world function
 
    protected    newWorld<INIT_DATA, T extends IWorldPreset>( type: (new (activity : Activity, engine : ThreeEngine, world : World, data? : INIT_DATA | any | undefined | null) => T), data? : INIT_DATA | any | undefined | null, playState : eScenePlayState = eScenePlayState.Play) : World {
        let world = this.engine.addWorld(type,  this, data);
        if(playState === eScenePlayState.Play){
            this.playWorld(world);
        }
        return world;
    }

    //world function
    // protected newWorldWithPlay(preset : WorldPreset, worldPlayType : eWorldPlayType)  : World {
    //     return this.engine.addScene(preset);
    // }

    //world function
    protected playWorld(world : World){
        if(!world){
            return;
        }
        this.engine.playWorld(world);
    }

    //world function
    protected pauseWorld(world : World){
        if(!world){
            return;
        } 
        this.engine.pauseWorld(world);
    }

    //world function
    protected removeAllWorld(){
        this.engine.removeAllWorld();
    }

    //screen function
    addScreen<T extends WorldScreen>(type: (new (activity : Activity, htmlView? : HTMLElement | null, sceneSource? : World  | undefined) => T), htmlView? : HTMLElement  | null, sceneSource?  : World  | undefined) : T { 
        return this.engine.addScreen(type, this, htmlView, sceneSource);
    }
}