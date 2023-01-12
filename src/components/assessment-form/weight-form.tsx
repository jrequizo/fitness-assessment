import React from "react";
import { useForm } from "react-hook-form";

import { Tooltip } from "@nextui-org/react";

import { FormProps } from "./controller/form-controller";


interface WeightFormProps extends FormProps {
}

interface WeightFormInput {
    weight: string
}

const WeightForm: React.FC<WeightFormProps> = (props) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<WeightFormInput>();
    props.controller.validate = validate;

    function validate() {
        handleSubmit((data) => { })();

        const { weight: weightRaw } = getValues();
        const weight = parseInt(weightRaw);

        const valid = !isNaN(weight) && weight > 0 && weight < 300;
        
        if (valid) props.controller.result["weight"] = weight;

        return valid;
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <div className="py-4 flex flex-col">
                <div className="flex-row pb-1">
                    <label className="text-xl">Weight {"(kg)"}</label><label className="text-xl text-red-500">*</label>
                </div>
                <Tooltip content={errors.weight?.message} isDisabled={errors.weight === undefined} color={"error"} placement={"bottom"}>
                    <div className="py-4 flex flex-col">
                        <input type={"text"} className="border rounded px-1 pb-1" placeholder="Height..."
                            {
                                ...register("weight", {
                                    required: {
                                        value: true,
                                        message: "Please enter your weight (in kilograms)."
                                    },
                                    min: {
                                        value: 1,
                                        message: "Weight must be greater than 0."
                                    },
                                    max: {
                                        value: 300,
                                        message: "Weight must be less than 500."
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Please enter a number.",
                                    },
                                    value: props.controller.result["weight"] ?? undefined,
                                })
                            }
                        />
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}


export default WeightForm;