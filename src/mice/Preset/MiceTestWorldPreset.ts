import * as THREE from "three";
import  {Vector3}  from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Preset, ShadowParam } from "../../ThreeJS/Common/Preset";
import { ThreeEngine } from "../../ThreeJS/Engine/ThreeEngine";
import { World } from "../../ThreeJS/World/World";
import { WorldScreen } from "../../ThreeJS/Screen/WorldScreen";
import { WorldPreset } from "../../ThreeJS/World/WorldPreset";
import { RotateComponent } from "../Component/RotateComponent";

export class MiceTestWorldPreset extends WorldPreset{
    viewDock? : HTMLElement | null;
    constructor(engine : ThreeEngine, world : World, data : HTMLElement){
        super();
        this.viewDock = data;
        this.preset(engine, world);
    }

    preset(engine : ThreeEngine, world : World){ 
        // this.addScreen(SceneScreen, viewDock, miceTestScene);
        //engine.addScreen<>
        const scope = this; 
 
        const bgPath = 'assets/textures/cube/Park3Med/';
        const cubeTurls = [
            bgPath + 'px.jpg', bgPath + 'nx.jpg',
            bgPath + 'py.jpg', bgPath + 'ny.jpg',
            bgPath + 'pz.jpg', bgPath + 'nz.jpg'
        ];
        
        world.setName('MiceTestWorldPreset');
        world.setScene(new THREE.Scene());
        world.setRootObject(world.getScene());
 
        world.addToScene( Preset.directionalLightSimple(new Vector3( 30, 60, 30), 0xffeeff, 1.8,  new ShadowParam()) ); 
        world.add(Preset.MeshPlane(400, 0xbbbbbb, true, true)); 
        world.loadCubeBackground(cubeTurls);

        let s = 0.012;
        let loadScale = new Vector3(s, s, s);
        world.loadGLB('assets/models/mice-example/company.glb', (object)=>{
            //object.scale.copy(loadScale);
            object.position.copy(new Vector3(15,0,0));
            world.addComponent(RotateComponent, object);
        });

        // this.engine.loadFBX('assets/models/mice-example/company.FBX', (object)=>{
        //     object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(15,0,0));
        // });
        // this.engine.loadFBX('assets/models/mice-example/company_2.FBX', (object)=>{
        //     object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(-15,0,0));
        // });
        world.loadGLB('assets/models/mice-example/company_2.glb', (object)=>{
            //object.scale.copy(loadScale);
            object.position.copy(new Vector3(-15,0,0));
        });
        world.loadFBX('assets/models/mice-example/Pop_Soft.FBX', (object)=>{
            object.scale.copy(loadScale);
            object.position.copy(new Vector3(0,0,15));
        });
        // this.engine.loadGLB('assets/models/mice-example/Pop_Soft.glb', (object)=>{
        //     //object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(0,0,15));
        // });
        world.loadFBX('assets/models/mice-example/Tobortec.FBX', (object)=>{
            object.scale.copy(loadScale);
            object.position.copy(new Vector3(0,0,-15));
        });
        // this.engine.loadGLB('assets/models/mice-example/Tobortec.glb', (object)=>{
        //     //object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(0,0,-15));
        // });

        //this.engine.loadGLB('assets/models/mice-example/mice-bg.glb');
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
        let screen = engine.addScreen(WorldScreen, this.viewDock, world);
        screen.setName('MiceTestWorldPreset');
        screen.setOrbitControls(camera);
    }

 

}