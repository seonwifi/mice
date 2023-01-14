import { Activity } from "../Activity/Activity";
import * as dat from 'dat.gui' // npm install --save @types/dat.gui
import { WorldScreen } from "../Screen/WorldScreen";
import { ScreenManager } from "../Screen/ScreenManager";
import { WebGLCapabilities } from "three";
import { World } from "../World/World";
import { WorldManager } from "../World/WorldManager";

class RendererDisplayValue {
    static uniqId : number = 0;
    renderWorld : string = '';
    geometries: number = 0;
    textures: number = 0;
    screen? : WorldScreen;
    panel? : dat.GUI;
    parent? : dat.GUI;
    folerCapabilities? : dat.GUI;
    updateControlls = new Array<dat.GUIController>();
    lastName:string = '';
 
    constructor(parent : dat.GUI, screen : WorldScreen){

        this.init(parent, screen);
    }
 

    update(){
        if(this.screen){
            if(this.lastName !== this.screen?.getName()){
                this.init(this.parent!, this.screen);
            }
        }

        if(this.screen){
            this.renderWorld = this.screen.getWorldName();

            let webglRenderer = this.screen.getWebglRenderer();
            if(webglRenderer){
                const info = webglRenderer?.info;
                this.geometries = info.memory.geometries;
                this.textures = info.memory.textures;
            } 
        } 

        for(let i = 0, size = this.updateControlls.length; i <size; ++i){
            let item = this.updateControlls[i];
            item.updateDisplay();
        }
    }

    init(parent : dat.GUI, screen : WorldScreen){
        this.clear();
        this.lastName = screen.getName();
        let foler = parent.addFolder('Renderer ' + RendererDisplayValue.uniqId + ' ' + screen.getName());
        RendererDisplayValue.uniqId++;
        foler.open();

        
        this.screen = screen;
        this.renderWorld = this.screen.getWorldName();
        this.updateControlls.push(foler.add(this, 'renderWorld'));
        this.updateControlls.push(foler.add(this, 'geometries'));
        this.updateControlls.push(foler.add(this, 'textures'));
        this.panel = foler;
        this.parent = parent; 

        let webglRenderer = this.screen.getWebglRenderer();
        if(webglRenderer){
            let capabilities = webglRenderer.capabilities; 
            let keys = Object.keys(capabilities);

            this.folerCapabilities = foler.addFolder('Capabilities');
            for(const item of keys){ 
                this.updateControlls.push(this.folerCapabilities.add(capabilities, item));
            }
        } 
    }

    clear(){
        while( this.updateControlls.length > 0){
            let item = this.updateControlls.pop();
            item?.remove();
        } 

        if(this.folerCapabilities && this.panel){
            this.panel.removeFolder( this.folerCapabilities);
        }
        if(this.panel && this.parent){
            this.parent.removeFolder( this.panel);
        }
    }

    dispose(){
        this.clear();
    }
}

class WorldDisplayValue {
    static uniqId : number = 0;
    objectCount : number = 0;
    updateCount : number = 0;
    playTime : string = "";

    panel? : dat.GUI;
    parent? : dat.GUI;
    folerFPS? : dat.GUI;
    updateControlls = new Array<dat.GUIController>();
    world? : World;
    lastWorldName : string = '';

    constructor(parent : dat.GUI, world : World){
        this.init(parent , world);
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

    init(parent : dat.GUI, world : World){
        this.clear();
        this.parent = parent;
        this.world = world;
        this.objectCount = this.world.getSceneObjectCount();
        this.updateCount = this.world.getUpdateCount();

        this.lastWorldName = world.getName();
        let foler = parent.addFolder('World ' + WorldDisplayValue.uniqId + ' ' + this.lastWorldName);
        this.panel = foler;
        WorldDisplayValue.uniqId++;

        this.updateControlls.push(foler.add(this, "objectCount"));
        this.updateControlls.push(foler.add(this, "updateCount"));
        this.updateControlls.push(foler.add(this, "playTime"));
        
        let fpsMananger = world.getFPSManager();
        let keys = Object.keys(fpsMananger.values);

        this.folerFPS = foler.addFolder('fpsMananger');
        this.folerFPS.open();
        for(const item of keys){ 
            this.updateControlls.push(this.folerFPS.add(fpsMananger.values, item));
        }
    }

    clear(){
        while( this.updateControlls.length > 0){
            let item = this.updateControlls.pop();
            item?.remove();
        } 

        if(this.folerFPS && this.panel){
            this.panel.removeFolder( this.folerFPS);
        }
        if(this.panel && this.parent){
            this.parent.removeFolder( this.panel);
        }
    }
    dispose(){
        this.clear();
    }
}

export class DebugGUI {

    private panel? : dat.GUI;
    private memoryDisplayValue = {
        jsHeapSizeLimit : 0,
        totalJSHeapSize : 0,
        usedJSHeapSize : 0,
    }
    private rendererDisplayValues = new Array<RendererDisplayValue>(); 
    private worldDisplayValues = new Array<WorldDisplayValue>();
    private updateControlls = new Array<dat.GUIController>();
    private bEnableUpdate = true;

    sleep(milliSeconds : number) {
        return new Promise(resolve => setTimeout(resolve, milliSeconds * 1000));
      } 

    requestDebugGUI(callback : (panel : dat.GUI)=>void) {
        const scope = this;
        const init = async () => {
            const dat = await import('dat.gui');
            if(!scope.panel){
                scope.panel = new dat.GUI( { width: 310 } );
            }
            
            callback(scope.panel);
        }
        init(); 
    }

    runActivityDebug( activity : Activity){
        const scope = this; 

        this.requestDebugGUI((panel : dat.GUI)=>{
            const folderDebug = panel.addFolder( 'Debug' ); 

            scope.createGUI_PerformanceMemory(folderDebug);
            
            function updateMemoryInfo(){
                if(scope.bEnableUpdate){
                    requestAnimationFrame(updateMemoryInfo); 
                    scope.update(activity, folderDebug); 
                } 
            }
            updateMemoryInfo();
        }); 
    }

    dispose(){
        this.bEnableUpdate = false;
        while(this.rendererDisplayValues.length > 0){
            const item = this.rendererDisplayValues.pop();
            if(item){
                item.dispose();
            }
        }

        while(this.worldDisplayValues.length > 0){
            const item = this.worldDisplayValues.pop();
            if(item){
                item.dispose();
            }
        }

        this.updateControlls.splice(0, this.updateControlls.length);
        this.panel?.destroy();
    }

    private createGUI_PerformanceMemory(parent : dat.GUI){
        const scope = this;
        let foler = parent.addFolder('Memory Monitor'); 
        foler.open();
        let gui_jsHeapSizeLimit = foler.add(scope.memoryDisplayValue, 'jsHeapSizeLimit');
        let gui_totalJSHeapSize = foler.add(scope.memoryDisplayValue, 'totalJSHeapSize');
        let gui_usedJSHeapSize = foler.add(scope.memoryDisplayValue, 'usedJSHeapSize');

        this.updateControlls.push(gui_jsHeapSizeLimit);
        this.updateControlls.push(gui_totalJSHeapSize);
        this.updateControlls.push(gui_usedJSHeapSize);
    }
    private createGUI_WorldScreen(parent : dat.GUI, screen : WorldScreen){  
        let rendererDisplayValue = new RendererDisplayValue(parent, screen);
        this.rendererDisplayValues.push(rendererDisplayValue);
    }

    private createGUI_World(parent : dat.GUI, world : World){  
        let worldDisplayValue = new WorldDisplayValue(parent, world);
        this.worldDisplayValues.push(worldDisplayValue);

    }

    private updateWorldScreen(activity : Activity, parent : dat.GUI){
 
        const scope= this; 
        let engine = activity.getEngine();  

        let screenManager = engine.getScreenManager();
        
        this.removeDirtyScreen(screenManager);

        for(let i = 0;  i < screenManager.getScreenCount(); ++i){
            let screen = screenManager.getScreen(i);
            if(screen){
                if(!this.hasScreen(screen)){
                    scope.createGUI_WorldScreen(parent, screen);
                }
            }
        } 

        let rendererDisplayValue;
        for(let i = 0, size = this.rendererDisplayValues.length; i < size; ++i){
            rendererDisplayValue = this.rendererDisplayValues[i];
            rendererDisplayValue.update();
        }

    }

    hasScreen(screen: WorldScreen): boolean { 
        let rendererDisplayValue = this.rendererDisplayValues.find((item)=>{
            return item.screen === screen;
        });
 
        return rendererDisplayValue !== undefined;
    }

    removeDirtyScreen(screenManager : ScreenManager){
        let removes = this.rendererDisplayValues.filter((item)=>{
            if(!item.screen){
                return true;
            }
            return !screenManager.contain(item.screen);
        });

        while(removes.length > 0){
            let removeItem = removes.pop();
            let removeIndex = this.rendererDisplayValues.findIndex((item)=>{
                return item === removeItem;
            });
            if(removeIndex !== -1){
                removeItem?.dispose();
                this.rendererDisplayValues.splice(removeIndex, 1);
            }
        }
    }

    private updateWorld(activity : Activity, parent : dat.GUI){
 
        const scope= this; 
        let engine = activity.getEngine();  

        let worldManager = engine.getWorldManager();
        
        this.removeDirtyWorld(worldManager);

        for(let i = 0;  i < worldManager.getWorldCount(); ++i){
            let world = worldManager.getWorld(i);
            if(world){
                if(!this.hasWorld(world)){
                    scope.createGUI_World(parent, world);
                }
            }
        } 

        let rendererDisplayValue;
        for(let i = 0, size = this.worldDisplayValues.length; i < size; ++i){
            rendererDisplayValue = this.worldDisplayValues[i];
            rendererDisplayValue.update();
        } 
    }

    hasWorld(world: World): boolean { 
        let worldDisplayValue = this.worldDisplayValues.find((item)=>{
            return item.world === world;
        });
 
        return worldDisplayValue !== undefined;
    }

    removeDirtyWorld(worldManager : WorldManager){
        let removes = this.worldDisplayValues.filter((item)=>{
            if(!item.world){
                return true;
            }
            return !worldManager.contain(item.world);
        });

        while(removes.length > 0){
            let removeItem = removes.pop();
            let removeIndex = this.worldDisplayValues.findIndex((item)=>{
                return item === removeItem;
            });

            if(removeIndex !== -1){
                removeItem?.dispose();
                this.worldDisplayValues.splice(removeIndex, 1);
            }
        }
    }

    private update(activity : Activity, parent : dat.GUI){
        let performance:any = window.performance; 
        let memory = performance.memory;
        this.memoryDisplayValue.jsHeapSizeLimit = memory.jsHeapSizeLimit;
        this.memoryDisplayValue.totalJSHeapSize = memory.totalJSHeapSize;
        this.memoryDisplayValue.usedJSHeapSize = memory.usedJSHeapSize;
 
        let controller;
        for(let i = 0, size = this.updateControlls.length; i < size; ++i){
            controller = this.updateControlls[i];
            controller.updateDisplay();
        }

        this.updateWorld(activity, parent);
        this.updateWorldScreen(activity, parent);
        
    }
}