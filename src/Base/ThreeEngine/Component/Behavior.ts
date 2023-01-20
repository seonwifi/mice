import { Object3D } from 'three';
import { IUpdate } from '../Common/IUpdate';
import { World } from '../World/World';
import { ComponentManager } from './ComponentManager';
import {IComponent} from './IComponent';
import { ObjectComponent } from './ObjectComponent';

export class BehaviorUpdateData{
    deltaTime : number = 0;
}

export class Behavior extends ObjectComponent implements  IUpdate<BehaviorUpdateData> {
 
    constructor(object : Object3D, owner : ComponentManager, world : World){
        super(object, owner, world);
        world.addObjectUpdate(this);
    }

    //overrideIComponent
    awake():void{
        super.awake();
    }

    //override IComponent
    begin():void{
        super.begin();
    }
 
    //override IComponent
    end():void{
        super.end();
    }

    //override IComponent
    dispose():void{
        super.dispose();
    }

    //override IComponent
    setEnable(bEnable:boolean):void{
        super.setEnable(bEnable); 
        if(bEnable){
            this.world?.addObjectUpdate(this);
        }
        else{
            this.world?.removeObjectUpdate(this);
        }  
    }

    //override IUpdate
    beginUpdate():void{
 
    }

    //override IUpdate
    update( updateData : BehaviorUpdateData):void{
 
    }

    //override IUpdate
    finishUpdate():void{
 
    }

}