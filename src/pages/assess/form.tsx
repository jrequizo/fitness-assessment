import { type NextPage } from "next";
import Head from "next/head";

import { useState } from "react";

import { FormController } from "../../components/assessment-form/controller/form-controller";

import NameForm from "../../components/assessment-form/name-form";
import DobForm from "../../components/assessment-form/dob-form";
import HeightForm from "../../components/assessment-form/height-form";
import GenderForm from "../../components/assessment-form/gender-form";
import WeightForm from "../../components/assessment-form/weight-form";

import NavigationHeader from "../../components/header";

import React from "react";
import { api } from "../../utils/api";

const Details: NextPage = () => {

    const createForm = api.form.create.useMutation({
        onSuccess(data, variables, context) {
            console.log(data);
        },
    })

    const [page, setPage] = useState(0);
    const [controller] = useState(new FormController([NameForm, GenderForm, DobForm, HeightForm, WeightForm]));

    // Check to see if the User can proceed to the next page based on the condition provided by the current FormComponent.
    function next() {
        if (page < controller.pages.length - 1) {
            if (controller.valid()) {
                setPage(p => p + 1);
            }
        }
    }

    function back() {
        if (page > 0) {
            setPage(p => p - 1);
        }
    }

    function submit() {
        if (controller.valid()) {
            createForm.mutate({
                givenName: controller.result["givenName"],
                surname: controller.result["surname"], 
                dob: controller.result["dob"],
                gender: controller.result["gender"],
                height: controller.result["height"],
                weight: controller.result["weight"],
            })
        }
    }

    return (
        <>
            <Head>
                <title>StayFit - Asessment</title>
                <meta name="assessment-details" content="Fitness assessment demo page." />
                <link rel="icon" href="/favicon.ico" /> {/** TODO: change favicon.ico */}
            </Head>
            <main className="flex flex-col">

                <div className="h-screen flex flex-col">
                    <NavigationHeader />
                    <div className="flex flex-row">
                        <div className="flex flex-col items-center pt-8 w-full">
                            <header className="text-4xl pt-4 text-center">StayFit Health Assessor</header>
                        </div>
                    </div>
                    <div className="flex flex-row items-start">
                        <div className="w-full">
                            <div className="flex flex-row justify-center items-center py-6">
                                <div className="flex flex-1 justify-end">
                                    <div className="flex-0 my-auto">
                                        <button onClick={back} className="border rounded px-2 py-1 border-slate-800 bg-slate-800 text-white hover:bg-slate-600 hover:border-slate-600 transition text-2xl font-semibold">Back</button>
                                    </div>
                                </div>
                                <div className="flex flex-row px-4">
                                    {
                                        [...Array(controller.pages.length)].map((x, i) => {
                                            return <div className={`rounded w-2 h-2 border border-slate-800 m-1 ${page == i ? 'bg-slate-800' : 'bg-transparent'}`}></div>
                                        })
                                    }
                                </div>
                                <div className="flex flex-1">
                                    <div className="flex-0 my-auto">
                                        {
                                            page == controller.pages.length - 1 ?
                                                <button onClick={submit} className="border rounded px-2 py-1 border-green-700 bg-green-700 text-white hover:bg-green-600 hover:border-green-600 transition text-2xl font-semibold">Submit</button> :
                                                <button onClick={next} className="border rounded px-2 py-1 border-slate-800 bg-slate-800 text-white hover:bg-slate-600 hover:border-slate-600 transition text-2xl font-semibold">Next</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 items-start justify-start">

                        {
                            controller.getPage(page)
                        }
                    </div>
                </div>
            </main>
        </>
    )
}

export default Details;