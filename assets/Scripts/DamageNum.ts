import { _decorator, Color, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DamageNum')
export class DamageNum extends Component {
    start() {
        
    }

    public showDamageNum = (value: number, endCb?: () => void) => {
        const label = this.node.getComponent(Label);
        label.string = `-${value}`;
        const t1 = tween(label.color).to(
            1,
            new Color(204, 204, 204, 0),
            {
                onUpdate: (target: Color) => {
                    label.color = new Color(204, 204, 204, target.a)
                },
                onComplete: endCb
            }
        );
        const t2 = tween(this.node.position).to(1, new Vec3(0, 80, 0));
        t1.start();
        t2.start();
    }

    update(deltaTime: number) {
        
    }
}


