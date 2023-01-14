import { DeltaTimer } from "./DeltaTimer";
export class FPSValues{
    currentFps : number = 0;
    avgFps : number = 0;
    minFps : number = 0;
    maxFps : number = 0;
}

export class FPSManager{
    values = new FPSValues();
    private accSeconds : number = 0;
    private accCount : number = 0;
    private bFirst = true;
    private deltaTimer = new DeltaTimer();
    private accResetMinMax : number = 0;
    private resetMinMax : number = 10;

    start(){
        this.values.currentFps = 0;
        this.values.avgFps = 0;
        this.values.minFps = 0;
        this.values.maxFps = 0;
        this.accSeconds  = 0;
        this.accCount  = 0;
        this.accResetMinMax = 0;
        this.bFirst = true;
        this.deltaTimer.start();
    }

    update(){
        this.deltaTimer.update();
        const deltaSeconds = this.deltaTimer.getDeltaSeconds();
        if(deltaSeconds <= 0){
            return;
        }
        
        const fps = 1.0/(deltaSeconds);
        if(this.bFirst){
            this.bFirst = false;
            this.values.currentFps = fps; 
            this.values.minFps = fps;
            this.values.maxFps = fps;
        }
        else{
            this.values.currentFps = fps; 
            if(fps <  this.values.minFps){
                this.values.minFps = fps;
            }
    
            if(fps > this.values.maxFps){
                this.values.maxFps = fps;
            }
        }

        this.accResetMinMax += deltaSeconds;
        if(this.accResetMinMax > this.resetMinMax){
            this.values.minFps = fps;
            this.values.maxFps = fps;
            this.accResetMinMax = 0;
        }

        this.accSeconds += deltaSeconds;
        this.accCount++;
        if(this.accSeconds >= 1){
            let avgSeconds = this.accSeconds/this.accCount;
            if(avgSeconds > 0){
                this.values.avgFps = 1.0/avgSeconds; 
            } 
            this.accSeconds = 0;
            this.accCount = 0;
        }
    }
}