import { _decorator, Collider2D, Component, Contact2DType, EPhysics2DDrawFlags, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, PHYSICS_2D_PTM_RATIO, PhysicsSystem2D, RigidBody2D, Vec2, Vec3 } from 'cc';
import { PlayerBody } from './PlayerBody';
import { PlayerAttack } from './PlayerAttack';
import { HorizontalDirection, PlayerAnimState } from './types';
import { PlayerCamera } from './PlayerCamera';
const { ccclass, property } = _decorator;

/** 水平移动方向 */


@ccclass('PlayerControler')
export class PlayerControler extends Component {
    @property({
        displayName: '移动速度'
    })
    private vx = 10;

    @property({
        displayName: '跳跃力'
    })
    private jumpHeight = 10;

    @property(PlayerBody)
    private playerBody: PlayerBody = null;

    @property(PlayerAttack)
    private playerAttack: PlayerAttack = null;

    @property(PlayerCamera)
    private playerCamera: PlayerCamera = null;

    private rigidbody: RigidBody2D | null = null;
    private horizontalDir: HorizontalDirection = HorizontalDirection.STAND;
    private isJumping = false;
    private isAttacking = false;

    protected onLoad(): void {
        this.initListener();
        this.rigidbody = this.getComponent(RigidBody2D);
    }

    protected onDestroy(): void {
        this.removeListener();
    }

    start() {
        
    }

    initListener = () => {
        input.on(Input.EventType.KEY_DOWN, this.handleKeyDown);
        input.on(Input.EventType.KEY_UP, this.handleKeyUp);
        const collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.handleBeginContact);
        collider.on(Contact2DType.END_CONTACT, this.handleEndContact);
    }

    removeListener = () => {
        input.off(Input.EventType.KEY_DOWN, this.handleKeyDown);
        input.off(Input.EventType.KEY_UP, this.handleKeyUp);
        const collider = this.getComponent(Collider2D);
        collider.off(Contact2DType.BEGIN_CONTACT, this.handleBeginContact);
        collider.off(Contact2DType.END_CONTACT, this.handleEndContact);
    }

    handleBeginContact = (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
        window.setTimeout(() => {
            // 判断是否落地，恢复跳跃功能
            console.log('begin contact', this.rigidbody.linearVelocity.y, otherCollider.tag);
            if (this.playerBody.animState === PlayerAnimState.JUMP && Math.abs(this.rigidbody.linearVelocity.y) < Math.pow(10, -10)) {
                this.playerBody.setAnimState(this.horizontalDir ? PlayerAnimState.WALK : PlayerAnimState.STAND, this.horizontalDir);
            }
        }, 0);
    }

    handleEndContact = (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
        // 撞墙后速度恢复
        console.log('end contact', otherCollider.tag)
        // this.playerBody.setAnimState(this.horizontalDir ? PlayerAnimState.WALK : PlayerAnimState.STAND, this.horizontalDir);
    }

    handleKeyDown = (event: EventKeyboard) => {
        switch (event.keyCode) {
            // 攻击
            case KeyCode.KEY_A: {
                if (this.isAttacking) {
                    return;
                }
                this.isAttacking = true;
                this.playerAttack.attack().then(() => {
                    this.isAttacking = false;
                });
                break;
            }
            case KeyCode.ARROW_UP: {
                break;
            }
            case KeyCode.ARROW_DOWN: {
                break;
            }
            case KeyCode.ARROW_LEFT: {
                this.horizontalDir = HorizontalDirection.LEFT;
                if (this.playerBody.animState !== PlayerAnimState.JUMP) {
                    this.playerBody.setAnimState(PlayerAnimState.WALK, this.horizontalDir);
                } else {
                    this.playerBody.toggleFace(this.horizontalDir);
                }
                break;
            }
            case KeyCode.ARROW_RIGHT: {
                this.horizontalDir = HorizontalDirection.RIGHT;
                if (this.playerBody.animState !== PlayerAnimState.JUMP) {
                    this.playerBody.setAnimState(PlayerAnimState.WALK, this.horizontalDir);
                } else {
                    this.playerBody.toggleFace(this.horizontalDir);
                }
                break;
            }
            case KeyCode.SPACE: {
                if (this.playerBody.animState === PlayerAnimState.JUMP) {
                    return;
                }
                this.playerBody.setAnimState(PlayerAnimState.JUMP);
                this.rigidbody.applyForceToCenter(new Vec2(0, this.jumpHeight), true);
                break;
            }
        }
    }

    handleKeyUp = (event: EventKeyboard) => {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP: {
                break;
            }
            case KeyCode.ARROW_DOWN: {
                break;
            }
            case KeyCode.ARROW_LEFT: {
                if (this.horizontalDir === HorizontalDirection.LEFT) {
                    this.horizontalDir = HorizontalDirection.STAND;
                    this.playerBody.animState !== PlayerAnimState.JUMP && this.playerBody.setAnimState(PlayerAnimState.STAND);
                }
                break;
            }
            case KeyCode.ARROW_RIGHT: {
                if (this.horizontalDir === HorizontalDirection.RIGHT) {
                    this.horizontalDir = HorizontalDirection.STAND;
                    this.playerBody.animState !== PlayerAnimState.JUMP && this.playerBody.setAnimState(PlayerAnimState.STAND);
                }
                break;
            }
        }
    }

    handleMove = (dt: number) => {
        if (this.playerBody.animState !== PlayerAnimState.JUMP) {
            this.rigidbody.linearVelocity = new Vec2(this.vx * this.horizontalDir, this.rigidbody.linearVelocity.y);
        } else {
            this.rigidbody.linearVelocity = new Vec2(this.vx * this.horizontalDir, this.rigidbody.linearVelocity.y);
        }
        // this.node.position = new Vec3(this.node.position.x + this.vx * this.horizontalDir * dt, this.node.position.y, 0);
    }

    protected update(dt: number): void {
        

        this.handleMove(dt);
        this.playerCamera.updatePosition(this.node.position);
    }

    protected lateUpdate(dt: number): void {
        
        
    }
}


