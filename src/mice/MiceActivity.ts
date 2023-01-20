import { Gugi } from "@next/font/google";
import * as THREE from "three";
import { Vector3 } from "three";
import { Activity } from "../Base/ThreeEngine/Activity/Activity";
import { MiceTestWorldPreset } from "./Preset/MiceTestWorldPreset";
import * as dat from 'lil-gui';
import { DebugUpdater } from "../Base/ThreeEngine/Debug/DebugUpdater";
 
export class MiceActivity extends Activity {
    constructor(){
        super();
    } 

    async runAsync(htmlViews : HTMLElement[], enableDebug: boolean){
        await super.runAsync(htmlViews, enableDebug);
        const scope = this;
 
        this.newWorld(MiceTestWorldPreset, htmlViews);
        this.showDebug();

 
        this.requestDebugRootFolder((debugUpdate? : DebugUpdater, folder? : dat.GUI)=>{
            if(!debugUpdate || !folder){
                return;
            }

            const reload = {
                reloadMap : function (){
                    scope.removeAllWorld();
                    scope.newWorld(MiceTestWorldPreset,  htmlViews);
                }
            }

            folder.add(reload, 'reloadMap');
        }); 
    }
}