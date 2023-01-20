import { type } from "os";
import * as THREE from "three";
import { ColorRepresentation } from "three";

 
export class ShadowParam  {
    castShadow : boolean = true;
    shadowRange : number = 17; 
    near: number = 0.1;
    far: number = 500; 
    bias: number = -0.0001;  
    normalBias : number= 0.001; 
    mapSize : number = 1024;
    radius  : number = 3;
    blurSamples : number = 8; 
};

export class Preset {
    
    static directionalLightSimple(lightPosition : THREE.Vector3, color?: ColorRepresentation, intensity?: number, shadowParam? : ShadowParam  ) : THREE.DirectionalLight {
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.copy(lightPosition);
        
        if(shadowParam){
            light.castShadow            = shadowParam.castShadow;
            light.shadow.camera.top     = shadowParam.shadowRange;
            light.shadow.camera.bottom  = -shadowParam.shadowRange;
            light.shadow.camera.left    = -shadowParam.shadowRange;
            light.shadow.camera.right   = shadowParam.shadowRange;
            light.shadow.camera.near    = shadowParam.near;
            light.shadow.camera.far     = shadowParam.far;
            light.shadow.bias           =  shadowParam.bias;
            light.shadow.normalBias     = shadowParam.normalBias;
            light.shadow.mapSize.width  = shadowParam.mapSize;
            light.shadow.mapSize.height = shadowParam.mapSize;
            light.shadow.radius         = shadowParam.radius;
            light.shadow.blurSamples    = shadowParam.blurSamples; 
        }

        return light;
    } 

    static MeshPlane(planeSize : number, color: ColorRepresentation = 0xffffff, receiveShadow : boolean = true,  castShadow : boolean = true) : THREE.Mesh {
        const material = new THREE.MeshPhongMaterial( { color: color  } ); 
        const geometry = new THREE.PlaneGeometry( planeSize, planeSize );
        geometry.rotateX(  -Math.PI / 2 );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow; 
        return mesh;
    }
 
}