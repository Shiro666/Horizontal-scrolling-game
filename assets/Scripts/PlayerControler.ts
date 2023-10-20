import { _decorator, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, RigidBody2D, Vec2 } from 'cc';
import { PlayerBody } from './PlayerBody';
import { PlayerAttack } from './PlayerAttack';
const { ccclass, property } = _decorator;


@ccclass('PlayerControler')
export class PlayerControler extends Component {
    @property({
        displayName: '移动速度'
    })
    private vx = 10;

    @property({
        displayName: '跳跃高度'
    })
    private jumpHeight = 10;

    @property(PlayerBody)
    private playerBody: PlayerBody = null;

    @property(PlayerAttack)
    private playerAttack: PlayerAttack = null;

    private rigidbody: RigidBody2D | null = null;
    private isMovingLeft = false;
    private isMovingRight = false;
    private faceDirection: 'left' | 'right' = 'right';
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
            console.log(this.rigidbody.linearVelocity.y)
            // 判断是否落地，恢复跳跃功能
            if (this.isJumping && Math.abs(this.rigidbody.linearVelocity.y) < Math.pow(10, -10)) {
                this.isJumping = false;
                this.handleMove();
            }
        }, 20);
    }

    handleEndContact = () => {
        
        // 撞墙后速度恢复
        this.handleMove();
    }

    handleKeyDown = (event: EventKeyboard) => {
        switch (event.keyCode) {
            // 攻击
            case KeyCode.KEY_A: {
                if (this.isAttacking) {
                    return;
                }
                this.isAttacking = true;
                this.handleMove();
                this.playerAttack.attack(this.faceDirection).then(() => {
                    this.isAttacking = false;
                    this.handleMove();
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
                this.isMovingLeft = true;
                this.handleMove();
                break;
            }
            case KeyCode.ARROW_RIGHT: {
                this.isMovingRight = true;
                this.handleMove();
                break;
            }
            case KeyCode.SPACE: {
                if (this.isJumping) {
                    return;
                }
                // 离地，锁定跳跃功能
                this.isJumping = true;
                this.rigidbody.linearVelocity = new Vec2(this.rigidbody.linearVelocity.x, this.jumpHeight);
                this.playerBody.idle();
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
                this.isMovingLeft = false;
                this.handleMove();
                break;
            }
            case KeyCode.ARROW_RIGHT: {
                this.isMovingRight = false;
                this.handleMove();
                break;
            }
        }
    }

    handleMove = () => {
        // 向左移动
        if (this.isMovingLeft && !this.isMovingRight && !this.isAttacking) {
            !this.isJumping && this.playerBody.walkLeft();
            this.rigidbody.linearVelocity = new Vec2(-1 * this.vx, this.rigidbody.linearVelocity.y);
        }
        // 向右移动
        if (!this.isMovingLeft && this.isMovingRight && !this.isAttacking) {
            !this.isJumping && this.playerBody.walkRight();
            this.rigidbody.linearVelocity = new Vec2(this.vx, this.rigidbody.linearVelocity.y);
        }
        // 停止移动
        if (!this.isMovingLeft && !this.isMovingRight || this.isAttacking) {
            this.playerBody.idle();
            this.rigidbody.linearVelocity = new Vec2(0, this.rigidbody.linearVelocity.y);
        }
    }

    protected update(dt: number): void {
        if (this.rigidbody.linearVelocity.x > 0) {
            this.faceDirection = 'right';
        } else if (this.rigidbody.linearVelocity.x < 0) {
            this.faceDirection = 'left';
        }
    }
}


