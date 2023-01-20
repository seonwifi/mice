import { Activity } from "../Activity/Activity";
import { eWorldRemoveScreenState } from "../Common/EngineDefine";
import { ThreeEngine } from "../Engine/ThreeEngine";
import { World } from "./World";
import { IWorldPreset } from "./WorldPreset";

export class WorldManager{
    activeWorlds : Array<World> = [];
    worlds : Array<World> = [];

    constructor(){
         
    }
 
    add<INIT_DATA, T extends IWorldPreset>( type: (new (activity : Activity, engine : ThreeEngine, world : World , data : INIT_DATA | any | undefined | null) => T), activity : Activity, engine : ThreeEngine, data? : INIT_DATA| any | undefined | null) : World {
        let world = new World(activity, engine);
        this.worlds.push(world);
        world.initPreset(type, data); 
        return world;
    }

    remove(sceneSource : World){
        if(!sceneSource){
            return;
        }
        
        const index =  this.worlds.indexOf(sceneSource); 
        if(index !== -1){
            this.worlds.splice(index, 1);
        } 
    }
 
    removeAll(){
        this.activeWorlds.splice(0, this.activeWorlds.length);
        while(this.worlds.length > 0){
            let world = this.worlds.pop();
            if(world){
                world.dispose();
            }
        }
    }

    contain(world:World):boolean{
        let index = this.worlds.findIndex((item)=>{
             return item === world;
        });

        return index !== -1;
    }
    
    getWorldCount():number{
        return this.worlds.length;
    }

    getWorld(i : number):World | undefined{
        if(i < 0 || i >= this.worlds.length){
            return undefined;
        }
        return this.worlds[i];
    }
}