// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import { MathUtils } from "./mathUtils";
import { Ray } from "./ray";
import { XYZ } from "./xyz";

export class Plane {
    static readonly XY: Plane = Object.freeze(new Plane(XYZ.zero, XYZ.unitZ, XYZ.unitX));
    static readonly YZ: Plane = Object.freeze(new Plane(XYZ.zero, XYZ.unitX, XYZ.unitY));
    static readonly ZX: Plane = Object.freeze(new Plane(XYZ.zero, XYZ.unitY, XYZ.unitZ));

    /**
     * unit vector
     */
    readonly normal: XYZ;
    readonly x: XYZ;
    readonly y: XYZ;
    constructor(readonly location: XYZ, normal: XYZ, xDirection: XYZ) {
        let n = normal.normalize(),
            x = xDirection.normalize();
        if (n === undefined || n.isEqualTo(XYZ.zero)) {
            throw new Error("normal can not be zero");
        }
        if (x === undefined || x.isEqualTo(XYZ.zero)) {
            throw new Error("xDirector can not be zero");
        }
        if (n.isParallelTo(x)) {
            throw new Error("xDirector can not parallel normal");
        }
        this.normal = n;
        this.x = x;
        this.y = n.cross(x).normalize()!;
    }

    intersect(ray: Ray, containsExtension: boolean = true): XYZ | undefined {
        let vec = this.location.sub(ray.location);
        if (vec.isEqualTo(XYZ.zero)) return this.location;
        let len = vec.dot(this.normal);
        let dot = ray.direction.dot(this.normal);
        if (MathUtils.almostEqual(dot, 0)) return MathUtils.almostEqual(len, 0) ? ray.location : undefined;
        let t = len / dot;
        if (!containsExtension && t < 0) return undefined;
        return ray.location.add(ray.direction.multiply(t));
    }
}
