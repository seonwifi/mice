import * as THREE from "three";
import { Euler } from "three";
import { Vector3 } from "three";
import { WebGLRenderer, WebGLRendererParameters } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Activity } from "../Activity/Activity";
import { DebugGUIFolders } from "../Debug/DebugGUI";
import { DebugUpdater } from "../Debug/DebugUpdater";
import { RenderUpdateData } from "../Common/EngineDefine";
import { IUpdate } from "../Common/IUpdate";
import { GLRenderer } from "../Renderer/GLRenderer";
import { World } from "../World/World";
import { WorldScreenDebug } from "../Debug/WorldScreenDebug";



export class WorldScreen implements IUpdate<RenderUpdateData>{
    htmlView? : HTMLElement | null = undefined;
    renderer? : GLRenderer;
    controls? : OrbitControls;
    name : string = '';
    _onWindowResize : any;
    worldScreenDebug? : WorldScreenDebug;
    
    constructor(activity : Activity, htmlView? : HTMLElement | null, sceneSource? : World  | undefined){
 
        this.htmlView = htmlView;
        this.init();
        this.setRenderScene(sceneSource);
        sceneSource?.addRenderUpdate(this);
        this._onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener( 'resize', this._onWindowResize );
        const scope = this;

        activity.requestFolders((debugUpdate? : DebugUpdater, rootFolder? : DebugGUIFolders)=>{
            if(!debugUpdate || !rootFolder){
                return;
            }

            if(!this.worldScreenDebug){
                this.worldScreenDebug = new WorldScreenDebug(this, debugUpdate, rootFolder);
            }
        });
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
        this.worldScreenDebug?.dispose();
        window.removeEventListener( 'resize', this._onWindowResize );

        this.controls?.dispose();
        this.renderer?.dispose();
        this.htmlView = undefined; 
    }

    isWorld(destWorld : World) :boolean{
        if(!this.renderer){
            return false;
        }

        return this.renderer.getWorld() === destWorld;
    }

    init(){ 

        let  parameters : WebGLRendererParameters = {
            antialias: true,
            
        }

        //htmlView 가 HTMLCanvasElement 이면 직접 그리는 세팅으로 사용  그렇지 않으면 부모로 사용 
        let parent : HTMLElement | undefined | null = undefined; 
        if(this.htmlView instanceof HTMLCanvasElement){
            parameters.canvas = this.htmlView as HTMLCanvasElement;
        }
        else{
            parent = this.htmlView;
        }

        this.renderer = new GLRenderer(parameters, parent);
    }

    setOrbitControls(cam: THREE.Camera, pos : Vector3, target : Vector3): boolean{
        const scope = this;

        let scene = this.renderer?.getScene();
        let domElem = this.renderer?.getDomElement();

        if(!scene){
            return false;
        }
        if(!domElem){
            return false;
        }
        cam.position.copy(pos);
        //cam.rotation.copy(rot);
        scope.controls = new OrbitControls( cam, domElem );
        //this.controls.addEventListener( 'change', render );
        scope.controls.target.copy(target);
       
        scope.controls.update(); 
        scope.renderer?.setCamera(cam);
  
        return true;
    }

    onWindowResize(e : UIEvent){

        // this.renderer?.getWorld()?.traverse((item)=> {
        //     if(item instanceof THREE.PerspectiveCamera){
        //         let cam = item as THREE.PerspectiveCamera;
        //         cam.aspect = window.innerWidth / window.innerHeight;
        //         cam.updateProjectionMatrix();
        //     }
        // });
        if(!this.renderer){
            return;
        }

        let dom = this.renderer.getDomElement();
        if(this.htmlView){ 
             let boundingRect = this.htmlView.getBoundingClientRect();
            //this.renderer?.setSize( boundingRect.width, boundingRect.height );
           this.renderer?.setSize( this.htmlView.clientWidth, this.htmlView.clientHeight );
           //this.renderer?.setSize( window.innerWidth, window.innerHeight);
        }
        else{
            //this.renderer?.setSize( window.innerWidth, window.innerHeight);
        }
        
    }

    setRenderScene(world : World  | undefined){
        this.renderer?.setScene(world);
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