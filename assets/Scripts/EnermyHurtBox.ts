import { _decorator, Animation, CCInteger, Collider2D, Component, Contact2DType, instantiate, Material, Node, Prefab, Sprite, Vec3 } from 'cc';
import { DamageNum } from './DamageNum';
import { ColliderTag } from './types';
import { PlayerAtkBox } from './PlayerAtkBox';
import playerAttr from './common/playerAttr';
const { ccclass, property } = _decorator;

let timer = 0;

@ccclass('EnermyHurtBox')
export class EnermyHurtBox extends Component {

    @property(Node)
    body: Node = null;

    @property(Prefab)
    damagePrefab: Prefab = null;

    @property(Material)
    flashMaterial: Material = null;

    @property(CCInteger)
    height: number = 0;

    private oldMaterial: Material = null;

    start() {
        const collider = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.handleBeginContact);
        const sprite = this.body.getComponent(Sprite);
        this.oldMaterial = sprite.getMaterial(0);
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
        const sprite = this.body.getComponent(Sprite);
        sprite.setMaterial(this.flashMaterial, 0);
        timer && clearTimeout(timer);
        timer = window.setTimeout(() => {
            sprite.setMaterial(this.oldMaterial, 0);
            clearTimeout(timer);
        }, 100);

        // 伤害数字
        const damageNode = instantiate(this.damagePrefab);
        this.body.parent.addChild(damageNode);
        damageNode.position = new Vec3(0, this.height, 0);
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


