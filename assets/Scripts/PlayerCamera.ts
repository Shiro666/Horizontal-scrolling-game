import { _decorator, Component, Node, Vec3 } from 'cc';
import { PlayerControler } from './PlayerControler';
const { ccclass, property } = _decorator;

@ccclass('PlayerCamera')
export class PlayerCamera extends Component {
    @property(Node)
    private player: Node | null = null;

    start() {

    }

    update(deltaTime: number) {
        const position = this.player.position;
        // x轴范围-120~120
        const x = Math.max(-120, Math.min(120, position.x));
        this.node.position = new Vec3(x, Math.max(0, position.y), position.z);
    }
}


