import { DebugGUIFolders } from "./DebugGUI";
import { DebugUpdater, IDebugGUIUpdate } from "./DebugUpdater";
import { WorldScreen } from "../Screen/WorldScreen";
import * as dat from 'lil-gui';

class RendererDisplayValue {
    static uniqId : number = 0;
    renderWorld : string = '';
    geometries: number = 0;
    textures: number = 0;
    screen? : WorldScreen;
    panel? : dat.GUI;
    parent? : dat.GUI;
    folerCapabilities? : dat.GUI;
    updateControlls = new Array<dat.Controller>();
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
            this.folerCapabilities.hide();
            for(const item of keys){ 
                this.updateControlls.push(this.folerCapabilities.add(capabilities, item));
            }
        } 
    }

    clear(){
        while( this.updateControlls.length > 0){
            let item = this.updateControlls.pop();
            item?.destroy();
            //item?.remove();
        } 

        this.folerCapabilities?.destroy();
        this.panel?.destroy();
    }

    dispose(){
        this.clear();
    }
}



export class WorldScreenDebug extends DebugUpdater {
    
    screenMonitor? : RendererDisplayValue; 
    
    constructor( screen : WorldScreen, debugUpdate : DebugUpdater, folders : DebugGUIFolders){
        super(debugUpdate)
        const scope = this;
        if(folders.monitorFolder){
             this.screenMonitor = new RendererDisplayValue(folders.monitorFolder, screen);
        } 
    }

    update(){ 
        this.screenMonitor?.update();
        super.update();
    }
    
    dispose(){ 
        super.dispose();
        this.screenMonitor?.dispose(); 
    }
}