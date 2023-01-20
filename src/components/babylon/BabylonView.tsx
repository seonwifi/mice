import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BabylonExample } from "../../Babylon/BabylonExample";
 
 
  
const countContext =  createContext({});
let app : BabylonExample = new BabylonExample();
let miceThreeJSInit = false;

export enum eScreenView{
  singleScreen,
  horizontal_2Screen,
  vertical_2Screen,
  quadScreen,
}

interface ParamProps {
  children: ReactNode;
}
 
const BabylonView = ({children}: ParamProps) => { 

  useEffect(()=>{  
    if(miceThreeJSInit === false){
      miceThreeJSInit = true;
      let views : Array<HTMLElement> = [];
      for(let i = 0; i < 32; ++i){
        const threeView = document.getElementById('micejsview' + i); 
        if(threeView){
            views.push(threeView);
        } 
      }

      if(views.length > 0){
        app.run(document.getElementById('micejsview' + 0) as HTMLCanvasElement);
      } 
    }  
  }, []);

  return (
    <countContext.Provider value={app}>
      <canvas id = 'micejsview0' style={{width:'100%', height:'100%', overflow: 'hidden', display: 'block', position : 'absolute'  }}/> 
    </countContext.Provider> 
    );
 
}


export default BabylonView;