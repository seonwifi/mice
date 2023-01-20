import { Activity } from "../Activity/Activity";
import { World } from "../World/World";
import { WorldScreen } from "./WorldScreen";

export class ScreenManager {
    screens : Array<WorldScreen> = [];
    constructor(){

    }
  
    add<T extends WorldScreen>(type: (new (activity : Activity, viewDock? : HTMLElement | null, sceneSource? : World  | undefined) => T), activity : Activity, htmlView? : HTMLElement | null, world? : World  | undefined) : T {
        let screen = new type(activity, htmlView, world);
        this.screens.push(screen);
        return screen;
    }

    remove(screen : WorldScreen){
        if(!screen){
            return;
        } 

        const index =  this.screens.indexOf(screen); 
        if(index !== -1){
            this.screens.splice(index, 1);
        } 

        screen.dispose();
    }

    removeScreenInWorld(world : World){

        let removeScreens = this.screens.filter((item) =>{
            return item.isWorld(world);
        });
 
        for(const item of removeScreens){
            this.remove(item);
        }
    }

    removeAll(){
        while( this.screens.length > 0){
            let item = this.screens.pop();
            item?.dispose();
        }
    }

    getScreen(i:number) : WorldScreen | undefined {
        if(i < 0 || i >= this.screens.length){
            return undefined;
        }   

        return this.screens[i];
    }

    getScreenCount() : number {
        return this.screens.length;
    }

    contain(screen : WorldScreen):boolean{
        const index =  this.screens.indexOf(screen); 
        return index !== -1;
    }
}