import { Object3D } from "three";
import { World } from "../World/World";
import { IComponent } from "./IComponent";
import { ObjectComponent } from "./ObjectComponent";


export class ComponentManager{
    components : Array<ObjectComponent> = [];

    constructor(){

    }

    addComponent<T extends ObjectComponent>(type: (new (object : Object3D, owner : ComponentManager, world: World) => T), object : Object3D, world: World) : T {
        let comp = new type(object, this, world); 
        this.components.push(comp);
        comp.awake();
        return comp;
    }

    getComponent<T extends ObjectComponent>(constructor:{new ():T}): T {

        let findItem =  this.components.find((item)=>{
                if(item instanceof constructor){
                    return true;
                }  
                return false;
            });

        return findItem as T;
    }

    removeComponent(component : ObjectComponent){
        if(!component){
            return;
        }

        const index =  this.components.indexOf(component); 
        if(index !== -1){
            component.dispose();
            this.components.splice(index, 1);
        } 
    }

    removeAll(){
        while(this.components.length > 0){
            let item = this.components.pop();
            if(item){
                item.end();
                item.dispose();
            }
        }
    }
}