export class Attributes {
    /** 生命值 */
    public HP: number;
    /** 攻击力 */
    public ATK: number;
    /** 防御力 */
    public DEF: number;

    constructor(options?: {
        HP?: number;
        ATK?: number;
        DEF?: number;
    }) {
        this.HP = options?.HP || 10;
        this.ATK = options?.ATK || 1;
        this.DEF = options?.DEF || 0;
    }
}