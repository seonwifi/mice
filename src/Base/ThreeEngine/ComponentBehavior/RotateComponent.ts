import { Behavior, BehaviorUpdateData } from "../Component/Behavior";


export class RotateComponent extends Behavior{

    rotateX : boolean = false;
    rotateY : boolean = false;
    rotateZ : boolean = false;
    
    rotateSpeedX : number = 0.15;
    rotateSpeedY : number = 0.15;
    rotateSpeedZ : number = 0.15;

    //override IUpdate
    update( updateData : BehaviorUpdateData):void{
        super.update(updateData);
        if(this.rotateX){
            this.object.rotateX( this.rotateSpeedX * updateData.deltaTime);
        }
        if(this.rotateY){
            this.object.rotateY( this.rotateSpeedY * updateData.deltaTime);
        }
        if(this.rotateZ){
            this.object.rotateZ( this.rotateSpeedZ * updateData.deltaTime);
        }
    }   
    
}