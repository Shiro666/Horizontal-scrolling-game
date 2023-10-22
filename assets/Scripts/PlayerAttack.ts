import { _decorator, Animation, Collider2D, Component, math, Node, PhysicsSystem2D, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum ColliderTag {
    PLAYER = 1,
    ENERMY = 2
}

@ccclass('PlayerAttack')
export class PlayerAttack extends Component {
    private animCpmp: Animation = null;
    private collider: Collider2D = null;

    start() {
        this.animCpmp = this.node.getComponent(Animation);
        this.collider = this.node.getComponent(Collider2D);
    }

    attack = () => {
        return new Promise((resolve) => {
            this.animCpmp.once(Animation.EventType.FINISHED, resolve)
            this.animCpmp.play('attack');
            const uiTransform = this.node.getComponent(UITransform);
            const rect = uiTransform.getBoundingBoxToWorld();
            const colliderList = PhysicsSystem2D.instance.testAABB(rect);
            for (let i = 0; i < colliderList.length; i++) {
                if (colliderList[i].tag === ColliderTag.ENERMY) {
                    colliderList[i].node.emit('damage', Math.ceil(Math.random() * 9));
                }
            }
        });
    }

    update(deltaTime: number) {
        
    }
}


