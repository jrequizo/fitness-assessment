import React, { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { Tooltip } from "@nextui-org/react";

import moment from 'moment';

import { FormProps } from "./controller/form-controller";


interface DobFormProps extends FormProps {
}

interface DobFormInput {
    dob: Date | string
}

const DobForm: React.FC<DobFormProps> = (props) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<DobFormInput>();
    props.controller.validate = validate;

    function validate() {
        handleSubmit((data) => { })();

        const { dob } = getValues();

        const valid = dob !== "";

        if (valid) {
            props.controller.result["dob"] = new Date(dob);
        }

        return valid;
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <div className="py-4 flex flex-col">
                <div className="flex-row pb-1">
                    <label className="text-xl">Date of Birth</label><label className="text-xl text-red-500">*</label>
                </div>
                <Tooltip content={errors.dob?.message} isDisabled={errors.dob === undefined} color={"error"} placement={"bottom"}>
                    <input className="border rounded px-1 pb-1" type={"date"}
                        {
                        ...register("dob", {
                            required: {
                                value: true,
                                message: "Required."
                            },
                            value: props.controller.result["dob"] ? moment(props.controller.result["dob"]).format("YYYY-MM-DD") : undefined
                        })
                        }
                    ></input>
                </Tooltip>
            </div>
        </div>
    )
}


export default DobForm;