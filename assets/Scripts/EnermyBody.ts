import { _decorator, Animation, Component, Node, Vec3 } from 'cc';
import { HorizontalDirection } from './types';
const { ccclass, property } = _decorator;

@ccclass('EnermyBody')
export class EnermyBody extends Component {
    private animComp: Animation = null;
    public animState: 'idle' | 'attack' = 'idle';

    start() {
        this.animComp = this.node.getComponent(Animation);
    }

    public toggleFace = (dir: HorizontalDirection) => {
        this.node.scale = new Vec3(dir, 1, 0);
    }

    public setAnimState = (state: 'idle' | 'attack', dir?: HorizontalDirection) => {
        this.animState = state;
        switch (state) {
            case 'idle': {
                dir && this.toggleFace(dir);
                this.animComp.play('slim_run');
                break;
            }
            case 'attack': {
                !!dir && this.toggleFace(dir);
                this.animComp.play('slim_attack');
                break;
            }
        }
    }

    finishAttack() {
        this.setAnimState('idle');
        console.log('finish attack');
    }

    update(deltaTime: number) {
        
    }
}


