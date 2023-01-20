import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders'; 
import { Camera } from '@mui/icons-material';
 
import { Player } from './characterController';
import { PlayerInput } from './inputController';
import { Matrix, Mesh, MeshBuilder, Quaternion, SceneLoader, TransformNode, Vector3 } from 'babylonjs';
import MobileDetect from 'mobile-detect';
 

class CustomLoadingScreen implements BABYLON.ILoadingScreen {
    //optional, but needed due to interface definitions
    loadingUIBackgroundColor: string = '';
    constructor(public loadingUIText: string) {}
    public displayLoadingUI() {
      //alert(this.loadingUIText);
    }
  
    public hideLoadingUI() {
      //alert("Loaded!");
    }
  }

export class BabylonExample {
    engine? : BABYLON.Engine;
    private _input?: PlayerInput;
    private _player?: Player;
    
    run(canvas : HTMLCanvasElement){
        const scope = this;
        // Load the 3D engine
        scope.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
        scope.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);// 모바일 흐려짐 방지

        scope.engine.hideLoadingUI();
        let loadingScreenDiv = window.document.getElementById("loadingScreen");
        function customLoadingScreen() {
            console.log("customLoadingScreen creation")
        }
        customLoadingScreen.prototype.displayLoadingUI = function () {
            console.log("customLoadingScreen loading")
            loadingScreenDiv!.innerHTML = "loading";
        };
        customLoadingScreen.prototype.hideLoadingUI = function () {
            console.log("customLoadingScreen loaded")
            loadingScreenDiv!.style.display = "none";
        };
        var loadingScreen = new CustomLoadingScreen('sunjoo');
        scope.engine!.loadingScreen = loadingScreen;

        scope.engine!.displayLoadingUI();
        var md = new MobileDetect(window.navigator.userAgent);

        // CreateScene function that creates and return the scene
        var createScene = function(){
            // Create a basic BJS Scene object
            var scene = new BABYLON.Scene(scope.engine!);
            let rootNode = new TransformNode('root', scene);
            
            rootNode.scaling.scaleInPlace(3);
            // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
            //var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, -2), scene);
            var camera = new BABYLON.ArcRotateCamera('camera1', 0, Math.PI / 2.5,5, new BABYLON.Vector3(0, 0, -0), scene);
            camera.setPosition(new BABYLON.Vector3(0, 3, 7)); 
           //scene.debugLayer!.show();
 
            //standard camera setting
            camera.wheelPrecision = 15;
            camera.checkCollisions = true;
            //make sure the keyboard keys controlling camera are different from those controlling player
            //here we will not use any keyboard keys to control camera
            camera.keysLeft = [];
            camera.keysRight = [];
            camera.keysUp = [];
            camera.keysDown = [];
            //how close can the camera come to player
            camera.lowerRadiusLimit = 1.112;
            //how far can the camera go from the player
            camera.upperRadiusLimit = 30;
 
            camera.attachControl();
            camera.parent = rootNode;

            var light0 = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(0, 1, 0), scene);
            light0.intensity = 0.25;
            let ortho = 0.00001;
            var light = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(-0.35, -1, -1), scene);
            light.autoUpdateExtends = false;
            light.position = new BABYLON.Vector3(200, 400, 200);
            light.intensity = 3.0;
            light.diffuse.r = 0.75;
            light.diffuse.g = 0.75;
            light.diffuse.b = 0.75;
            light.autoUpdateExtends = true;
           console.log('/light.shadowFrustumSize', light.shadowFrustumSize);
           const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
           const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
           skyboxMaterial.backFaceCulling = false;
           skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/cube/Park3Med/1", scene);
           skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
           skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
           skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
           skyboxMaterial.disableLighting = true;
           skybox.material = skyboxMaterial;
           skybox.receiveShadows = false;
 
            // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
           // var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
            // Move the sphere upward 1/2 of its height
           // sphere.position.y = 1;
            // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
            let groundSize = 10000;
            var ground = BABYLON.MeshBuilder.CreateGround('ground1', {width:groundSize, height:groundSize, subdivisions:2, updatable:false}, scene);
            ground.checkCollisions = true;
            ground.receiveShadows = true;
            ground.material = new BABYLON.StandardMaterial("ground", scene);	 
  
            
            let shadowGenerator : BABYLON.ShadowGenerator;

            if(md.mobile()){
                shadowGenerator = new BABYLON.ShadowGenerator(4096, light, false);
                shadowGenerator.filter = BABYLON.ShadowGenerator.FILTER_NONE; 
                shadowGenerator.darkness = 0.39;
            }
            else{
                    shadowGenerator = new BABYLON.ShadowGenerator(8192, light, false);

                {
                    shadowGenerator.filter = BABYLON.ShadowGenerator.FILTER_PCF;
                    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;  
                   
                }

                {

                    // shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH; 
                    // shadowGenerator.blurBoxOffset = 1;
                    // shadowGenerator.blurScale = 2;
                    // shadowGenerator.contactHardeningLightSizeUVRatio = 0.12;
                }

            }

 
 
            let rootUrl = 'assets/models/mice-example/';
            scope.loadModel(rootUrl,  "company.glb", scene, rootNode, shadowGenerator, new BABYLON.Vector3(0,0,-15)); 
            scope.loadModel(rootUrl,  "company_2.glb", scene, rootNode, shadowGenerator,new BABYLON.Vector3(-15,0,0)); 
            scope.loadModel(rootUrl,  "Pop_Soft.glb", scene, rootNode, shadowGenerator,new BABYLON.Vector3(0,0,15)); 
            scope.loadModel(rootUrl,  "Tobortec.glb", scene, rootNode, shadowGenerator, new BABYLON.Vector3(15,0,0) ); 
            scope._loadCharacterAssets(scene, rootNode, camera, shadowGenerator); 
 
            // Return the created scene
            return scene;
        }

        // call the createScene function
        var scene = createScene();
        
        
        // run the render loop
        scope.engine.runRenderLoop(function(){
            scope._player?.update();
            scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function(){
            scope.engine!.resize();
        });
    }


    loadModel(rootUrl : string, name : string, scene : BABYLON.Scene, rootNode : TransformNode, shadowGenerator? : BABYLON.ShadowGenerator, pos? : BABYLON.Vector3, onLoaded?: (meshes: BABYLON.AbstractMesh[])=>void){
        const scope = this;
        const v = BABYLON.SceneLoader.ImportMesh('', rootUrl, name, scene, function (scene) {
            // Create a default arc rotate camera and light.
            //scene.createDefaultCameraOrLight(true, true, true);

            // The default camera looks at the back of the asset.
            // Rotate the camera by 180 degrees to the front of the asset.
            //scene.activeCamera.alpha += Math.PI;
 
            if(scene.length > 0){
                if(pos){
                    scene[0].position.copyFrom(pos);
                     
                }

                scene[0].parent = rootNode;
                
                for(let mesh of scene){
                    if(shadowGenerator){
                        shadowGenerator.addShadowCaster(mesh);
                    }
                    mesh.receiveShadows = true;
                    mesh.checkCollisions = true;
                    let typeName = typeof(mesh);
 
                    if(mesh instanceof BABYLON.Mesh){
                        shadowGenerator?.getShadowMap()!.renderList!.push(mesh); 
                    }
                }

            }
            if(onLoaded){
                onLoaded(scene);
            }
        } ,  

         function (evt) {
            scope.engine!.hideLoadingUI();
            // onProgress
            let loadedPercent = 0;
            if (evt.lengthComputable) {
                //loadedPercent = (evt.loaded * 100 / evt.total).toFixed();
            } else {
                var dlCount = evt.loaded / (1024 * 1024);
                loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
            }
            // assuming "loadingScreenPercent" is an existing html element
            //document!.getElementById("loadingScreenPercent")!.innerHTML = loadedPercent;
        } );
    }


    
    private async _loadCharacterAssets(scene : any, rootNode : TransformNode, camera : BABYLON.ArcRotateCamera, shadowGenerator? : BABYLON.ShadowGenerator): Promise<any> {
        const scope = this;
        async function loadCharacter() {
            //collision mesh
            const outer = MeshBuilder.CreateBox("outer", { width: 1, depth: 1, height: 3 }, scene);
            outer.isVisible = false;
            outer.isPickable = false;
            outer.checkCollisions = true;

            //move origin of box collider to the bottom of the mesh (to match player mesh)
            outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))
            //for collisions
            outer.ellipsoid = new Vector3(1, 1.5, 1);
            outer.ellipsoidOffset = new Vector3(0, 1.5, 0);
            outer.position.copyFrom(new Vector3(-1.293, 0.030, 1.447));
            outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
 
            let characterRootUrl = 'assets/models/character/';
            //--IMPORTING MESH--
            return SceneLoader.ImportMeshAsync(null, characterRootUrl, "Xbot.glb", scene).then((result) =>{
                const root = result.meshes[0];
 
                
                //body is our actual player mesh
                const body = root;
                body.parent = outer;
                body.isPickable = false;
                body.isVisible = false;
                body.getChildMeshes().forEach(m => {
                    m.isPickable = false;
                })
                result.animationGroups[2].play(true);
                
                for(let mesh of result.meshes){
 
                    mesh.receiveShadows = false;
                    mesh.checkCollisions = false; 
                    shadowGenerator?.addShadowCaster(mesh);
 
                }

                //return the mesresulth and animations
                return {
                    mesh: outer as Mesh,
                    animationGroups: result.animationGroups
                }
            });
        }

        return loadCharacter().then(assets => {
            scope.initCharacterController(assets, camera, scene, shadowGenerator, rootNode);
            console.log('assets');
        });
    }
    
    initCharacterController(assets : any, camera : BABYLON.ArcRotateCamera, scene : BABYLON.Scene, shadowGenerator? : BABYLON.ShadowGenerator, rootNode? : TransformNode){
        
       this._input = new PlayerInput(scene); //detect keyboard/mobile inputs
        this._player = new Player(assets, scene, shadowGenerator, this._input, camera);
        this._player.activatePlayerCamera();
        if(rootNode){
            this._player.parent = rootNode;
        }
    }

 
}