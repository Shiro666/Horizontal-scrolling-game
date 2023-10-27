import { _decorator, Component, game, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    protected onLoad(): void {
        this.node._persistNode = true;
    }
    start() {
        game.frameRate = 60;
    }

    update(deltaTime: number) {
        
    }
}


