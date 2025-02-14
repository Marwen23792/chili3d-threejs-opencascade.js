// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import { IDocument } from "chili-core";
import { IModelObject, IShape, RenderData } from "chili-geo";
import { IVisualizationShape } from "./visualizationShape";

export interface IVisualizationContext {
    get shapeCount(): number;
    handleAddModel(document: IDocument, model: IModelObject): void;
    removeModel(...models: IModelObject[]): void;
    getShape(model: IModelObject): IVisualizationShape | undefined;

    hilighted(shape: IShape): void;
    unHilighted(shape: IShape): void;

    temporaryDisplay(...datas: RenderData[]): number;
    temporaryRemove(id: number): void;
}
