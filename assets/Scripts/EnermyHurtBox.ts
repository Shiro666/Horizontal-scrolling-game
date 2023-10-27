import { _decorator, Animation, Collider2D, Component, Contact2DType, instantiate, Node, Prefab, Vec3 } from 'cc';
import { DamageNum } from './DamageNum';
import { ColliderTag } from './types';
import { PlayerAtkBox } from './PlayerAtkBox';
import playerAttr from './common/playerAttr';
const { ccclass, property } = _decorator;

@ccclass('EnermyHurtBox')
export class EnermyHurtBox extends Component {

    @property(Node)
    body: Node = null;

    @property(Prefab)
    damagePrefab: Prefab = null;

    start() {
        const collider = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.handleBeginContact);
    }

    handleBeginContact = (selfCollider: Collider2D, otherCollider: Collider2D) => {
        if (otherCollider.tag !== ColliderTag.PLAYER_ATKBOX) {
            return;
        }
        // 计算伤害
        const player = otherCollider.node.getComponent(PlayerAtkBox);
        const isCritical = Math.random() <= playerAttr.CRIT;
        const hurt = this.calcHurt(player.hurtRatio, isCritical);

        // 闪烁特效
        const animCpmp = this.body.getComponent(Animation);
        animCpmp.play('enermy-flash');
        // 伤害数字
        const damageNode = instantiate(this.damagePrefab);
        this.node.addChild(damageNode);
        damageNode.position = new Vec3(0, 40, 0);
        const damageNum = damageNode.getComponent(DamageNum);
        damageNum.showDamageNum(hurt, {
            isCritical: isCritical,
            endCb: () => {
                this.node.removeChild(damageNode);
                damageNode.isValid && damageNode.destroy();
            }
        });
    }

    calcHurt = (ratio: number, isCritical: boolean) => {
        return isCritical ? playerAttr.ATK * ratio * 1.5 : playerAttr.ATK * ratio;
    }
}


