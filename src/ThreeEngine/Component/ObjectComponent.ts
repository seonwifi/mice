import { Object3D } from "three";
import { World } from "../World/World";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";


export class ObjectComponent implements IComponent {
    protected object : Object3D;
    protected owner: ComponentManager;
    protected world : World;
    public enable : boolean = true;
    constructor(object : Object3D, owner : ComponentManager, world : World){
        this.object = object;
        this.owner = owner;
        this.world = world;
    }
    
    //override IComponent
    awake(): void {
 
    }

    //override IComponent
    begin(): void {
 
    }

    //override IComponent
    end(): void {
 
    }

    //override IComponent
    dispose(): void {
        // this.owner = undefined;
        // this.object = undefined;
        // this.world = undefined;
    }

    //override IComponent
    setEnable(bEnable: boolean): void {
 
    }

    remove(){
        if(!this.object){
            return;
        }
        let com : ComponentManager = this.object!.userData.com;
        if(!com){
            return;
        }
        com.removeComponent(this);
    }

    getComponent<T extends ObjectComponent>(constructor:{new ():T}): T | undefined{
        if(!this.owner){
            return undefined;
        }
        return this.owner.getComponent(constructor);
    }
}