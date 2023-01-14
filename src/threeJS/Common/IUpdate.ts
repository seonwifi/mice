

export interface IUpdate<T> {

    //override IUpdate
    beginUpdate():void;

    //override IUpdate
    update(updateData : T):void;

    //override IUpdate
    finishUpdate():void;

}