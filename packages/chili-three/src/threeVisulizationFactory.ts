// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import { IDocument } from "chili-core";
import { IVisualization, IVisualizationFactory } from "chili-vis";
import { ThreeVisulization } from "./threeVisualization";

export class ThreeVisulizationFactory implements IVisualizationFactory {
    create(document: IDocument): IVisualization {
        return new ThreeVisulization(document);
    }
}
