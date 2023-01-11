import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { MiceJS } from "../mice/MiceJS"; 
  
const countContext =  createContext({});
let miceThreeJS : MiceJS;
 
interface ParamProps {
  children: ReactNode; 
}

const MiceJSView = ({children}: ParamProps) => { 

  useEffect(()=>{ 
    if(!miceThreeJS){
      const threeView = document.getElementById('micejsview');
      miceThreeJS = new MiceJS(); 
      miceThreeJS.init(threeView); 
    } 
  }, [miceThreeJS]);

    return (
      <countContext.Provider value={miceThreeJS}>
        <div id = 'micejsview'> 
        </div>
      </countContext.Provider> 
      );
}


export default MiceJSView;