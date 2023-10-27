import { _decorator, Animation, AudioSource, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { HorizontalDirection, PlayerAnimState, SkillType } from './types';
import { PlayerAtkBox } from './PlayerAtkBox';
const { ccclass, property } = _decorator;

let timer = 0;

@ccclass('PlayerBody')
export class PlayerBody extends Component {
    private animComp: Animation = null;
    private defaultSprite: SpriteFrame | null = null;
    public animState: PlayerAnimState = PlayerAnimState.STAND;
    private atkCombo = 0;
    private audioComp: AudioSource = null;

    @property(PlayerAtkBox)
    atkBox: PlayerAtkBox = null;

    start() {
        this.animComp = this.node.getComponent(Animation);
        this.audioComp = this.node.getComponent(AudioSource);
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

    public attack = (cb: () => void) => {
        this.atkBox.currentSkill = SkillType.A;
        this.atkCombo += 1;
        this.animComp.stop();
        this.animComp.once(Animation.EventType.FINISHED, () => {
            this.atkBox.currentSkill = SkillType.NONE;
            cb();
        });
        this.animState = PlayerAnimState.ATTACK;
        this.animComp.play(this.atkCombo === 1 ? 'attack2' : 'attack1');
        this.playAudio();
        if (this.atkCombo === 2) {
            this.atkCombo = 0;
        } else {
            timer && clearTimeout(timer);
            timer = window.setTimeout(() => {
                this.atkCombo = 0;
                clearTimeout(timer);
            }, 1000);
        }
    }

    playAudio = () => {
        this.audioComp.playOneShot(this.audioComp.clip, 0.5);
    }

    public updateHurtRatio = (ratio: number) => {
        this.atkBox.hurtRatio = ratio;
    }

    update(deltaTime: number) {
        
    }
}


