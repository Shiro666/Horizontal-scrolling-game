import { _decorator, Animation, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { HorizontalDirection, PlayerAnimState } from './types';
const { ccclass, property } = _decorator;

@ccclass('PlayerBody')
export class PlayerBody extends Component {
    private animComp: Animation | null = null;
    private defaultSprite: SpriteFrame | null = null;
    public animState: PlayerAnimState = PlayerAnimState.STAND;

    start() {
        this.animComp = this.node.getComponent(Animation);
        const sprite = this.node.getComponent(Sprite);
        this.defaultSprite = sprite.spriteFrame;
    }

    public toggleFace = (dir: HorizontalDirection) => {
        this.node.scale = new Vec3(dir, 1, 0);
    }

    public setAnimState = (state: PlayerAnimState, dir?: HorizontalDirection) => {
        this.animState = state;
        switch (state) {
            case PlayerAnimState.STAND: {
                this.animComp.stop();
                const sprite = this.node.getComponent(Sprite);
                sprite.spriteFrame = this.defaultSprite;
                break;
            }
            case PlayerAnimState.WALK: {
                this.toggleFace(dir);
                this.animComp.play('walk');
                break;
            }
            case PlayerAnimState.JUMP: {
                this.animComp.stop();
                const sprite = this.node.getComponent(Sprite);
                sprite.spriteFrame = this.defaultSprite;
                break;
            }
            
        }
    }

    update(deltaTime: number) {
        
    }
}


