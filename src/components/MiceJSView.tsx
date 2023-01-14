import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { MiceActivity } from "../Mice/MiceActivity"; 
  
const countContext =  createContext({});
let miceThreeJS : MiceActivity = new MiceActivity();
let miceThreeJSInit = false;

interface ParamProps {
  children: ReactNode; 
}

const MiceJSView = ({children}: ParamProps) => { 

  useEffect(()=>{ 
    if(miceThreeJSInit === false){
      miceThreeJSInit = true;
      const threeView = document.getElementById('micejsview');
      if(threeView){
        miceThreeJS.init(threeView);
      }
    }  
  }, []);

    return (
      <countContext.Provider value={miceThreeJS}>
        <div id = 'micejsview' style={{width:'100%', height:'100%'}}> 
        </div>
      </countContext.Provider> 
      );
}


export default MiceJSView;