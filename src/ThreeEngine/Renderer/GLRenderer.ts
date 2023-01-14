import * as THREE from "three";
import { Camera, Renderer, WebGLRenderer, WebGLRendererParameters } from "three";
import { Object3D } from "three/src/Three";
import { World } from "../World/World";

 
 export class GLRenderer  { 
    private renderer? : WebGLRenderer = undefined;
    private world? : World = undefined; 
    private camera? : Camera= undefined; 
    private targetSize = new THREE.Vector2();
    //{ antialias: true }
    constructor(parameters?: WebGLRendererParameters, viewDock? : HTMLElement | null){
        this.renderer = new WebGLRenderer(parameters);
        this.renderer.shadowMap.autoUpdate = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        //renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 2;
        this.renderer.setPixelRatio( window.devicePixelRatio );//안해주면 모바일에서 흐리게 보임

        this.renderer.setSize( window.innerWidth, window.innerHeight);
        
        viewDock?.appendChild( this.renderer.domElement );
 
    }
     
    dispose(){
        this.world = undefined;
        this.camera = undefined;
        let domElement = this.renderer?.domElement;
       this.renderer?.dispose();
       if(domElement){
        domElement.remove();
       }
    }

    getWorld(){
        return this.world;
    }

    setScene(scene? : World | undefined){
        this.world = scene;
    }

    render(){
        if(!this.world){
            return;
        }

        const renderScene = this.world.getScene();
 
        if(renderScene && this.camera){ 
            this.renderer?.render(renderScene, this.camera);
        } 
    }

    getScene() : World | undefined{
        return this.world;
    }

    getDomElement() : HTMLCanvasElement | undefined{
        if(!this.renderer){
            return undefined;
        }
        return this.renderer.domElement;
    }

    setCamera(camera : Camera){
        this.camera = camera;
    }

    getWebglRenderer(): WebGLRenderer | undefined {
        if(!this.renderer){
            return undefined;
        }
        return this.renderer;
    }

    setSize(width: number, height: number){ 
        this.renderer?.setSize(width, height); 
        this.renderer?.getSize(this.targetSize);
        
        if(this.camera instanceof THREE.PerspectiveCamera){
            this.camera.aspect = this.targetSize.x /this.targetSize.y;
            this.camera.updateProjectionMatrix();
        } 
    } 
    
 }