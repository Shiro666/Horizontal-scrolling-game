import { _decorator, Component, Node } from 'cc';
import { SkillType } from './types';
import playerAttr from './common/playerAttr';
const { ccclass, property } = _decorator;

@ccclass('PlayerAtkBox')
export class PlayerAtkBox extends Component {
    /** 当前使用的技能 */
    public currentSkill = SkillType.NONE;
    /** 当前碰撞到的伤害系数 */
    public hurtRatio = 0;
}


