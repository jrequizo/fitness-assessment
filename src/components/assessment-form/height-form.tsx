import React from "react";
import { useForm } from "react-hook-form";

import { Tooltip } from "@nextui-org/react";

import { FormProps } from "./controller/form-controller";


interface HeightFormProps extends FormProps {
}

interface HeightFormInput {
    height: string
}

const HeightForm: React.FC<HeightFormProps> = (props) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<HeightFormInput>();
    props.controller.validate = validate;

    function validate() {
        handleSubmit((data) => { })();

        const { height: heightRaw } = getValues();
        const height = parseInt(heightRaw);

        const valid = !isNaN(height) && height > 0 && height < 300;
        
        if (valid) props.controller.result["height"] = height;

        return valid;
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <div className="py-4 flex flex-col">
                <div className="flex-row pb-1">
                    <label className="text-xl">Height {"(cm)"}</label><label className="text-xl text-red-500">*</label>
                </div>
                <Tooltip content={errors.height?.message} isDisabled={errors.height === undefined} color={"error"} placement={"bottom"}>
                    <div className="py-4 flex flex-col">
                        <input type={"text"} className="border rounded px-1 pb-1" placeholder="Height..."
                            {
                                ...register("height", {
                                    required: {
                                        value: true,
                                        message: "Please enter your height (in centimeters)."
                                    },
                                    min: {
                                        value: 1,
                                        message: "Height must be greater than 0."
                                    },
                                    max: {
                                        value: 300,
                                        message: "Height must be less than 300."
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Please enter a number.",
                                    },
                                    value: props.controller.result["height"] ?? undefined,
                                })
                            }
                        />
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}


export default HeightForm;