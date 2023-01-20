import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ThreeExample } from "../../Three/ThreeExample";
  
const countContext =  createContext({});
let miceThreeJS : ThreeExample = new ThreeExample();
let miceThreeJSInit = false;

export enum eScreenView{
  singleScreen,
  horizontal_2Screen,
  vertical_2Screen,
  quadScreen,
}


interface ParamProps {
  children: ReactNode;
  screenView : eScreenView;
}


const MiceJSView = ({children, screenView}: ParamProps) => { 

  useEffect(()=>{  
    if(miceThreeJSInit === false){
      miceThreeJSInit = true;
      miceThreeJS.runAsync(document.getElementById('micejsview0'));
    }  
  }, []);

  return (
    <countContext.Provider value={miceThreeJS}>
      <div id = 'micejsview0' style={{width:'100%', height:'100%', overflow: 'hidden', display: 'block', position : 'absolute'  }}/> 
    </countContext.Provider> 
    );
 
}


export default MiceJSView;