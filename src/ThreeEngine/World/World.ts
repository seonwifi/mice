import { Object3D, Scene,  } from "three";
import * as THREE from "three";
import { eScenePlayState, RenderUpdateData } from "../Common/EngineDefine";
import { UpdateManager } from "../Common/UpdateManager";
import { BehaviorUpdateData } from "../Component/Behavior";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Camera } from "@react-three/fiber";
import { IUpdate } from "../Common/IUpdate";
import { ThreeEngine } from "../Engine/ThreeEngine";
import { IComponent } from "../Component/IComponent";
import { ComponentManager } from "../Component/ComponentManager";
import { ObjectComponent } from "../Component/ObjectComponent";
import { DeltaTimer } from "../Common/DeltaTimer";
import { ThreeJsStatic } from "../Common/ThreeJsStatic";
import { FPSManager } from "../Common/FPSManager";
import { Timer } from "../Common/Timer";
 
export class World
{
    private     name : string = '';
    private     scene?: Scene;
    private     objectUpdateManager = new UpdateManager<BehaviorUpdateData>();
    private     renderUpdateManager = new UpdateManager<RenderUpdateData>();
    private     objectUpdateData = new BehaviorUpdateData(); 
    private     renderUpdateData = new RenderUpdateData(); 
    private     playState : eScenePlayState = eScenePlayState.Pause;

    private     rootObj? : THREE.Object3D; 
    private     renderCamera? : Camera;
    private     deltaTimer = new DeltaTimer();
    protected   engine? : ThreeEngine;
    private     fpsManager = new FPSManager();
    private     updateCount : number = 0;
    private     playTime : number = 0;
    private     timer = new Timer();

    constructor(engine : ThreeEngine){
        this.engine = engine;
        let scope = this; 
        if(scope.playState === eScenePlayState.Play){
             this.startUpdate();
        } 

        this.timer.start();
     }

     setName (name : string){
        this.name = name;
     }
     getName() : string {
        return this.name;
     }

     dispose(){
        this.pause();
        //this.scene?.dispose();

        this.objectUpdateManager.removeAll();
        this.renderUpdateManager.removeAll(); 
      
        this.engine?.removeScreenInWorld(this);
        ThreeJsStatic.disposeObject(this.scene);
        this.scene = undefined;
        this.rootObj = undefined;
        this.renderCamera = undefined; 
        this.engine = undefined; 
    }

     createSceneCamera() : THREE.Camera {
        let cam = new THREE.Camera();
        this.scene?.add(cam);
        return cam;
     }
     addObjectUpdate( objectUpdate : IUpdate<BehaviorUpdateData> ){
        this.objectUpdateManager.addUpdate(objectUpdate);
     }
     removeObjectUpdate( objectUpdate : IUpdate<BehaviorUpdateData> ){
        this.objectUpdateManager.removeUpdate(objectUpdate);
     }

     addRenderUpdate( renderUpdate : IUpdate<RenderUpdateData> ){
        this.renderUpdateManager.addUpdate(renderUpdate);
     }
 
     removeRenderUpdate( renderUpdate : IUpdate<RenderUpdateData> ){
        this.renderUpdateManager.removeUpdate(renderUpdate);
     }

     getScene(): Scene | undefined{
        return this.scene;
     }

     getRenderCamera(): Camera | undefined {
        return this.renderCamera;
     }
     
     protected startUpdate(){
         let scope = this;
         var updateFunction = function () {
            if(scope.playState === eScenePlayState.Play){
                requestAnimationFrame( updateFunction ); 
 
                scope.update();
            }  
         }; 

         this.deltaTimer.start();
         this.fpsManager.start();
         updateFunction();
     }
 
     protected update(){
        this.deltaTimer.update();
        this.objectUpdateData.deltaTime = this.deltaTimer.getDeltaSeconds();
        this.objectUpdateManager.update(this.objectUpdateData);

        this.renderUpdateData.deltaTime = this.deltaTimer.getDeltaSeconds();
        this.renderUpdateManager.update(this.renderUpdateData);
        this.fpsManager.update();
        this.updateCount++;
     }

     getUpdateCount():number{
        return this.updateCount;
     }

     getFPSManager(): FPSManager{
        return this.fpsManager;
     }

     play(){
         this.playState = eScenePlayState.Play;
         this.startUpdate();
     }
     
     pause(){
         this.playState = eScenePlayState.Pause;
     }
 
     loadCubeBackground(urls : string[]){ 
        const scope = this;
        if(!scope.scene){
            return;
        }

        const textureCube = new THREE.CubeTextureLoader().load( urls );
        textureCube.mapping = THREE.CubeRefractionMapping; 
        scope.scene.background = textureCube;
    }

    async loadAsyncGLB(path:string) : Promise<THREE.Object3D> {

        try {
            const dracoLoader = new DRACOLoader();
            const loader = new GLTFLoader();
            loader.setDRACOLoader( dracoLoader );
            let [gltf] = await Promise.all([loader.loadAsync('aaa')]);
            if(gltf){
                return gltf.scene;
            }
            else{
                return new Promise<THREE.Object3D>(function(resolve, reject){
                    reject(null);
                });
            }
        } catch (error) {
            console.error(error);
        }

        return new Promise<THREE.Object3D>(function(resolve, reject){
            reject(null);
        });
    }

    loadGLB(path:string, onLoad: (object: THREE.Group) => void, onProgress?: (event: ProgressEvent) => void,onError?: (event: ErrorEvent) => void){
        if(!this.rootObj){
            console.error('Error Engine this.world is null. try ThreeEngine init.');
            return;
        }
        const scope = this; 

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'assets/examples/jsm/libs/draco/' ); 
        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        loader.load( path, function ( gltf ) {

            const model = gltf.scene; 
            scope.add(model);
            if(onLoad){
                onLoad(model);
            } 
        }, function(event){
            if(onProgress){
                onProgress(event);
            } 
        }, function ( e ) { 
            if(onError){
                onError(e);
            }
            console.error( e ); 
        } );
    }
 

    loadFBX(path:string,  onLoad: (object: THREE.Group) => void, onProgress?: (event: ProgressEvent) => void,onError?: (event: ErrorEvent) => void){
        if(!this.rootObj){
            console.error('Error Engine this.world is null. try ThreeEngine init.');
            return;
        }

        const scope = this; 
        const loader = new FBXLoader();
        loader.load( path, function ( object ) { 
            scope.add( object );
            if(onLoad){
                onLoad(object);
            }
        }, function(event){
            if(onProgress){
                onProgress(event);
            } 
        }, function ( e ) { 
            if(onError){
                onError(e);
            }
            console.error( e ); 
        } );
    }

    add(obj : THREE.Object3D){ 
        if(!obj){
            return;
        }

        obj.traverse((tobj)=>{
            if(tobj instanceof THREE.Mesh){
                let tMesh : THREE.Mesh = tobj  as THREE.Mesh;
                tMesh.castShadow = true; //default is false
                tMesh.receiveShadow = true; //default
            }

        });

        this.rootObj?.add(obj);
    }

    addToScene(obj : THREE.Object3D){ 
        if(!obj){
            return;
        }

        obj.traverse((tobj)=>{
            if(tobj instanceof THREE.Mesh){
                let tMesh : THREE.Mesh = tobj  as THREE.Mesh;
                tMesh.castShadow = true; //default is false
                tMesh.receiveShadow = true; //default
            }

        });

        this.scene?.add(obj);
    }

    setScene(scene :Scene){
        this.scene = scene;
    }

    setRootObject(rootObject? : Object3D){
        this.rootObj = rootObject;
    }

    addComponent<T extends ObjectComponent>(type : (new (object : Object3D, owner : ComponentManager, world : World)=> T), object : Object3D) : T | undefined{
  
        let componentManager : ComponentManager | null = null;
        if(object.userData.com){
            componentManager = object.userData.com; 
        }
        else{
            componentManager= new ComponentManager();
            object.userData.com = componentManager;
        } 
        if(!componentManager){
            return undefined;
        }

        return componentManager.addComponent(type, object, this); 
    }

    removeComponent(component : ObjectComponent){
        if(!component){
            return;
        }

        component.remove(); 
    }

    getSceneObjectCount():number{
        if(!this.scene){
            return 0;
        }
        let objectCount = 0;
        this.scene.traverse((item)=>{
            ++objectCount;
        });

        return objectCount;
    }

    getPlaySeconds() : number {
        return  this.timer.getSeconds();
    }

    traverse( callback : (object: Object3D)=>void){
        let scene = this.getScene(); 
        scene?.traverse(callback);
    }
}