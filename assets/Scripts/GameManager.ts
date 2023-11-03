import { _decorator, Component, director, find, game, instantiate, Node, NodeEventType, Prefab, Vec3 } from 'cc';
import { PlayerControler } from './PlayerControler';
import { Enermy } from './Enermy';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    private playerManagerPrefab: Prefab = null;

    @property(Prefab)
    private slimPrefab: Prefab = null;

    private playerManager: Node = null;

    private enermyList: Node[] = [];

    protected onLoad(): void {
        director.addPersistRootNode(this.node);
    }
    start() {
        game.frameRate = 60;
        console.log('game manager start')
        this.initSlim();
        this.initPlayer();
    }

    private initPlayer = (position?: Vec3) => {
        this.playerManager = instantiate(this.playerManagerPrefab);
        const canvas = find('Canvas');
        canvas.addChild(this.playerManager);
        const player = find('Player', this.playerManager);
        player.position = position ? position: new Vec3(0, -221, 0);
        this.enermyBindPlayer();
    }

    enermyBindPlayer = () => {
        this.enermyList.forEach((item) => {
            const enermy = item.getComponent(Enermy);
            enermy.setPlayer(find('Player', this.playerManager));
        })
    }

    private initSlim = () => {
        console.log('init slim');
        const slim = instantiate(this.slimPrefab);
        const canvas = find('Canvas');
        canvas.addChild(slim);
        this.enermyList.push(slim);
    }

    public handleSceneChange = (sceneName: string, position: Vec3) => {
        this.playerManager.destroy();
        director.loadScene(sceneName, () => {
            if (sceneName === 'game-main'){
                this.initSlim();
            }
            this.initPlayer(position);
        });
    }

    update(deltaTime: number) {
        
    }
}


