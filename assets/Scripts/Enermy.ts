import { _decorator, CCInteger, CCObject, Component, Node, PHYSICS_2D_PTM_RATIO, Vec3 } from 'cc';
import { HorizontalDirection } from './types';
const { ccclass, property } = _decorator;

let timer = 0;

@ccclass('Enermy')
export class Enermy extends Component {
    @property(CCInteger)
    private vx = 5;

    @property({
        group: {
            name: 'LimitPosition',
            id: '1'
        },
        type: CCInteger
    })
    private left = 0;
    @property({
        group: {
            name: 'LimitPosition',
            id: '1'
        },
        type: CCInteger
    })
    private right = 0;

    @property(Node)
    private body: Node = null;


    private dir: HorizontalDirection = HorizontalDirection.STAND;

    start() {
        this.runEvent();
        console.log('slim start')
    }

    protected onDestroy(): void {
        clearTimeout(timer);
        console.log('slim destroy')
    }

    runEvent = () => {
        // 随机2-5秒后开始移动
        const randomTime = Math.ceil(Math.random() * 2 + 3);
        timer = window.setTimeout(() => {
            this.setDir((Math.random() - 0.5) < 0 ? HorizontalDirection.LEFT : HorizontalDirection.RIGHT);
            clearTimeout(timer);
            this.stopRunEvent();
        }, randomTime * 1000);
    }

    stopRunEvent = () => {
        // 随机2-5秒后停止移动
        const randomTime = Math.ceil(Math.random() * 2 + 3);
        timer = window.setTimeout(() => {
            this.setDir(HorizontalDirection.STAND);
            clearTimeout(timer);
            this.runEvent();
        }, randomTime * 1000);
    }

    setDir = (dir: HorizontalDirection) => {
        this.dir = dir;
        console.log('set dir', dir, this.body);
        if (dir !== HorizontalDirection.STAND) {
            this.body.scale = new Vec3(dir, 1, 0);
        }
    }

    update(dt: number) {
        if (this.dir !== HorizontalDirection.STAND) {
            const deltaX = this.vx * dt * PHYSICS_2D_PTM_RATIO * this.dir;
            if ((this.node.position.x + deltaX) < this.left || (this.node.position.x + deltaX) > this.right) {
                // 到达移动限制范围，掉头
                this.setDir(this.dir *= -1);
                this.node.position = new Vec3(this.node.position.x - deltaX, this.node.position.y, 0);
            } else {
                this.node.position = new Vec3(this.node.position.x + deltaX, this.node.position.y, 0);
            }
        }
    }
}


