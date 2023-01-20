import * as THREE from "three";
import { ComponentManager } from "../Component/ComponentManager";


export class ThreeJsStatic{

    private static trackDisposeObject(resource : any, removes : Array<any>) {
        if (!resource) {
            return resource;
        }

        // handle children and when material is an array of materials or
        // uniform is array of textures
        if (Array.isArray(resource)) {
            resource.forEach(resource => ThreeJsStatic.trackDisposeObject(resource, removes));
            return resource;
        }

        if (resource.dispose || resource instanceof THREE.Object3D) {
            removes.push(resource);
        }

        if (resource instanceof THREE.Object3D) {
            if(resource.userData.com){
                let comp : ComponentManager =  resource.userData.com;
                comp.removeAll();
                resource.userData.com = undefined;
            }

            let resourceObject : any = resource;
            ThreeJsStatic.trackDisposeObject(resourceObject.geometry, removes);
            ThreeJsStatic.trackDisposeObject(resourceObject.material, removes);
            ThreeJsStatic.trackDisposeObject(resourceObject.children, removes);
        } 
        else if (resource instanceof THREE.Material) {
            // We have to check if there are any textures on the material
            for (const value of Object.values(resource)) {
                if (value instanceof THREE.Texture) {
                    ThreeJsStatic.trackDisposeObject(value, removes);
                }
            }
            // We also have to check if any uniforms reference textures or arrays of textures
            let resourceObject : any = resource;
            if (resourceObject.uniforms) {
                for (const value of Object.values(resourceObject.uniforms)) {
                    if (value){
                        let valueAny : any = value; 
                        const uniformValue = valueAny.value;
                        if (uniformValue instanceof THREE.Texture || Array.isArray(uniformValue)) {
                                ThreeJsStatic.trackDisposeObject(uniformValue, removes);
                        }
                    }
                }
            }
        }
        return resource;
    }

    static disposeObject(object? : THREE.Object3D){
        if(!object){
            return;
        }
  
        let trackObjects = new Array<any>();
        ThreeJsStatic.trackDisposeObject(object, trackObjects);
        for(const item of trackObjects){
            if (item instanceof THREE.Object3D) {
                if (item.parent) {
                    item.parent.remove(item);
                }
            }
            if(item.dispose){
                item.dispose();
            }

        }
    }
}