import { Activity } from "../Activity/Activity";
import { ThreeEngine } from "../Engine/ThreeEngine";
import { World } from "./World";

export class WorldPresetParam<USER_DATA> {
    htmlViews? : HTMLElement[];
    userData? : USER_DATA;

    constructor( htmlViews? : HTMLElement[], userData? : USER_DATA) {
        this.htmlViews = htmlViews;
        this.userData  = userData;
    }
}

export interface IWorldPreset {
 
    //override IWorldPreset
    dispose():void;
}