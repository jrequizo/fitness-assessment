import React from "react";

/**
 * Controls the flow of data between the form components and whether the User can proceed to the next page.
 * 
 * Each FormComponent needs to bind the validate function.
 * The function should return a boolean determining whether the User can leave the current FormComponent
 * and proceed to the next one.
 * 
 * If the FormComponent determines it can proceed to the next FormComponent, then it may bind its result
 * to the `result` property.
 */
export class FormController {
    pages: React.FC<FormProps>[];
    result: Record<string, any> = {};

    constructor(pages: React.FC<FormProps>[]) {
        this.pages = pages;
    }

    /**
     * Each FormComponent must bind a callback function at the beginning.
     */
    validate?: () => boolean;

    /**
     * Type-safe wrapper that calls the function bound to `validate`.
     * Will unbind the `validate` function if `true` is returned.
     * @returns A boolean that, ideally, determines whether the User can proceed to the next FormComponent.
     */
    valid(): boolean {
        if (this.validate) {
            const result = this.validate();
            if (result) this.validate = undefined;
            return result;
        }

        throw new Error("`valid()` function called before `validate` has been bound by the FormComponent.");
    }

    /**
     * Returns a FormComponent.
     * @param index 
     * @returns A FormComponent generated from the `pages[]` passed during initialization of this Controller.
     */
    getPage(index: number): JSX.Element {
        if (this.pages.length > 0 && index >= 0 && index < this.pages.length) {
            const page = this.pages[index];

            if (page) {
                return React.createElement(page, {
                    controller: this,
                });
            }
        }

        throw new Error("Page index out of range.");
    }
}

export interface FormProps {
    controller: FormController,
}