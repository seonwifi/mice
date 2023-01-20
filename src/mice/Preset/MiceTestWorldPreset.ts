import * as THREE from "three";
import  {Vector3}  from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Preset, ShadowParam } from "../../Base/ThreeEngine/Common/Preset";
import { ThreeEngine } from "../../Base/ThreeEngine/Engine/ThreeEngine";
import { World } from "../../Base/ThreeEngine/World/World";
import { WorldScreen } from "../../Base/ThreeEngine/Screen/WorldScreen";
import { IWorldPreset } from "../../Base/ThreeEngine/World/WorldPreset";
import { RotateComponent } from "../Component/RotateComponent";
import { Activity } from "../../Base/ThreeEngine/Activity/Activity";
import { DebugGUIPreset } from "../../Base/ThreeEngine/Debug/DebugGUI";
import { DebugUpdater } from "../../Base/ThreeEngine/Debug/DebugUpdater";
import * as dat from 'lil-gui';

export class MiceTestWorldPreset implements IWorldPreset{
 
    constructor(activity : Activity, engine : ThreeEngine, world : World, htmlViews : HTMLElement[]){
 
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
            //world.addComponent(RotateComponent, object);
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

        for(let i = 0; i < htmlViews.length; ++i){
            let htmlView =htmlViews[i];
            var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
            let screen = activity.addScreen(WorldScreen, htmlView, world);
            screen.setName('MiceTestWorldPreset');
            screen.setOrbitControls(camera, new Vector3(22.47843608, 8.40550714, 16.23509392), new Vector3(-0.21982984, 0.19587257, 1.06576977));

            
            world.requestDebugGUI((debugUpdate? : DebugUpdater, rootFolder? : dat.GUI)=>{
                if(!debugUpdate || !rootFolder){
                    return;
                }
                
                rootFolder = rootFolder.addFolder('Orbit Camera Control ' + i);  
                rootFolder.open();
                DebugGUIPreset.trackVector3(camera.position, 'Camera Position', debugUpdate, rootFolder);
                if(screen.controls){
                    DebugGUIPreset.trackVector3(screen.controls.target, 'Camera Target', debugUpdate, rootFolder);
                }
                DebugGUIPreset.trackEuler(camera.rotation, 'Camera Rotateion', debugUpdate, rootFolder);
                DebugGUIPreset.trackQuaternion(camera.quaternion, 'Camera Quaternion', debugUpdate, rootFolder);
                
                // {
                //     let folder = panel.addFolder('Camera Rotate');
                //     folder.open();
                //     debugGUI.addDebugUpdate(folder.add(camera.rotation, 'x'), true, camera.rotation, (debugGUI : DebugGUI,  controller? : dat.GUIController, userData? : Euler)=>{
                        
                //     }).controller?.step(0.00001);

                //     debugGUI.addDebugUpdate(folder.add(camera.rotation, 'y'), true, camera.rotation, (debugGUI : DebugGUI,  controller? : dat.GUIController, userData? : Euler)=>{
                        
                //     }).controller?.step(0.00001);

                //     debugGUI.addDebugUpdate(folder.add(camera.rotation, 'z'), true, camera.rotation, (debugGUI : DebugGUI,  controller? : dat.GUIController, userData? : Euler)=>{
                        
                //     }).controller?.step(0.00001);
                // }

            }); 
        }
 

    }

 

    dispose(){

    }

}