
export class Timer {
 
    seconds : number = 0;
    lastMilliseconds: number = 0;
    constructor(){
        this.lastMilliseconds  = new Date().getTime();
    }

    start(){
        
    }

    update(){

        if(this.lastMilliseconds === 0){
            this.lastMilliseconds  = new Date().getTime();
        }

        const currentMilliSeconds = new Date().getTime();
        let milliSconds = currentMilliSeconds - this.lastMilliseconds;
        this.seconds = milliSconds*0.001;
    }

    getSeconds() : number {
        this.update();
        return this.seconds;
    }
}