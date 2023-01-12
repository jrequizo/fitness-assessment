import React from "react";
import { useForm } from "react-hook-form";

import { Tooltip } from "@nextui-org/react";

import { FormProps } from "./controller/form-controller";


interface GenderFormProps extends FormProps {
}

interface GenderFormInput {
    gender: "Male" | "Female" | "Unspecified" | "N/A" | ""
}

const GenderForm: React.FC<GenderFormProps> = (props) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<GenderFormInput>();
    props.controller.validate = validate;

    function validate() {
        handleSubmit((data) => { })();

        const { gender } = getValues();

        const valid = gender !== "";

        if (valid) {
            props.controller.result["gender"] = gender;
        }

        return valid;
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <div className="py-4 flex flex-col">
                <div className="flex-row pb-1">
                    <label className="text-xl">Gender</label><label className="text-xl text-red-500">*</label>
                </div>
                <Tooltip content={errors.gender?.message} isDisabled={errors.gender === undefined} color={"error"} placement={"bottom"}>
                    <select className="border rounded px-1 pb-1"
                        {
                        ...register("gender", {
                            required: {
                                value: true,
                                message: "Required."
                            },
                            value: props.controller.result["gender"] ?? "",
                        })
                        }
                    >
                        <option value="" disabled hidden>Select your gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unspecified">Unspecified</option>
                        <option value="N/A">Prefer not to answer</option>
                    </select>
                </Tooltip>
            </div>
        </div>
    )
}


export default GenderForm;