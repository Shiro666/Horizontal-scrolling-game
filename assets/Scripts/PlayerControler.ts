import { _decorator, Collider2D, Component, Contact2DType, EventKeyboard, game, Input, input, KeyCode, PHYSICS_2D_PTM_RATIO, PhysicsSystem2D, Vec2, Vec3 } from 'cc';
import { PlayerBody } from './PlayerBody';
import { ColliderTag, HorizontalDirection, PlayerAnimState } from './types';
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

    private horizontalDir: HorizontalDirection = HorizontalDirection.STAND;
    private isAttacking = false;
    private collider: Collider2D = null;

    /** 跳跃相关变量 */
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

    handleBeginContact = (selfCollider: Collider2D, otherCollider: Collider2D) => {
        // 下落中接触地面
        if (this.playerBody.animState === PlayerAnimState.JUMP && this.isFall && otherCollider.tag === ColliderTag.GROUND) {
            otherCollider.node.getWorldPosition(position);
            const posY = position.y;
            selfCollider.node.getWorldPosition(position);
            if (position.y - 2 * this.upSpeed * PHYSICS_2D_PTM_RATIO / (game.frameRate as number) > posY) {
                this.node.inverseTransformPoint(position, new Vec3(0, posY, 0));
                this.node.position = new Vec3(this.node.position.x, this.node.position.y + position.y, 0);
                this.isFall = false;
                this.resetAnimState();
            }
        }
    }

    handleEndContact = (selfCollider: Collider2D, otherCollider: Collider2D) => {
        // 离开平台后自然下落
        if (this.playerBody.animState !== PlayerAnimState.JUMP && !this.isFall && !this.checkIsGround() && otherCollider.tag === ColliderTag.GROUND) {
            this.playerBody.setAnimState(PlayerAnimState.JUMP);
            this.isFall = true;
            this.upSpeed = 0;
        }
    }

    handleKeyDown = (event: EventKeyboard) => {
        switch (event.keyCode) {
            // 攻击
            case KeyCode.KEY_A: {
                if (this.playerBody.animState === PlayerAnimState.ATTACK || this.playerBody.animState === PlayerAnimState.JUMP) {
                    return;
                }
                this.playerBody.attack(this.resetAnimState);
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
                if (this.playerBody.animState === PlayerAnimState.ATTACK) {
                    return;
                }
                if (this.playerBody.animState !== PlayerAnimState.JUMP) {
                    this.playerBody.setAnimState(PlayerAnimState.WALK, this.horizontalDir);
                } else {
                    this.playerBody.toggleFace(this.horizontalDir);
                }
                break;
            }
            case KeyCode.ARROW_RIGHT: {
                this.horizontalDir = HorizontalDirection.RIGHT;
                if (this.playerBody.animState === PlayerAnimState.ATTACK) {
                    return;
                }
                if (this.playerBody.animState !== PlayerAnimState.JUMP) {
                    this.playerBody.setAnimState(PlayerAnimState.WALK, this.horizontalDir);
                } else {
                    this.playerBody.toggleFace(this.horizontalDir);
                }
                break;
            }
            case KeyCode.SPACE: {
                if (this.playerBody.animState === PlayerAnimState.JUMP || this.playerBody.animState === PlayerAnimState.ATTACK) {
                    return;
                }
                this.playerBody.setAnimState(PlayerAnimState.JUMP);
                this.upSpeed = 17;
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
                    if (this.playerBody.animState !== PlayerAnimState.JUMP  && this.playerBody.animState !== PlayerAnimState.ATTACK) {
                        this.playerBody.setAnimState(PlayerAnimState.STAND);
                    }
                }
                break;
            }
            case KeyCode.ARROW_RIGHT: {
                if (this.horizontalDir === HorizontalDirection.RIGHT) {
                    this.horizontalDir = HorizontalDirection.STAND;
                    if (this.playerBody.animState !== PlayerAnimState.JUMP  && this.playerBody.animState !== PlayerAnimState.ATTACK) {
                        this.playerBody.setAnimState(PlayerAnimState.STAND);
                    }
                }
                break;
            }
        }
    }

    handleMove = (dt: number) => {
        const isWall = this.checkIsWall();
        const delteX = isWall || this.playerBody.animState === PlayerAnimState.ATTACK ?
            0 : this.vx * PHYSICS_2D_PTM_RATIO * dt * this.horizontalDir;
        let deltaY = 0;
        if (this.playerBody.animState === PlayerAnimState.JUMP) {
            this.upSpeed -= this.gravity * dt;
            if (this.upSpeed < 0) {
                this.isFall = true;
            }
            deltaY = this.upSpeed * PHYSICS_2D_PTM_RATIO * dt;
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
        if (hits.length > 0) {
            const tag = hits[0].node.getComponent(Collider2D).tag;
            return tag === ColliderTag.WALL;
        }
        return false;
    }

    resetAnimState = () => {
        this.horizontalDir === HorizontalDirection.STAND
            ? this.playerBody.setAnimState(PlayerAnimState.STAND)
            : this.playerBody.setAnimState(PlayerAnimState.WALK, this.horizontalDir);
    }

    protected update(dt: number): void {
        this.handleMove(dt);
    }
}


