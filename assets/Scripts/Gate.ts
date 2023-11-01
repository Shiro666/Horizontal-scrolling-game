import { _decorator, CCString, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Gate')
export class Gate extends Component {
    @property(CCString)
    public sceneName = '';

    @property(Vec3)
    public nextPosition: Vec3 = new Vec3(0, 0, 0);

    start() {

    }

    update(deltaTime: number) {
        
    }
}


