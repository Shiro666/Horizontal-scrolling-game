import { _decorator, Component, Node, Vec2, Collider2D, Contact2DType, PHYSICS_2D_PTM_RATIO, RigidBody2D, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

let pointVelPlatform = new Vec2;
let pointVelOther = new Vec2;
let relativeVel = new Vec2;
let relativePoint = new Vec2;

@ccclass('Platform')
export class Platform extends Component {
    start() {
        const collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
    }

    onPreSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        const otherBody = otherCollider.body as RigidBody2D;
        const platformBody = selfCollider.body as RigidBody2D;

        const worldManifold = contact.getWorldManifold();
        const points = worldManifold.points;

        //check if contact points are moving into platform
        for (let i = 0; i < points.length; i++) {
            platformBody.getLinearVelocityFromWorldPoint(points[i], pointVelPlatform);
            otherBody.getLinearVelocityFromWorldPoint(points[i], pointVelOther);
            platformBody.getLocalVector(pointVelOther.subtract(pointVelPlatform), relativeVel);
            
            // 相对速度向下，大于1m/s
            if (relativeVel.y < -1 * PHYSICS_2D_PTM_RATIO) {
                // 保持接触
                return;
            }
            // 相对速度小于1m/s
            else if (relativeVel.y < 1 * PHYSICS_2D_PTM_RATIO) {
                // 边缘情况，轻微碰撞
                platformBody.getLocalPoint(points[i], relativePoint);
                // 计算平台前面，只能用于box collider
                const platformFaceY = selfCollider.worldAABB.height / 2;
                if (relativePoint.y + 0.1 * PHYSICS_2D_PTM_RATIO > platformFaceY ) {
                    //contact point is less than 3.2pixel (10cm) inside front face of platfrom
                    return;
                }
            }
            // 相对速度向上，大于1m/s
            else {
                
            }
        }

        // 取消本次接触
        contact.disabled = true;
    }
}


