import { Attributes } from "./attributes";

class PlayerAttr extends Attributes {
    constructor() {
        super();
    }

    /** 暴击几率 */
    public CRIT = 0.5;
}

const playerAttr = new PlayerAttr();
export default playerAttr;