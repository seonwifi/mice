import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WorldManager } from "../World/WorldManager";
import { ScreenManager } from "../Screen/ScreenManager";
import { World } from "../World/World";
import { GLRenderer } from "../Renderer/GLRenderer";
import { WorldScreen } from "../Screen/WorldScreen";
import { WorldPreset } from "../World/WorldPreset";
import { eWorldRemoveScreenState } from "../Common/EngineDefine";
  
export class ThreeEngine{
 
    private worldManager: WorldManager = new WorldManager();
    private screenManager : ScreenManager = new ScreenManager();
    
    constructor(){ 

    }

    dispose(){
        this.worldManager.removeAll();
        this.screenManager.removeAll();
    }
 
    // getComponent<T extends IComponent>(constructor:{new ():T}): T {
    addWorld<INIT_DATA, T extends WorldPreset>( type: (new (engine : ThreeEngine, world : World , data? : INIT_DATA | any | undefined) => T), data? : INIT_DATA | any | undefined) : World {
       let scene = this.worldManager.add(type, this, data);
        return scene;
    }

    addScreen<T extends WorldScreen>(type: (new (viewDock? : HTMLElement | null, sceneSource? : World  | undefined) => T), htmlView? : HTMLElement | null, world? : World  | undefined) : T { 
        let screen = this.screenManager.add(type, htmlView, world);
        return screen;
    }

    removeAllWorld(){
        this.worldManager.removeAll();
    }

    removeScreenInWorld(world : World){
        if(!world){
            return;
        }

        this.screenManager.removeScreenInWorld(world);
    }

    getWorldManager(){
        return this.worldManager;
    }

    getScreenManager(){
        return this.screenManager;
    }

    containScreen(screen : WorldScreen): boolean{
        return this.screenManager.contain(screen);
    }

    playWorld(world : World){
        if(!world){
            return;
        }

        world.play(); 
    }

    //world function
    pauseWorld(world : World){
        if(!world){
            return;
        } 
        world.pause(); 
    }

}