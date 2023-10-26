import { _decorator, Component, Node } from 'cc';
import { SkillType } from './types';
const { ccclass, property } = _decorator;

@ccclass('PlayerAtkBox')
export class PlayerAtkBox extends Component {
    public currentSkill = SkillType.NONE;

    start() {

    }
}


