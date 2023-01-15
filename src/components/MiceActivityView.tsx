import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { MiceActivity } from "../Mice/MiceActivity"; 
  
const countContext =  createContext({});
let miceThreeJS : MiceActivity = new MiceActivity();
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
      let views : Array<HTMLElement> = [];
      for(let i = 0; i < 32; ++i){
        const threeView = document.getElementById('micejsview' + i); 
        if(threeView){
            views.push(threeView);
        } 
      }

      if(views.length > 0){
        miceThreeJS.init(views);
      } 
    }  
  }, []);

  if(screenView == eScreenView.singleScreen){
    return (
      <countContext.Provider value={miceThreeJS}>
        <div id = 'micejsview0' style={{width:'100%', height:'100%', overflow: 'hidden', display: 'block', position : 'absolute'  }}/> 
      </countContext.Provider> 
      );
  }
  else if(screenView == eScreenView.horizontal_2Screen){
    return (
      <countContext.Provider value={miceThreeJS}>
        <div style={{ width:'100%', height:'100%', overflow: 'hidden' }}>
          <div id = 'micejsview0' style={{left:'0px', width:'50%', height:'100%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
          <div id = 'micejsview1' style={{left:'50%', width:'50%', height:'100%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
        </div> 
      </countContext.Provider> 
      );
  }
  else if(screenView == eScreenView.vertical_2Screen){
    return (
      <countContext.Provider value={miceThreeJS}>
        <div style={{ width:'100%', height:'100%', overflow: 'hidden' }}>
          <div id = 'micejsview0' style={{left:'0px', top:'0%', width:'100%', height:'50%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
          <div id = 'micejsview1' style={{left:'0%', top:'50%', width:'100%', height:'50%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
        </div> 
      </countContext.Provider> 
      );
  }
  else if(screenView == eScreenView.quadScreen){
    return (
      <countContext.Provider value={miceThreeJS}>
        <div style={{ width:'100%', height:'100%', overflow: 'hidden' }}>
          <div id = 'micejsview0' style={{left:'0px', width:'50%', height:'50%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
          <div id = 'micejsview1' style={{left:'50%', width:'50%', height:'50%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
          <div id = 'micejsview2' style={{left:'0px', top:'50%', width:'50%', height:'50%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
          <div id = 'micejsview3' style={{left:'50%', top:'50%', width:'50%', height:'50%', overflow: 'hidden', display: 'block', position : 'absolute'  }}> 
          </div>
        </div> 
      </countContext.Provider> 
      );
  } 
  else{
    return (
      <countContext.Provider value={miceThreeJS}>
        <div id = 'micejsview0' style={{width:'100%', height:'100%', overflow: 'hidden', display: 'block', position : 'absolute'  }}/> 
      </countContext.Provider> 
      );
  }
}


export default MiceJSView;