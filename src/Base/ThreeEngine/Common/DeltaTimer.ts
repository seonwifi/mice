

export class DeltaTimer {
    lastMilliseconds : number = 0;
    deltaSconds : number = 0;

    constructor(){

    }

    start(){
        this.lastMilliseconds  = new Date().getTime();
    }

    update(){

        if(this.lastMilliseconds === 0){
            this.lastMilliseconds  = new Date().getTime();
        }

        const currentMilliSeconds = new Date().getTime();
        this.deltaSconds = currentMilliSeconds - this.lastMilliseconds;
        this.lastMilliseconds = currentMilliSeconds;
        this.deltaSconds = this.deltaSconds*0.001;
        //console.log(this.deltaSconds);
    }

    getDeltaSeconds() : number {
        return this.deltaSconds;
    }
}