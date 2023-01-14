


export interface IComponent {

    //override IComponent
    awake():void;

    //override IComponent
    begin():void;

    //override IComponent
    end():void;

    //override IComponent
    dispose():void;

    //override IComponent
    setEnable(bEnable:boolean):void;
}