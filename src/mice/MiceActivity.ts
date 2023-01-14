import { Gugi } from "@next/font/google";
import * as THREE from "three";
import { Vector3 } from "three";
import { Activity } from "../ThreeJS/Activity/Activity";
import { ThreeEngineTest } from "../ThreeJS/Engine/ThreeEngineTest";
import { WorldScreen } from "../ThreeJS/Screen/WorldScreen";
import { MiceTestWorldPreset } from "./Preset/MiceTestWorldPreset";
import * as dat from 'dat.gui' // npm install --save @types/dat.gui
 
export class MiceActivity extends Activity {
    constructor(){
        super();
    } 

    init(viewDock : HTMLElement ){
        const scope = this;
 
        this.newWorld(MiceTestWorldPreset, 'MiceTestWorldPreset', viewDock);
        this.showDebug();

        this.requestDebugGUI((panel : dat.GUI)=>{

            const reload = {
                reloadMap : function (){
                    scope.removeAllWorld();
                    scope.newWorld(MiceTestWorldPreset, 'MiceTestWorldPreset', viewDock);
                }
            }

            panel.add(reload, 'reloadMap');
        }); 
    }
}