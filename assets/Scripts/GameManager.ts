import { _decorator, Component, director, find, game, instantiate, Node, NodeEventType, Prefab, Vec3 } from 'cc';
import { PlayerControler } from './PlayerControler';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    private playerManagerPrefab: Prefab = null;

    @property(Prefab)
    private slimPrefab: Prefab = null;

    private playerManager: Node = null;

    protected onLoad(): void {
        director.addPersistRootNode(this.node);
    }
    start() {
        game.frameRate = 60;
        console.log('game manager start')
        this.initPlayer();
        this.initSlim();
    }

    private initPlayer = (position?: Vec3) => {
        this.playerManager = instantiate(this.playerManagerPrefab);
        const canvas = find('Canvas');
        canvas.addChild(this.playerManager);
        const player = find('Player', this.playerManager);
        player.position = position ? position: new Vec3(0, -221, 0);
    }

    private initSlim = () => {
        console.log('init slim');
        const slim = instantiate(this.slimPrefab);
        const canvas = find('Canvas');
        canvas.addChild(slim);
    }

    public handleSceneChange = (sceneName: string, position: Vec3) => {
        this.playerManager.destroy();
        director.loadScene(sceneName, () => {
            this.initPlayer(position);
            if (sceneName === 'game-main'){
                this.initSlim();
            }
        });
    }

    update(deltaTime: number) {
        
    }
}


