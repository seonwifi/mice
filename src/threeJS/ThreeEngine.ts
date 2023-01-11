import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 

export class ThreeEngine{

    private rootObj? : THREE.Object3D;
    private controls? : OrbitControls;
    private scene? : THREE.Scene;

    constructor(){ 
    }

    init(viewDock: any){
        const scope = this;
        scope.scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
        var renderer = new THREE.WebGLRenderer();

        scope.controls = new OrbitControls( camera, renderer.domElement );
        //this.controls.addEventListener( 'change', render );
        scope.controls.target.set( 0, 0.2, 0 );
        camera.position.set(-10.041, 10.9, -0.01);
        scope.controls.update(); 

        const directionalLight1 = new THREE.DirectionalLight( 0xffeeff, 0.8 );
        directionalLight1.position.set( 1, 1, 1 );
        scope.scene.add( directionalLight1 );

        const ambient = new THREE.AmbientLight( 0x777777 );
        scope.scene.add( ambient );
        
        
        renderer.setSize( window.innerWidth, window.innerHeight);
        viewDock.appendChild( renderer.domElement );
         //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
         //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
         //var cube = new THREE.Mesh( geometry, material );
         //scope.scene.add( cube );

         scope.rootObj = new THREE.Group();
        //  scope.rootObj.scale.x = 0.01;
        //  scope.rootObj.scale.y = 0.01;
        //  scope.rootObj.scale.z = 0.01;

         scope.scene.add( scope.rootObj );
         camera.position.z = 5;

         let renderScene = scope.scene;
        var animate = function () {
          requestAnimationFrame( animate );
          //cube.rotation.x += 0.01;
          //cube.rotation.y += 0.01;
          if(renderScene){
            renderer.render( renderScene, camera );
          }
        };
        animate();
    }

    loadCubeTexture(urls : string[]){ 
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
            // model.position.set( 1, 1, 0 );
            // model.scale.set( 0.01, 0.01, 0.01 );
            // scene.add( model );

            // mixer = new THREE.AnimationMixer( model );
            // mixer.clipAction( gltf.animations[ 0 ] ).play();

            // animate();

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

    add(obj: THREE.Object3D){ 
        this.rootObj?.add(obj);
    }

}