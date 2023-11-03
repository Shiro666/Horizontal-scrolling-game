import { _decorator, CCInteger, CCObject, Component, find, Node, PHYSICS_2D_PTM_RATIO, Vec3 } from 'cc';
import { HorizontalDirection, PlayerAnimState } from './types';
import { EnermyBody } from './EnermyBody';
import { PlayerBody } from './PlayerBody';
const { ccclass, property } = _decorator;

let timer = 0;

@ccclass('Enermy')
export class Enermy extends Component {
    @property(CCInteger)
    private vx = 5;

    public left = -580;
    public right = 550;

    @property(EnermyBody)
    private body: EnermyBody = null;

    private dir: HorizontalDirection = HorizontalDirection.STAND;

    public player: Node = null;
    private playerBody: PlayerBody = null;

    /** 是否正在跟踪玩家 */
    private isFollow = false;
    /** 是否正在攻击CD */
    private isAttackCD = false;

    start() {
        this.runEvent();
    }

    protected onDestroy(): void {
        clearTimeout(timer);
    }

    runEvent = () => {
        // 随机2-5秒后开始移动
        const randomTime = Math.ceil(Math.random() * 2 + 3);
        timer && clearTimeout(timer);
        timer = window.setTimeout(() => {
            this.setDir((Math.random() - 0.5) < 0 ? HorizontalDirection.LEFT : HorizontalDirection.RIGHT);
            clearTimeout(timer);
            this.stopRunEvent();
        }, randomTime * 1000);
    }

    stopRunEvent = () => {
        // 随机2-5秒后停止移动
        const randomTime = Math.ceil(Math.random() * 2 + 3);
        timer && clearTimeout(timer);
        timer = window.setTimeout(() => {
            this.setDir(HorizontalDirection.STAND);
            clearTimeout(timer);
            this.runEvent();
        }, randomTime * 1000);
    }

    setLimitPosition = (left: number, right: number) => {
        this.left = left;
        this.right = right;
    }

    setDir = (dir: HorizontalDirection) => {
        this.dir = dir;
        if (dir !== HorizontalDirection.STAND) {
            this.body.toggleFace(dir);
        }
    }

    setPlayer(player: Node) {
        this.player = player;
        this.playerBody = find('Body', this.player).getComponent(PlayerBody);
    }

    handleFollow = (distanceX: number) => {
        // 靠近玩家，开始
        this.isFollow = true;
        timer && clearTimeout(timer);
        const dir = distanceX > 0 ? HorizontalDirection.LEFT : HorizontalDirection.RIGHT;
        this.setDir(dir);
        if (Math.abs(distanceX) <= 60) {
            if (!this.isAttackCD) {
                // 攻击cd
                this.isAttackCD = true;
                this.body.setAnimState('attack', dir);
                const timer2 = window.setTimeout(() => {
                    this.isAttackCD = false;
                    clearTimeout(timer2);
                }, 2 * 1000);
            } else {
                this.setDir(HorizontalDirection.STAND);
            }
        }
    }

    handleCancelFollow = () => {
        this.isFollow = false;
        this.setDir(HorizontalDirection.STAND);
        this.runEvent();
        console.log('cancel follow')
    }

    update(dt: number) {
        if (this.player && this.body.animState !== 'attack') {
            const distanceX = this.node.position.x - this.player.position.x;
            const distanceY = this.node.position.y - this.player.position.y;
            if (this.isFollow && this.playerBody.animState === PlayerAnimState.JUMP && Math.abs(distanceX) < 300) {
                this.handleFollow(distanceX);
            } else if (Math.abs(distanceY) < 10 && this.playerBody.animState !== PlayerAnimState.JUMP && Math.abs(distanceX) < 300) {
                // 处于同一平台
                this.handleFollow(distanceX);
            } else if (this.isFollow && Math.abs(distanceX) > 300) {
                // 玩家离开范围，取消追踪
                this.handleCancelFollow();
            } else if (this.isFollow && Math.abs(distanceY) > 10 && this.playerBody.animState !== PlayerAnimState.JUMP) {
                // 玩家离开平台，取消追踪
                this.handleCancelFollow();
            }
        }
        if (this.dir !== HorizontalDirection.STAND && this.body.animState !== 'attack') {
            const deltaX = this.vx * dt * PHYSICS_2D_PTM_RATIO * this.dir;
            if ((this.node.position.x + deltaX) < this.left || (this.node.position.x + deltaX) > this.right) {
                // 到达移动限制范围，掉头
                this.setDir(this.dir *= -1);
                this.node.position = new Vec3(this.node.position.x - deltaX, this.node.position.y, 0);
                if (this.isFollow) {
                    // 取消追踪
                    this.handleCancelFollow();
                }
            } else {
                this.node.position = new Vec3(this.node.position.x + deltaX, this.node.position.y, 0);
            }
        }
    }
}


