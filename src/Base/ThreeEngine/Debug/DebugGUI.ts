import { Activity } from "../Activity/Activity";
 
import { WorldScreen } from "../Screen/WorldScreen";
import { ScreenManager } from "../Screen/ScreenManager";
import { AnimationClip, Color, KeyframeTrack, Material, Matrix3, Mesh, Vector2, WebGLCapabilities } from "three";
import { World } from "../World/World";
import { WorldManager } from "../World/WorldManager";
 
import { MomoryDebugger } from "./MomoryDebugger";
import { DebugUpdater } from "./DebugUpdater";
import { Vector3 } from "three";
import { Matrix4 } from "three";
import * as dat from 'lil-gui';
import { Texture } from "three";

class Matrix4Track {
    mat : Matrix4;
    n11: number = 0;
    n12: number = 0;
    n13: number = 0;
    n14: number = 0;
    n21: number = 0;
    n22: number = 0;
    n23: number = 0;
    n24: number = 0;
    n31: number = 0;
    n32: number = 0;
    n33: number = 0;
    n34: number = 0;
    n41: number = 0;
    n42: number = 0;
    n43: number = 0;
    n44: number = 0;

    constructor(mat : Matrix4){
        this.mat = mat;
    }
    
    update(){
        this.n11 = this.mat.elements[0];
        this.n12 = this.mat.elements[1];
        this.n13 = this.mat.elements[2];
        this.n14 = this.mat.elements[3];
        this.n21 = this.mat.elements[4];
        this.n22 = this.mat.elements[5];
        this.n23 = this.mat.elements[6];
        this.n24 = this.mat.elements[7];
        this.n31 = this.mat.elements[8];
        this.n32 = this.mat.elements[9];
        this.n33 = this.mat.elements[10];
        this.n34 = this.mat.elements[11];
        this.n41 = this.mat.elements[12];
        this.n42 = this.mat.elements[13];
        this.n43 = this.mat.elements[14];
        this.n44 = this.mat.elements[15];
    }
}

class Matrix3Track {
    mat : Matrix3;
    n11: number = 0;
    n12: number = 0;
    n13: number = 0;
    n21: number = 0;
    n22: number = 0;
    n23: number = 0;
    n31: number = 0;
    n32: number = 0;
    n33: number = 0;

    constructor(mat : Matrix3){
        this.mat = mat;
    }
    
    update(){
        this.n11 = this.mat.elements[0];
        this.n12 = this.mat.elements[1];
        this.n13 = this.mat.elements[2];
        this.n21 = this.mat.elements[3];
        this.n22 = this.mat.elements[4];
        this.n23 = this.mat.elements[5];
        this.n31 = this.mat.elements[6];
        this.n32 = this.mat.elements[7];
        this.n33 = this.mat.elements[8];
    }
}

class ColorGUIHelper {
    object :any;
    prop :any;
    constructor(object:any, prop : any) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

export class DebugGUIPreset {

    static trackVector2(v:Vector2, folderName:string, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){
        let folder = parentFolder.addFolder(folderName);
        if(!openFolder){
            folder.close();
        }
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'x')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'y')).controller?.decimals(8); 
    }
    

    static trackVector3(v:Vector3, folderName:string, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder(folderName);
        if(!openFolder){
            folder.close();
        }

        debugUpdate.addGUIControllerUpdate(folder.add(v, 'x')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'y')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'z')).controller?.decimals(8);
    }

    static trackEuler(v:THREE.Euler, folderName:string, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder(folderName);
        folder.close();

        debugUpdate.addGUIControllerUpdate(folder.add(v, 'x')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'y')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'z')).controller?.decimals(8);
    }

    static trackQuaternion(v:THREE.Quaternion, folderName:string, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder(folderName);
        folder.close();
         
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'x')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'y')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'z')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(v, 'w')).controller?.decimals(8);
    }

    static trackMatrix3(v:THREE.Matrix3, folderName:string, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder(folderName);
        folder.close();
 
        let track = new Matrix3Track(v);
        debugUpdate.addUpdate(()=>{
            track.update();
        });

        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n11')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n12')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n13')).controller?.decimals(8);

        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n21')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n22')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n23')).controller?.decimals(8);

        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n31')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n32')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(track, 'n33')).controller?.decimals(8);


    }

    static trackMatrix4(v:THREE.Matrix4, folderName:string, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder(folderName);
        folder.close();
  
        let matrix4Track = new Matrix4Track(v);
        debugUpdate.addUpdate(()=>{
            matrix4Track.update();
        });
        
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n11')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n12')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n13')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n14')).controller?.decimals(8);

        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n21')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n22')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n23')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n24')).controller?.decimals(8);

        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n31')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n32')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n33')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n34')).controller?.decimals(8);

        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n41')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n42')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n43')).controller?.decimals(8);
        debugUpdate.addGUIControllerUpdate(folder.add(matrix4Track, 'n44')).controller?.decimals(8);
        

    }
 
    static trackKeyframeTrack(keyframeTrack: KeyframeTrack,  num:number, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder('keyframeTrack ' + num + ':' + keyframeTrack.name);
        folder.close();
        folder.add(keyframeTrack, 'ValueTypeName'); 
        folder.add(keyframeTrack, 'DefaultInterpolation');   
    }

    static trackAnimationClip(animationClip: AnimationClip,  num:number, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder('animationClip ' + num + ':' + animationClip.name);
        folder.close();
        folder.add(animationClip, 'uuid'); 
        folder.add(animationClip, 'blendMode'); 
        folder.add(animationClip, 'duration'); 
          
        if(animationClip.tracks.length > 0){
            let tracksFolder = folder.addFolder('tracks');
            for(let i = 0; i < animationClip.tracks.length; ++i){
                DebugGUIPreset.trackKeyframeTrack(animationClip.tracks[i], i, debugUpdate, tracksFolder, false);
            }
        } 
    }

    static trackObjectKey(v: any, debugUpdate : DebugUpdater, parentFolder : dat.GUI, folderName? : string, openFolder : boolean = false){

        let folder : dat.GUI;
        if(folderName){
            folder = parentFolder.addFolder(folderName);
            if(!openFolder){
                folder.close();
            }
        }
        else{
            folder = parentFolder;
        }
 
        let keys = Object.keys(v);

        let colorkeys : string[]= [];
 
        for(const key of keys){
            let vany : any = v; 
            
            let vvv =  vany[key];
            const typeName = typeof(vvv);
            console.log('typeName: ' + typeName);
            if(typeof(vvv) === 'string'){
                folder.add(v, key);
            }
            else if(typeof(vvv) === 'number'){
                folder.add(v, key);
            }
            else if(typeof(vvv) === 'boolean'){
                folder.add(v, key);
            } 
            else if(vvv instanceof Color){
                folder.addColor( new ColorGUIHelper(v, key), 'value').name(key);
            }  
            else if(vvv instanceof Texture){
                console.log('tex');
                DebugGUIPreset.trackObjectKey(vvv, debugUpdate, folder, key, false);

                //folder.addColor( new ColorGUIHelper(v, key), 'value').name(key);
            }  
            else if(vvv instanceof Vector2){
                DebugGUIPreset.trackVector2(vvv, key, debugUpdate, folder, false);
                //folder.addColor( new ColorGUIHelper(v, key), 'value').name(key);
            } 
            else if(vvv instanceof Vector3){
                DebugGUIPreset.trackVector3(vvv, key, debugUpdate, folder, false);
            } 

        }

        // let colorFolder = folder.addFolder('colorAttr');
        // colorFolder.close();
        // for(const key of colorkeys){
        //     colorFolder.addColor( new ColorGUIHelper(v, key), 'value');
        // }
        
    }

    static trackMaterial(v: Material, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){
  
        DebugGUIPreset.trackObjectKey(v, debugUpdate,  parentFolder, v.name, false);
    }

    static trackObject3D(v:THREE.Object3D, folderName:string, debugUpdate : DebugUpdater, parentFolder : dat.GUI, openFolder : boolean = false){

        let folder = parentFolder.addFolder(folderName);
 
        if(!openFolder){
            folder.close();
        }
        let attrFolder = folder.addFolder('attribute');
        attrFolder.close();
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'name')); 
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'uuid')); 
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'type'));   
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'matrixAutoUpdate')); 
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'matrixWorldAutoUpdate')); 
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'matrixWorldNeedsUpdate')); 
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v.layers, 'mask')); 
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'visible'));
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'castShadow'));
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'receiveShadow'));
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'frustumCulled'));
        // debugUpdate.addGUIControllerUpdate(attrFolder.add(v, 'renderOrder'));
        DebugGUIPreset.trackObjectKey(v,  debugUpdate,  attrFolder, undefined, false);
        DebugGUIPreset.trackVector3(v.up, 'up', debugUpdate, attrFolder, openFolder);

        //animations
        if( v.animations.length > 0){
            let animationsFolder = folder.addFolder('animations');
            for(let i = 0; i < v.animations.length; ++i){
                DebugGUIPreset.trackAnimationClip(v.animations[i], i, debugUpdate, animationsFolder, false);
            }
        }


        DebugGUIPreset.trackVector3(v.scale, 'scale', debugUpdate, attrFolder, openFolder); 
        DebugGUIPreset.trackEuler(v.rotation, 'rotation', debugUpdate, attrFolder, openFolder);
        DebugGUIPreset.trackQuaternion(v.quaternion, 'quaternion', debugUpdate, attrFolder, openFolder);
        DebugGUIPreset.trackVector3(v.position, 'position', debugUpdate, attrFolder, openFolder);
        DebugGUIPreset.trackMatrix4(v.matrix, 'matrix', debugUpdate, attrFolder, false);
        DebugGUIPreset.trackMatrix4(v.matrixWorld, 'matrixWorld', debugUpdate, attrFolder, false);
        DebugGUIPreset.trackMatrix4(v.modelViewMatrix, 'modelViewMatrix', debugUpdate, attrFolder, false);
        DebugGUIPreset.trackMatrix3(v.normalMatrix, 'normalMatrix', debugUpdate, attrFolder, false);
 
        if(v instanceof Mesh){
            let mesh =  v as Mesh;
            let materialsFolder = folder.addFolder('materials'); 
            DebugGUIPreset.trackMaterial(v.material, debugUpdate, materialsFolder, false);
        } 
 

        if(v.children && v.children.length > 0){
            let childFolder = folder.addFolder('childs');
            for(let i = 0; i < v.children.length; ++i){
 
                DebugGUIPreset.trackObject3D(v.children[i], 'object3D ' + i + ':' + v.children[i].name, debugUpdate, childFolder, false);
            }
        }
       
    }
}

export class DebugGUIFolders {
    rootFolder? : dat.GUI;
    monitorFolder? : dat.GUI;
    debugFolder? :dat.GUI;
    constructor(){ 
    }

    showRoot(){
        this.rootFolder?.show();
    }

    dispose(){
        if(this.monitorFolder){
            this.monitorFolder.destroy();
            this.monitorFolder = undefined;
        }

        if(this.debugFolder){
            this.debugFolder?.destroy();
            this.debugFolder = undefined;
        }
        
        this.rootFolder?.destroy();   
        this.rootFolder = undefined;
    }
}

export class DebugGUI {
 
    private bEnableUpdate = true;
    private debugUpdater = new DebugUpdater();
    private folders? : DebugGUIFolders; 
    private momoryDebugger? : MomoryDebugger;

    private sleep(milliSeconds : number) {
        return new Promise(resolve => setTimeout(resolve, milliSeconds * 1000));
    } 
 
    //next js window is not defined 오류 회피  
    async initAsync(){
        const scope = this;
        //const dat = await import('dat.gui');
        if(!scope.folders){
            scope.folders = new DebugGUIFolders(  );
            scope.folders.rootFolder = new dat.GUI( { width: 550, autoPlace: true } );
            scope.folders.monitorFolder = scope.folders.rootFolder.addFolder('Monitor');
            scope.folders.debugFolder = scope.folders.rootFolder.addFolder('Debug');
        } 
    }

    requestFolders(callback : (debugUpdate? : DebugUpdater, folders? : DebugGUIFolders)=>void) { 
        callback(this.debugUpdater, this.folders); 
    }

    requestRootFolder(callback : (debugUpdate? : DebugUpdater, folder? : dat.GUI)=>void) { 
        callback(this.debugUpdater, this.folders?.rootFolder); 
    }

    requestMonitorFolder(callback : (debugUpdate? : DebugUpdater, folder? : dat.GUI)=>void) {
        const scope = this;
 
        callback(this.debugUpdater, this.folders?.monitorFolder); 
    }
  
    run( activity : Activity){
        const scope = this; 
        this.folders?.showRoot();
        
        this.requestFolders((debugUpdate? : DebugUpdater, folders? : DebugGUIFolders)=>{
            if(!debugUpdate || !folders){
                return;
            }

            if(!this.momoryDebugger){
                this.momoryDebugger = new MomoryDebugger(debugUpdate, folders);
            } 
        });

        function updateDebug(){
            if(scope.bEnableUpdate){
                requestAnimationFrame(updateDebug); 
                scope.update(activity, undefined); 
            } 
        }

        updateDebug();
    }

    dispose(){
        this.bEnableUpdate = false; 
        this.momoryDebugger?.dispose(); 
        this.folders?.dispose();
        this.debugUpdater?.dispose(); 
    }
 
    private update(activity : Activity, parent? : dat.GUI){ 
        this.debugUpdater.update();
    }
 
}