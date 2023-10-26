/** 水平移动方向 */
export enum HorizontalDirection {
    STAND = 0,
    LEFT = -1,
    RIGHT = 1
}

/** 角色动画状态 */
export enum PlayerAnimState {
    STAND,
    WALK,
    JUMP,
    ATTACK
}

export enum ColliderTag {
    PLAYER = 0,
    PLAYER_ATKBOX = 0.1,
    GROUND = 1,
    WALL = 1.2,
    ENERMY = 2
}

export enum SkillType {
    NONE = 0,
    A = 1,
}