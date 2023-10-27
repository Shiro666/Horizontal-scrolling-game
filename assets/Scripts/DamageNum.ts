import { _decorator, Color, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DamageNum')
export class DamageNum extends Component {
    start() {
        
    }

    public showDamageNum = (value: number, options: {
        isCritical?: boolean;
        isMiss?: boolean;
        endCb?: () => void,
    }) => {
        const label = this.node.getComponent(Label);
        label.string = `-${value}`;
        const color = options.isCritical ? new Color(255, 0, 0, 255) : new Color(204, 204, 204, 255);
        const t1 = tween(label.color).to(
            1,
            new Color(color.r, color.g, color.b, 0),
            {
                onUpdate: (target: Color) => {
                    label.color = new Color(color.r, color.g, color.b, target.a)
                },
                onComplete: options.endCb
            }
        );
        const t2 = tween(this.node.position).to(
            1,
            new Vec3(0, 80, 0),
            {
                onUpdate: (target: Vec3) => {
                    this.node.position = target;
                }
            }
        );
        t1.start();
        t2.start();
    }

    update(deltaTime: number) {
        
    }
}


