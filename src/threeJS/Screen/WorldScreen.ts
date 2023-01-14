import { WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderUpdateData } from "../Common/EngineDefine";
import { IUpdate } from "../Common/IUpdate";
import { GLRenderer } from "../Renderer/GLRenderer";
import { World } from "../World/World";



export class WorldScreen implements IUpdate<RenderUpdateData>{
    viewDock? : HTMLElement | null = undefined;
    renderer? : GLRenderer;
    controls? : OrbitControls;
    name : string = '';

    constructor(viewDock? : HTMLElement | null, sceneSource? : World  | undefined){
        this.viewDock = viewDock;
        this.init();
        this.setRenderScene(sceneSource);
        sceneSource?.addRenderUpdate(this);
    }

    setName (name : string){
        this.name = name;
     }

     getName(){
        return this.name;
     }

     getWorld() :World | undefined {
        if(!this.renderer){
            return undefined;
        }
        return this.renderer.getWorld();
     }
     
     getWorldName() : string {
        if(!this.renderer){
            return '';
        }
        const world = this.renderer.getWorld();
        if(!world){
            return '';
        }

        return world.getName();
     }

    dispose(){
        this.controls?.dispose();
        this.renderer?.dispose();
        this.viewDock = undefined; 
    }

    isWorld(destWorld : World) :boolean{
        if(!this.renderer){
            return false;
        }

        return this.renderer.getWorld() === destWorld;
    }

    init(){ 
        this.renderer = new GLRenderer({ antialias: true }, this.viewDock);
    }

    setOrbitControls(cam: THREE.Camera): boolean{
        const scope = this;

        let scene = this.renderer?.getScene();
        let domElem = this.renderer?.getDomElement();

        if(!scene){
            return false;
        }
        if(!domElem){
            return false;
        }
 
        scope.controls = new OrbitControls( cam, domElem );
        //this.controls.addEventListener( 'change', render );
        scope.controls.target.set( 0, 0.2, 0 );
        cam.position.set(-10.041, 10.9, -0.01);
        scope.controls.update(); 
        this.renderer?.setCamera(cam);

        return true;
    }

    setRenderScene(sceneSource : World  | undefined){
        this.renderer?.setScene(sceneSource);
    }

    //override IUpdate
    beginUpdate():void{

    }

    //override IUpdate
    update(updateData : RenderUpdateData):void{
        this.renderer?.render();
    }

    //override IUpdate
    finishUpdate():void{
        
    }
 
    getWebglRenderer(): WebGLRenderer | undefined {
        if(!this.renderer){
            return;
        }

        return this.renderer.getWebglRenderer();
    }
}