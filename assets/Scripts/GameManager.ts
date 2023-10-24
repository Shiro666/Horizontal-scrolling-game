import { _decorator, Component, game, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    start() {
        game.frameRate = 60;
    }

    update(deltaTime: number) {
        
    }
}


