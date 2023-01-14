import { IUpdate } from "./IUpdate";

 

export class UpdateManager<T>{

    private updates : Array<IUpdate<T>> = [];

    constructor(){

    }

    update(updateData : T){
        let item : IUpdate<T>;
        for(let i = 0, size = this.updates.length; i < size; ++i){
            item = this.updates[i];
            item.update(updateData);
        }
    }

    addUpdate(updateObj : IUpdate<T>){
        if(!updateObj){
            return;
        }

        this.updates.push(updateObj);
        updateObj.beginUpdate();
    }

    contains(updateObj : IUpdate<T>): boolean{
       return this.updates.indexOf(updateObj) !== -1; 
    }

    removeUpdate(updateObj : IUpdate<T>){
        if(!updateObj){
            return;
        }

        const index =  this.updates.indexOf(updateObj); 
        if(index !== -1){ 
            this.updates.splice(index, 1);
            if(updateObj){
                updateObj.finishUpdate();
            }
            
        } 
    }

    removeAll(){
        while (this.updates.length > 0) {
            let removeUpdate = this.updates.pop();
            if(removeUpdate){
                removeUpdate.finishUpdate();
            }
          }
    }

}