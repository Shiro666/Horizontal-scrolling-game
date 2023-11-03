import { _decorator, CCInteger, Collider2D, Component, Contact2DType, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ColliderTag } from './types';
import { DamageNum } from './DamageNum';
const { ccclass, property } = _decorator;

@ccclass('PlayerHurtBox')
export class PlayerHurtBox extends Component {
    @property(Node)
    body: Node = null;

    @property(Prefab)
    damagePrefab: Prefab = null;

    @property(CCInteger)
    height: number = 0;

    start() {
        const collider = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.handleBeginContact);
    }

    handleBeginContact = (selfCollider: Collider2D, otherCollider: Collider2D) => {
        if (otherCollider.tag !== ColliderTag.ENERMY_ATKBOX) {
            return;
        }
        // 计算伤害
        const hurt = 1;

        // 伤害数字
        const damageNode = instantiate(this.damagePrefab);
        this.body.parent.addChild(damageNode);
        damageNode.position = new Vec3(0, this.height, 0);
        const damageNum = damageNode.getComponent(DamageNum);
        damageNum.showDamageNum(hurt, {
            isCritical: false,
            endCb: () => {
                this.node.removeChild(damageNode);
                damageNode.isValid && damageNode.destroy();
            }
        });
    }
}


