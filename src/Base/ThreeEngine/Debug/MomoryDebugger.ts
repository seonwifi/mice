import { World } from "../World/World";
import { DebugGUIFolders } from "./DebugGUI";
import { DebugUpdater, IDebugGUIUpdate } from "./DebugUpdater";
import * as dat from 'lil-gui';

export class MomoryDebugger extends DebugUpdater {
 
    private memoryDisplayValue = {
        jsHeapSizeLimit : 0,
        totalJSHeapSize : 0,
        usedJSHeapSize : 0,
    }
 
    private debugfoler? : dat.GUI;

    constructor( debugUpdate : DebugUpdater, folders : DebugGUIFolders){
        super(debugUpdate);

        const scope = this;
 
        this.debugfoler = folders.monitorFolder?.addFolder('Memory Monitor'); 
        this.debugfoler?.open();

        this.addGUIControllerUpdate(this.debugfoler?.add(this.memoryDisplayValue, 'jsHeapSizeLimit'));
        this.addGUIControllerUpdate(this.debugfoler?.add(this.memoryDisplayValue, 'totalJSHeapSize'));
        this.addGUIControllerUpdate(this.debugfoler?.add(this.memoryDisplayValue, 'usedJSHeapSize'));
    }

    update(){
        let performance:any = window.performance; 
        let memory = performance.memory;
        this.memoryDisplayValue.jsHeapSizeLimit = memory.jsHeapSizeLimit;
        this.memoryDisplayValue.totalJSHeapSize = memory.totalJSHeapSize;
        this.memoryDisplayValue.usedJSHeapSize = memory.usedJSHeapSize;
        super.update();
    }
    
    dispose(){
        super.dispose(); 

        if(this.debugfoler){
            this.debugfoler.destroy();
        }
    }
}