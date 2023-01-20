import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 

export class ThreeExample{

    private rootObj? : THREE.Object3D;
    private controls? : OrbitControls;
    private scene? : THREE.Scene;
    
    constructor(){ 
    }

    async runAsync(viewDock: any){

        const scope = this; 
 
        const bgPath = 'assets/textures/cube/Park3Med/';
        const cubeTurls = [
            bgPath + 'px.jpg', bgPath + 'nx.jpg',
            bgPath + 'py.jpg', bgPath + 'ny.jpg',
            bgPath + 'pz.jpg', bgPath + 'nz.jpg'
        ];

        scope.scene = new THREE.Scene();
        scope.rootObj = new THREE.Group(); 
        scope.scene.add( scope.rootObj );

        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.autoUpdate = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.VSMShadowMap; 
        renderer.toneMappingExposure = 2;
        renderer.setPixelRatio( window.devicePixelRatio );//안해주면 모바일에서 흐리게 보임

        renderer.setSize( window.innerWidth, window.innerHeight);

        const directionalLight1 = new THREE.DirectionalLight( 0xffeeff, 1.8 );
        directionalLight1.position.set( 30, 60, 30 );
        
        directionalLight1.castShadow = true;
        directionalLight1.shadow.camera.top     = 17;
        directionalLight1.shadow.camera.bottom  = -17;
        directionalLight1.shadow.camera.left    = -17;
        directionalLight1.shadow.camera.right   = 17;
        directionalLight1.shadow.camera.near = 0.1;
        directionalLight1.shadow.camera.far = 500;
        directionalLight1.shadow.bias = -0.0001;
        directionalLight1.shadow.mapSize.width = 1024;
        directionalLight1.shadow.mapSize.height = 1024;
        directionalLight1.shadow.radius = 3;
        directionalLight1.shadow.blurSamples = 8;
        directionalLight1.shadow.normalBias = 0.001;
        scope.scene.add( directionalLight1 );

        const ambient = new THREE.AmbientLight( 0x555555 );
        scope.scene.add( ambient );

        const material = new THREE.MeshPhongMaterial( { color: 0xbbbbbb  } );
        const planeSize : number = 400;
        const geometry = new THREE.PlaneGeometry( planeSize, planeSize );
        geometry.rotateX(  -Math.PI / 2 );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.receiveShadow = true; 
        scope.rootObj?.add(mesh);

        let s = 0.012;
        let loadScale = new THREE.Vector3(s, s, s);
        scope.loadGLB('assets/models/mice-example/company.glb', (object)=>{ 
            object.position.copy(new THREE.Vector3(15,0,0)); 
        });

 
        scope.loadGLB('assets/models/mice-example/company_2.glb', (object)=>{ 
            object.position.copy(new THREE.Vector3(-15,0,0));
        });

        scope.loadFBX('assets/models/mice-example/Pop_Soft.FBX', (object)=>{
            object.scale.copy(loadScale);
            object.position.copy(new THREE.Vector3(0,0,15));
        });
 
        scope.loadFBX('assets/models/mice-example/Tobortec.FBX', (object)=>{
            object.scale.copy(loadScale);
            object.position.copy(new THREE.Vector3(0,0,-15));
        }); 

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }
        window.addEventListener( 'resize', onWindowResize );
  
        scope.controls = new OrbitControls( camera, renderer.domElement );
        scope.controls.target.set( 0, 0.2, 0 );
        camera.position.set(-10.041, 10.9, -0.01);
        scope.controls.update(); 
        scope.scene.add( camera );
  
        viewDock.appendChild( renderer.domElement ); 
        camera.position.z = 5;
 
         let renderScene = scope.scene;
        var animate = function () {
          requestAnimationFrame( animate ); 
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

}