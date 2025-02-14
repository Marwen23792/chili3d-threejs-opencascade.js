// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import { Container, Token, I18n, Result, Plane, XYZ } from "chili-shared";
import { IShapeFactory, IShape } from "chili-geo";
import { property } from "../decorators";
import { BodyBase } from "./base";

export class CircleBody extends BodyBase {
    private _center: XYZ;
    private _radius: number;
    readonly name: keyof I18n = "body.circle";

    constructor(readonly normal: XYZ, center: XYZ, radius: number) {
        super();
        this._center = center;
        this._radius = radius;
    }

    protected generateBody(): Result<IShape, string> {
        let factory = Container.default.resolve<IShapeFactory>(Token.ShapeFactory);
        return factory!.circle(this.normal, this._center, this._radius);
    }

    @property("circle.center")
    get center() {
        return this._center;
    }

    set center(center: XYZ) {
        this.setPropertyAndUpdateBody("center", center);
    }

    @property("circle.radius")
    get radius() {
        return this._radius;
    }

    set radius(radius: number) {
        this.setPropertyAndUpdateBody("radius", radius);
    }
}
