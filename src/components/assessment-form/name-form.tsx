import React from "react";
import { useForm } from "react-hook-form";

import { Tooltip } from "@nextui-org/react";

import { FormProps } from "./controller/form-controller";

interface NameFormProps extends FormProps {
}

interface NameFormInput {
    givenName: string;
    surname: string;
}

const NameForm: React.FC<NameFormProps> = (props) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<NameFormInput>();
    props.controller.validate = validate;


    const [facts, setFacts] = React.useState<React.ReactNode[]>([]);

    const vowels = ["a", "e", "i", "o", "u"];

    // https://www.quora.com/What-is-the-average-length-of-last-names-in-the-United-States
    const surname_length_distribution = [0, 0, 0.12, 1.29, 8.41, 17.65, 20.82, 15.55, 9.69, 4.07, 1.48, 0.41, 0.08, 0.03, 20.41];

    function validate() {
        handleSubmit((data) => { })();

        const { givenName, surname } = getValues();

        const valid = (givenName.length > 0 && surname.length > 0);

        if (valid) {
            props.controller.result["givenName"] = givenName;
            props.controller.result["surname"] = surname;
        }

        return valid;
    }


    function parseStringForVowels(str: string) {
        let sum = 0;

        str.split("").forEach(letter => {
            if (vowels.includes(letter)) {
                sum++;
            }
        });

        return sum;
    }

    function parseSurnameLength(surname: string) {
        const length = surname.length;

        if (length < 2) {
            return 100;
        }

        const sum = surname_length_distribution.slice(length).reduce((sum, value) => {
            return sum + value;
        }, 0);

        return sum;
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <div className="py-4 flex flex-col">
                <div className="flex-row pb-1">
                    <label className="text-xl">Given Name</label><label className="text-xl text-red-500">*</label>
                </div>
                <Tooltip content={errors.givenName?.message} isDisabled={errors.givenName === undefined} color={"error"} placement={"bottom"} initialVisible={true}>
                    <input type={"text"} className="border rounded px-1 pb-1 text-xl" placeholder="Given name..."
                        {...register("givenName", {
                            required: {
                                value: true,
                                message: "Required."
                            },
                            maxLength: {
                                value: 20,
                                message: "Must be shorter than 20 characters."
                            },
                            value: props.controller.result["givenName"] ?? ""
                        })}
                    ></input>

                </Tooltip>
            </div>

            <div className="py-4 flex flex-col">
                <div className="flex-row pb-1">
                    <label className="text-xl">Surname</label><label className="text-xl text-red-500">*</label>
                </div>
                <Tooltip content={errors.surname?.message} isDisabled={errors.surname === undefined} color={"error"} placement={"bottom"}>
                    <input type={"text"} className="border rounded px-1 pb-1 text-xl" placeholder="Surname..."
                        {...register("surname", {
                            required: {
                                value: true,
                                message: "Required."
                            },
                            maxLength: {
                                value: 20,
                                message: "Must be shorter than 20 characters."
                            },
                            value: props.controller.result["surname"] ?? ""
                        })}
                    ></input>
                </Tooltip>
            </div>

            <button className="border rounded items-center justify-center px-2 py-1"
                onClick={(event) => {
                    event.preventDefault();

                    const numberOfVowels = parseStringForVowels(getValues().givenName);
                    const surnamePercentile = parseSurnameLength(getValues().surname);

                    const givenNameFact = (
                        <div>
                            Your first name has {numberOfVowels} vowels in it.
                        </div>
                    );

                    const surnameFact = (
                        <div>
                            Your last name is shorter than {surnamePercentile.toFixed(2)}% of all last names.
                        </div>
                    );

                    setFacts([givenNameFact, surnameFact]);
                }}>
                <p className="text-lg text-slate-800">Click for Fun Facts</p>
            </button>
            {facts}

        </div>
    )
}


export default NameForm;