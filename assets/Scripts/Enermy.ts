import { _decorator, Animation, Component, instantiate, Label, Node, Prefab } from 'cc';
import { DamageNum } from './DamageNum';
const { ccclass, property } = _decorator;

@ccclass('Enermy')
export class Enermy extends Component {
    @property(Node)
    body: Node = null;

    @property(Prefab)
    damagePrefab: Prefab = null;

    start() {
        this.node.on('damage', this.handleDamage);
    }

    handleDamage = (value: number) => {
        console.log('受到伤害', value)
        const animCpmp = this.body.getComponent(Animation);
        animCpmp.play('enermy-flash');
        const damageNode = instantiate(this.damagePrefab);
        this.node.addChild(damageNode);
        const damageNum = damageNode.getComponent(DamageNum);
        damageNum.showDamageNum(value, () => {
            this.node.removeChild(damageNode);
            damageNode.isValid && damageNode.destroy();
        });
    }

    update(deltaTime: number) {
        
    }
}


