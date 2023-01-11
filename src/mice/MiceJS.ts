import * as THREE from "three";
import { Vector3 } from "three";
import { ThreeEngine } from "../threeJS/ThreeEngine";




export class MiceJS{
    engine? : ThreeEngine = undefined;

    constructor(){

    }
    
    init(viewDock: any){
        this.engine = new ThreeEngine();
        this.engine.init(viewDock);

        let s = 0.012;
        let loadScale = new THREE.Vector3(s, s, s);
        this.engine.loadGLB('assets/models/mice-example/company.glb', (object)=>{
            //object.scale.copy(loadScale);
            object.position.copy(new THREE.Vector3(15,0,0));
        });

        // this.engine.loadFBX('assets/models/mice-example/company.FBX', (object)=>{
        //     object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(15,0,0));
        // });
        // this.engine.loadFBX('assets/models/mice-example/company_2.FBX', (object)=>{
        //     object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(-15,0,0));
        // });
        this.engine.loadGLB('assets/models/mice-example/company_2.glb', (object)=>{
            //object.scale.copy(loadScale);
            object.position.copy(new THREE.Vector3(-15,0,0));
        });
        this.engine.loadFBX('assets/models/mice-example/Pop_Soft.FBX', (object)=>{
            object.scale.copy(loadScale);
            object.position.copy(new THREE.Vector3(0,0,15));
        });
        // this.engine.loadGLB('assets/models/mice-example/Pop_Soft.glb', (object)=>{
        //     //object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(0,0,15));
        // });
        this.engine.loadFBX('assets/models/mice-example/Tobortec.FBX', (object)=>{
            object.scale.copy(loadScale);
            object.position.copy(new THREE.Vector3(0,0,-15));
        });
        // this.engine.loadGLB('assets/models/mice-example/Tobortec.glb', (object)=>{
        //     //object.scale.copy(loadScale);
        //     object.position.copy(new THREE.Vector3(0,0,-15));
        // });

        //this.engine.loadGLB('assets/models/mice-example/mice-bg.glb');

        const r = 'assets/textures/cube/Park3Med/';

        const urls = [
            r + 'px.jpg', r + 'nx.jpg',
            r + 'py.jpg', r + 'ny.jpg',
            r + 'pz.jpg', r + 'nz.jpg'
        ];
        this.engine.loadCubeTexture(urls);
    } 
}