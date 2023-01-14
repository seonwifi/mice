import { ThreeEngine } from "../Engine/ThreeEngine";
import { World } from "../World/World";
import { WorldScreen } from "../Screen/WorldScreen";
import { WorldPreset } from "../World/WorldPreset";
import { DebugGUI } from "../Common/DebugGUI";
import { eScenePlayState } from "../Common/EngineDefine";

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

   requestDebugGUI(callback : (panel : dat.GUI)=>void) {
        const scope = this;
        if(!this.debugGUI){
            this.debugGUI = new DebugGUI();
        }

        this.debugGUI.requestDebugGUI(callback);
    }

    showDebug(){
        const scope = this;
        if(!this.debugGUI){
            this.debugGUI = new DebugGUI();
        }
        this.debugGUI?.runActivityDebug(this);
    }
 
   getEngine() {
        return this.engine;
   }

    dispose() {
        this.engine.dispose();
    }
 
    //world function
 
    protected    newWorld<INIT_DATA, T extends WorldPreset>( type: (new (engine : ThreeEngine, world : World, data? : INIT_DATA | any | undefined) => T), name : string, data? : INIT_DATA | any | undefined, playState : eScenePlayState = eScenePlayState.Play) : World {
        let world = this.engine.addWorld(type, name, data);
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
    protected newScreen<T extends WorldScreen>(type: (new (viewDock? : HTMLElement | null, sceneSource? : World  | undefined) => T), viewDock? : HTMLElement  | null, sceneSource?  : World  | undefined) : T { 
        return this.engine.addScreen(type, viewDock, sceneSource);
    }
}