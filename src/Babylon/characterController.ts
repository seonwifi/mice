import { Scene, Vector3, Ray, TransformNode, Mesh, Color3, Color4, UniversalCamera, Quaternion, AnimationGroup, ExecuteCodeAction, ActionManager, ParticleSystem, Texture, SphereParticleEmitter, Sound, Observable, ShadowGenerator, ArcRotateCamera } from 'babylonjs';
import { PlayerInput } from "./inputController";

export class Player extends TransformNode {

    public camera?:  ArcRotateCamera;
    public scene: Scene;
    private _input?: PlayerInput;

    //Player
    public mesh: Mesh; //outer collisionbox of player

    //Camera 
    private _yTilt?: TransformNode;

    //animations
    private _run: AnimationGroup;
    private _idle: AnimationGroup;
    private _jump: AnimationGroup;
    private _land: AnimationGroup;
    private _dash: AnimationGroup;

    // animation trackers
    private _currentAnim?: AnimationGroup | null = null;
    private _prevAnim?: AnimationGroup;
    private _isFalling: boolean = false;
    private _jumped: boolean = false;

    //const values
    private static readonly PLAYER_SPEED: number = 0.15;
    private static readonly JUMP_FORCE: number = 0.20;
    private static readonly GRAVITY: number = -0.8;
    private static readonly DASH_FACTOR: number = 2.5;
    private static readonly DASH_TIME: number = 10; //how many frames the dash lasts
    private static readonly DOWN_TILT: Vector3 = new Vector3(0.8290313946973066, 0, 0);
    private static readonly ORIGINAL_TILT: Vector3 = new Vector3(0.5934119456780721, 0, 0);
    public dashTime: number = 0;

    //player movement vars
    private _deltaTime: number = 0;
    private _h: number = 0;
    private _v: number = 0;

    private _moveDirection: Vector3 = new Vector3();
    private _inputAmt: number = 0;

    //dashing
    private _dashPressed: boolean = true;
    private _canDash: boolean = true;

    //gravity, ground detection, jumping
    private _gravity: Vector3 = new Vector3();
    private _lastGroundPos: Vector3 = Vector3.Zero(); // keep track of the last grounded position
    private _grounded: boolean = true;
    private _jumpCount: number = 1;

    //player variables
    public lanternsLit: number = 1; //num lanterns lit
    public totalLanterns: number = 0;
    public win: boolean = false; //whether the game is won

    //sparkler
    public sparkler?: ParticleSystem; // sparkler particle system
    public sparkLit: boolean = true;
    public sparkReset: boolean = false;

    //moving platforms
    public _raisePlatform?: boolean;

    //sfx
    public lightSfx?: Sound;
    public sparkResetSfx?: Sound;
    private _resetSfx?: Sound;
    private _walkingSfx?: Sound;
    private _jumpingSfx?: Sound;
    private _dashingSfx?: Sound;

    //observables
    public onRun = new Observable();

    //tutorial
    public tutorial_move = false;
    public tutorial_dash = false;
    public tutorial_jump = false;

    constructor(assets : any, scene: Scene, shadowGenerator: ShadowGenerator, input?: PlayerInput, camera?:  ArcRotateCamera) {
        super("player", scene);
        this.scene = scene;
        this.camera = camera;
 
        //camera
        //this._setupPlayerCamera();
        this.mesh = assets.mesh;
        this.mesh.parent = this;
 

        this._idle = assets.animationGroups[2];
        this._jump = assets.animationGroups[2];
        this._land = assets.animationGroups[3];
        this._run = assets.animationGroups[3];
        this._dash = assets.animationGroups[0];

        //--COLLISIONS--
        this.mesh.actionManager = new ActionManager(this.scene);

 
        // this._createSparkles(); //create the sparkler particle system
         this._setUpAnimations();
         shadowGenerator.addShadowCaster(assets.mesh);
         //this._setupPlayerCamera();
         this._input = input; 


         this._beforeRenderUpdate();
    }

    update(){
 
        this.camera!.target.x = this.mesh.position.x;
        this.camera!.target.y = this.mesh.position.y+2;
        this.camera!.target.z = this.mesh.position.z;
    }

    private _updateFromControls(): void {
        this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;

        this._moveDirection = Vector3.Zero();
        this._h = this._input!.horizontal; //right, x
        this._v = this._input!.vertical; //fwd, z

        //tutorial, if the player moves for the first time
        if((this._h != 0 || this._v != 0) && !this.tutorial_move){
            this.tutorial_move = true;
        }

        //--DASHING--
        //limit dash to once per ground/platform touch
        //can only dash when in the air
        if (this._input!.dashing && !this._dashPressed && this._canDash && !this._grounded) {
            this._canDash = false;
            this._dashPressed = true;
    
            //sfx and animations
            this._currentAnim = this._dash;
            this._dashingSfx?.play();

            //tutorial, if the player dashes for the first time
            if(!this.tutorial_dash){
                this.tutorial_dash = true;
            }
        }

        let dashFactor = 1;
        //if you're dashing, scale movement
        if (this._dashPressed) {
            if (this.dashTime > Player.DASH_TIME) {
                this.dashTime = 0;
                this._dashPressed = false;
            } else {
                dashFactor = Player.DASH_FACTOR;
            }
            this.dashTime++;
        }
        //this._v = 0.11;
        //--MOVEMENTS BASED ON CAMERA (as it rotates)--
        let foward : Vector3 = new Vector3().copyFrom(this.camera!.target);
        foward.subtractInPlace(this.camera!.position);
        foward.normalize();
        let up : Vector3 = new Vector3(0,1,0);
        let right = Vector3.Cross(up, foward);
        
        let fwd2 = new Vector3().copyFrom(foward);
        let fwd = foward;
 
        let correctedVertical = fwd!.scaleInPlace(this._v);
        let correctedHorizontal = right!.scaleInPlace(this._h);
 
        //movement based off of camera's view
        let move = correctedHorizontal?.addInPlace(correctedVertical!);

        //clear y so that the character doesnt fly up, normalize for next step, taking into account whether we've DASHED or not
        this._moveDirection = new Vector3((move!).normalize().x * dashFactor, 0, (move!).normalize().z * dashFactor);
        //console.log(this._moveDirection);
        //clamp the input value so that diagonal movement isn't twice as fast
        let inputMag = Math.abs(this._h) + Math.abs(this._v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 1) {
            this._inputAmt = 1;
        } else {
            this._inputAmt = inputMag;
        }
        //final movement that takes into consideration the inputs
        this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt * Player.PLAYER_SPEED);

        //check if there is movement to determine if rotation is needed
        let input = new Vector3(this._input!.horizontalAxis, 0, this._input!.verticalAxis); //along which axis is the direction
        if (input.length() == 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }
 
        fwd2.normalize(); 
        //rotation based on input & the camera angle
        let angleCam = Math.atan2(fwd2.x, fwd2.z); 
        let angle = Math.atan2(this._input!.horizontalAxis, this._input!.verticalAxis);
        angle +=  angleCam;
        let targ = Quaternion.FromEulerAngles(0, angle, 0);

  
        this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh!.rotationQuaternion!, targ, 10 * this._deltaTime);
    }

    private _setUpAnimations(): void {

        this.scene.stopAllAnimations();
        this._run.loopAnimation = true;
        this._idle.loopAnimation = true;

        //initialize current and previous
        this._currentAnim = this._idle;
        this._prevAnim = this._land;
    }

    private _animatePlayer(): void {
        if (!this._dashPressed && !this._isFalling && !this._jumped 
            && (this._input!.inputMap["w"] || this._input!.mobileUp
            || this._input!.inputMap["s"] || this._input!.mobileDown
            || this._input!.inputMap["a"] || this._input!.mobileLeft
            || this._input!.inputMap["d"] || this._input!.mobileRight)) {

            this._currentAnim = this._run;
            this.onRun.notifyObservers(true);
        } else if (this._jumped && !this._isFalling && !this._dashPressed) {
            this._currentAnim = this._jump;
        } else if (!this._isFalling && this._grounded) {
            this._currentAnim = this._idle;
            //only notify observer if it's playing
            let walkingSound = this.scene.getSoundByName("walking");
            if(walkingSound){
                if(walkingSound.isPlaying){
                    this.onRun.notifyObservers(false);
                }
            } 
        } else if (this._isFalling) {
            this._currentAnim = this._land;
        }

        //Animations
        if(this._currentAnim != null && this._prevAnim !== this._currentAnim){
            this._prevAnim?.stop();
            this._currentAnim.play(this._currentAnim.loopAnimation);
            this._prevAnim = this._currentAnim;
        }
    }

    //--GROUND DETECTION--
    //Send raycast to the floor to detect if there are any hits with meshes below the character
    private _floorRaycast(offsetx: number, offsetz: number, raycastlen: number): Vector3 {
        //position the raycast from bottom center of mesh
        let raycastFloorPos = new Vector3(this.mesh.position.x + offsetx, this.mesh.position.y + 0.5, this.mesh.position.z + offsetz);
        let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

        //defined which type of meshes should be pickable
        let predicate = function (mesh : any) {
            return mesh.isPickable && mesh.isEnabled();
        }

        let pick = this.scene.pickWithRay(ray, predicate);
        if(pick){
            if (pick.hit && pick.pickedPoint) { //grounded
                return pick.pickedPoint;
            } else { //not grounded
                return Vector3.Zero();
            }
        }
        return Vector3.Zero();
    }

    //raycast from the center of the player to check for whether player is grounded
    private _isGrounded(): boolean {
        if (this._floorRaycast(0, 0, .6).equals(Vector3.Zero())) {
            return false;
        } else {
            return true;
        }
    }

    //https://www.babylonjs-playground.com/#FUK3S#8
    //https://www.html5gamedevs.com/topic/7709-scenepick-a-mesh-that-is-enabled-but-not-visible/
    //check whether a mesh is sloping based on the normal
    private _checkSlope(): boolean {

        //only check meshes that are pickable and enabled (specific for collision meshes that are invisible)
        let predicate = function (mesh :any) {
            return mesh.isPickable && mesh.isEnabled();
        }

        //4 raycasts outward from center
        let raycast = new Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z + .25);
        let ray = new Ray(raycast, Vector3.Up().scale(-1), 1.5);
        let pick = this.scene.pickWithRay(ray, predicate);

        let raycast2 = new Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z - .25);
        let ray2 = new Ray(raycast2, Vector3.Up().scale(-1), 1.5);
        let pick2 = this.scene.pickWithRay(ray2, predicate);

        let raycast3 = new Vector3(this.mesh.position.x + .25, this.mesh.position.y + 0.5, this.mesh.position.z);
        let ray3 = new Ray(raycast3, Vector3.Up().scale(-1), 1.5);
        let pick3 = this.scene.pickWithRay(ray3, predicate);

        let raycast4 = new Vector3(this.mesh.position.x - .25, this.mesh.position.y + 0.5, this.mesh.position.z);
        let ray4 = new Ray(raycast4, Vector3.Up().scale(-1), 1.5);
        let pick4 = this.scene.pickWithRay(ray4, predicate);

 
        if (pick && pick.hit && !pick.getNormal()!.equals(Vector3.Up())) {
            if(pick.pickedMesh && pick.pickedMesh.name.includes("stair")) { 
                return true; 
            }
        } else if (pick2 && pick2.hit && !pick2.getNormal()!.equals(Vector3.Up())) {
            if(pick2 && pick2.pickedMesh!.name.includes("stair")) { 
                return true; 
            }
        }
        else if (pick3 && pick3.hit && !pick3.getNormal()!.equals(Vector3.Up())) {
            if(pick3.pickedMesh!.name.includes("stair")) { 
                return true; 
            }
        }
        else if (pick4 && pick4.hit && !pick4.getNormal()!.equals(Vector3.Up())) {
            if(pick4.pickedMesh!.name.includes("stair")) { 
                return true; 
            }
        }
        return false;
    }

    private _updateGroundDetection(): void {
        this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;

        //if not grounded
        if (!this._isGrounded()) {
            //if the body isnt grounded, check if it's on a slope and was either falling or walking onto it
            if (this._checkSlope() && this._gravity.y <= 0) {
                console.log("slope")
                //if you are considered on a slope, you're able to jump and gravity wont affect you
                this._gravity.y = 0;
                this._jumpCount = 1;
                this._grounded = true;
            } else {
                //keep applying gravity
                this._gravity = this._gravity.addInPlace(Vector3.Up().scale(this._deltaTime * Player.GRAVITY));
                this._grounded = false;
            }
        }

        //limit the speed of gravity to the negative of the jump power
        if (this._gravity.y < -Player.JUMP_FORCE) {
            this._gravity.y = -Player.JUMP_FORCE;
        }

        //cue falling animation once gravity starts pushing down
        if (this._gravity.y < 0 && this._jumped) { //todo: play a falling anim if not grounded BUT not on a slope
            this._isFalling = true;
        }

        //update our movement to account for jumping
        this.mesh.moveWithCollisions(this._moveDirection.addInPlace(this._gravity));

        if (this._isGrounded()) {
            this._gravity.y = 0;
            this._grounded = true;
            //keep track of last known ground position
            this._lastGroundPos.copyFrom(this.mesh.position);

            this._jumpCount = 1;
            //dashing reset
            this._canDash = true;
            //reset sequence(needed if we collide with the ground BEFORE actually completing the dash duration)
            this.dashTime = 0;
            this._dashPressed = false;

            //jump & falling animation flags
            this._jumped = false;
            this._isFalling = false;

        }

        //Jump detection
        if (this._input!.jumpKeyDown && this._jumpCount > 0) {
            this._gravity.y = Player.JUMP_FORCE;
            this._jumpCount--;

            //jumping and falling animation flags
            this._jumped = true;
            this._isFalling = false;
            this._jumpingSfx?.play();

            //tutorial, if the player jumps for the first time
            if(!this.tutorial_jump){
                this.tutorial_jump = true;
            }
        }

    }

    //--GAME UPDATES--
    private _beforeRenderUpdate(): void {
        this._updateFromControls();
        this._updateGroundDetection();
        this._animatePlayer();
    }

    public activatePlayerCamera(): ArcRotateCamera {
        this.scene.registerBeforeRender(() => {

            this._beforeRenderUpdate();
            this._updateCamera();

        })
        return this.camera!;
    }

    //--CAMERA--
    private _updateCamera(): void {

        //trigger areas for rotating camera view
        // if (this.mesh.intersectsMesh(this.scene.getMeshByName("cornerTrigger")!)) {
        //     if (this._input!.horizontalAxis > 0) { //rotates to the right                
        //         this._camRoot!.rotation = Vector3.Lerp(this._camRoot!.rotation, new Vector3(this._camRoot!.rotation.x, Math.PI / 2, this._camRoot!.rotation.z), 0.4);
        //     } else if (this._input!.horizontalAxis < 0) { //rotates to the left
        //         this._camRoot!.rotation = Vector3.Lerp(this._camRoot!.rotation, new Vector3(this._camRoot!.rotation.x, Math.PI, this._camRoot!.rotation.z), 0.4);
        //     }
        // }
        // //rotates the camera to point down at the player when they enter the area, and returns it back to normal when they exit
        // if (this.mesh.intersectsMesh(this.scene.getMeshByName("festivalTrigger")!)) {
        //     if (this._input!.verticalAxis > 0) {
        //         this._yTilt!.rotation = Vector3.Lerp(this._yTilt!.rotation, Player.DOWN_TILT, 0.4);
        //     } else if (this._input!.verticalAxis < 0) {
        //         this._yTilt!.rotation = Vector3.Lerp(this._yTilt!.rotation, Player.ORIGINAL_TILT, 0.4);
        //     }
        // }
        // //once you've reached the destination area, return back to the original orientation, if they leave rotate it to the previous orientation
        // if (this.mesh.intersectsMesh(this.scene.getMeshByName("destinationTrigger")!)) {
        //     if (this._input!.verticalAxis > 0) {
        //         this._yTilt!.rotation = Vector3.Lerp(this._yTilt!.rotation, Player.ORIGINAL_TILT, 0.4);
        //     } else if (this._input!.verticalAxis < 0) {
        //         this._yTilt!.rotation = Vector3.Lerp(this._yTilt!.rotation, Player.DOWN_TILT, 0.4);
        //     }
        // }

        //update camera postion up/down movement
        //let centerPlayer = this.mesh.position.y + 2;
        //this._camRoot!.position = Vector3.Lerp(this._camRoot!.position, new Vector3(this.mesh.position.x, centerPlayer, this.mesh.position.z), 0.4);
    }
}