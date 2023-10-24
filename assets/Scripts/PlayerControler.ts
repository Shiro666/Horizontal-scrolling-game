import { _decorator, Collider2D, Component, Contact2DType, EventKeyboard, Input, input, IPhysics2DContact, KeyCode, PHYSICS_2D_PTM_RATIO, PhysicsSystem2D, Vec2, Vec3 } from 'cc';
import { PlayerBody } from './PlayerBody';
import { PlayerAttack } from './PlayerAttack';
import { HorizontalDirection, PlayerAnimState } from './types';
const { ccclass, property } = _decorator;


let position: Vec3 = new Vec3(0, 0, 0);

@ccclass('PlayerControler')
export class PlayerControler extends Component {
    @property({
        displayName: '移动速度'
    })
    private vx = 10;

    @property(PlayerBody)
    private playerBody: PlayerBody = null;

    @property(PlayerAttack)
    private playerAttack: PlayerAttack = null;

    private horizontalDir: HorizontalDirection = HorizontalDirection.STAND;
    private isAttacking = false;
    private collider: Collider2D = null;

    /** 跳跃相关变量 */
    private isJump = false;
    private isFall = false;
    private upSpeed = 0;
    private gravity = 30;

    protected onDestroy(): void {
        this.removeListener();
    }

    start() {
        this.collider = this.getComponent(Collider2D);
        this.initListener();
    }

    initListener = () => {
        input.on(Input.EventType.KEY_DOWN, this.handleKeyDown);
        input.on(Input.EventType.KEY_UP, this.handleKeyUp);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.handleBeginContact);
        this.collider.on(Contact2DType.END_CONTACT, this.handleEndContact);
    }

    removeListener = () => {
        input.off(Input.EventType.KEY_DOWN, this.handleKeyDown);
        input.off(Input.EventType.KEY_UP, this.handleKeyUp);
        
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.handleBeginContact);
        this.collider.off(Contact2DType.END_CONTACT, this.handleEndContact);
    }

    handleBeginContact = (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
        window.setTimeout(() => {
            // 判断是否落地，恢复跳跃功能
            console.log('begin contact', selfCollider.tag, otherCollider.tag);
            // if (this.playerBody.animState === PlayerAnimState.JUMP && Math.abs(this.rigidbody.linearVelocity.y) < Math.pow(10, -10)) {
            //     this.playerBody.setAnimState(this.horizontalDir ? PlayerAnimState.WALK : PlayerAnimState.STAND, this.horizontalDir);
            // }
        }, 0);
    }

    handleEndContact = (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
        // 撞墙后速度恢复
        console.log('end contact', otherCollider.tag)
        if (!this.isJump && !this.isFall && !this.checkIsGround()) {
            this.isJump = true;
            this.isFall = true;
            this.upSpeed = 0;
        }
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
                if (this.isJump) {
                    return;
                }
                this.playerBody.setAnimState(PlayerAnimState.JUMP);
                this.upSpeed = 15;
                this.isJump = true;
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
        const isWall = this.checkIsWall();
        const delteX = isWall ? 0 : this.vx * PHYSICS_2D_PTM_RATIO * dt * this.horizontalDir;
        let deltaY = 0;
        if (this.isJump) {
            const ground = this.checkIsGround();
            if (this.isFall && ground) {
                this.isJump = false;
                this.isFall = false;
                const groundPosition = ground.node.getWorldPosition();
                const posY = groundPosition.y + ground.worldAABB.height / 2 - 2;
                this.node.inverseTransformPoint(position, new Vec3(0, posY, 0));
                deltaY = position.y;
                this.horizontalDir === HorizontalDirection.STAND
                    ? this.playerBody.setAnimState(PlayerAnimState.STAND)
                    : this.playerBody.setAnimState(PlayerAnimState.WALK, this.horizontalDir);
            } else {
                this.upSpeed -= this.gravity * dt;
                if (this.upSpeed < 0) {
                    this.isFall = true;
                }
                deltaY = this.upSpeed * PHYSICS_2D_PTM_RATIO * dt;
            }
        }
        this.node.position = new Vec3(this.node.position.x + delteX, this.node.position.y + deltaY, 0);
    }

    checkIsGround = () => {
        this.node.getWorldPosition(position);
        const point = new Vec2(position.x, position.y - 4);
        const hits = PhysicsSystem2D.instance.testPoint(point);
        return hits.length > 0 ? hits[0] : null;
    }

    checkIsWall = () => {
        if (this.horizontalDir === HorizontalDirection.STAND) {
            return false;
        }
        const rect = this.collider.worldAABB;
        this.node.getWorldPosition(position);
        const point = new Vec2(
            this.horizontalDir === HorizontalDirection.LEFT ? position.x - rect.width / 2 - 1 : position.x + rect.width / 2 + 1,
            position.y + 5
        );
        const hits = PhysicsSystem2D.instance.testPoint(point);
        return hits.length > 0;
    }

    protected update(dt: number): void {
        this.handleMove(dt);
    }
}


