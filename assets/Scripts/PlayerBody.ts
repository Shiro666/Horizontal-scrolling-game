import { _decorator, Animation, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerBody')
export class PlayerBody extends Component {
    private animComp: Animation | null = null;
    private defaultSprite: SpriteFrame | null = null;

    start() {
        this.animComp = this.node.getComponent(Animation);
        const sprite = this.node.getComponent(Sprite);
        this.defaultSprite = sprite.spriteFrame;
    }

    public walkLeft = () => {
        this.node.scale = new Vec3(-1, 1, 0);
        this.animComp.play('walk');
    }

    public walkRight = () => {
        this.node.scale = new Vec3(1, 1, 0);
        this.animComp.play('walk');
    }

    /** 站立时面向 */
    public idle = () => {
        this.animComp.stop();
        const sprite = this.node.getComponent(Sprite);
        sprite.spriteFrame = this.defaultSprite;
    }

    update(deltaTime: number) {
        
    }
}


