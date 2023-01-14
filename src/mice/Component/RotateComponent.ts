import { Behavior, BehaviorUpdateData } from "../../ThreeJS/Component/Behavior";


export class RotateComponent extends Behavior{

    rotateSpeed : number = 0.1;

    //overrideIComponent
    awake():void{

    }

    //override IComponent
    begin():void{
        
    }
    
    //override IUpdate
    beginUpdate():void{

    }

    //override IUpdate
    update( updateData : BehaviorUpdateData):void{ 
 
        //this.object.position.z += (updateData.deltaTime * this.rotateSpeed);
        this.object.rotateX( updateData.deltaTime * this.rotateSpeed); 
        this.object.updateMatrix();
        this.object.updateWorldMatrix(true, true);
    }

    //override IUpdate
    finishUpdate():void{

    }
}