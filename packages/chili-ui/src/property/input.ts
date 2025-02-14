// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import { Property, IDocument, Transaction } from "chili-core";
import { IConverter, XYZ, XYZConverter, NumberConverter, StringConverter } from "chili-shared";
import style from "./input.module.css";
import commonStyle from "./common.module.css";
import { PropertyBase } from "./propertyBase";
import { Control } from "../control";

export class InputProperty extends PropertyBase {
    readonly valueBox: HTMLInputElement;
    readonly errorLabel: HTMLSpanElement;
    readonly converter: IConverter | undefined;

    constructor(readonly document: IDocument, objects: any[], readonly property: Property) {
        super(objects);
        this.converter = property.converter ?? this.getConverter();
        this.valueBox = Control.textBox(style.box);
        this.valueBox.value = this.getDefaultValue();
        if (this.isReadOnly()) {
            this.valueBox.readOnly = true;
            this.valueBox.classList.add(style.readonly);
        }
        let span = Control.span(property.display, commonStyle.propertyName);
        span.title = property.display;
        this.valueBox.addEventListener("keydown", this.handleKeyDown);
        this.errorLabel = Control.span("error.default", style.error);
        this.errorLabel.classList.add(style.hidden);
        let div = Control.div(style.panel);
        Control.append(div, span, this.valueBox);
        Control.append(this.dom, div, this.errorLabel);
    }

    private isReadOnly(): boolean {
        let des = Object.getOwnPropertyDescriptor(this.objects[0], this.property.name);
        if (des === undefined) {
            let proto = Object.getPrototypeOf(this.objects[0]);
            while (proto.name !== "Object") {
                des = Object.getOwnPropertyDescriptor(proto, this.property.name);
                if (des !== undefined) break;
                proto = Object.getPrototypeOf(proto);
            }
        }
        return (
            des?.set === undefined ||
            (this.converter === undefined && typeof this.objects[0][this.property.name] !== "string")
        );
    }

    private getConverter(): IConverter | undefined {
        let name = this.objects[0][this.property.name].constructor.name;
        if (name === XYZ.name) {
            return new XYZConverter();
        } else if (name === String.name) {
            return new StringConverter();
        } else if (name === Number.name) {
            return new NumberConverter();
        }
        return undefined;
    }

    private getValueString(obj: any): string {
        let value = obj[this.property.name];
        return this.converter?.convert(value) ?? String(value);
    }

    private getDefaultValue() {
        let value = this.getValueString(this.objects[0]);
        for (let index = 1; index < this.objects.length; index++) {
            const testValue = this.getValueString(this.objects[1]);
            if (value !== testValue) {
                value = "";
                break;
            }
        }
        return value;
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (this.converter === undefined) return;
        if (e.key === "Enter") {
            let newValue = this.converter.convertBack(this.valueBox.value);
            if (newValue === undefined) {
                this.errorLabel.textContent = this.converter.error ?? "error";
                this.errorLabel.classList.remove(style.hidden);
                return;
            }
            Transaction.excute(this.document, "modify property", () => {
                this.objects.forEach((x) => {
                    x[this.property.name] = newValue;
                });
                this.document.viewer.redraw();
            });
        } else {
            this.errorLabel.classList.add(style.hidden);
        }
    };
}
