import React, { Fragment, useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import moment from "moment";

import { CircleNotch, ClipboardText, ShareNetwork } from "phosphor-react";

import { Form } from "@prisma/client";

import NavigationHeader from "../../components/header";
import { api } from "../../utils/api";
import { calculateAge, calculateBmi, getBmiCategory, parseGivenName, parseSurname } from "../../utils/parser";

import { Dialog, Transition } from '@headlessui/react'
import { Tooltip } from "@nextui-org/react";

const Result: NextPage = () => {
    const router = useRouter();

    const id = router.query.id as string;

    const isParsed = (router.query.parsed as string) === "true";

    const [showShare, setShowShare] = React.useState(false);
    const [shareParsed, setShareParsed] = React.useState(true);
    const [copied, setCopied] = React.useState(false);

    const [url, setUrl] = React.useState("");

    useEffect(() => {
        setUrl(`${window.location.host}${window.location.pathname}${shareParsed ? "?parsed=true" : ""}`);
    }, [shareParsed])

    const { data } = api.form.getById.useQuery({ id: id! }, {
        enabled: id !== undefined,
        onSuccess(data) {
            if (data === null) {
                router.push("/results/not-found");
            }
        },
    });

    const openModal = () => setShowShare(true);
    const closeModal = () => {
        setShowShare(false);
        setCopied(false);
    };

    function setClipboard() {
        navigator.clipboard.writeText(url);
        setCopied(true);
    }

    return (
        <>
            <Head>
                <title>StayFit - Results</title>
                <meta name="description" content="Fitness assessment demo page." />
                <link rel="icon" href="/favicon.ico" /> {/** TODO: change favicon.ico */}
            </Head>
            <main className="flex flex-col h-full bg-slate-700">

                <NavigationHeader />
                <div className="h-full flex flex-col items-center">
                    <div className="flex flex-col flex-1 p-8 w-[50%] min-w-[600px] bg-white">
                        {/** Title + Share buton */}
                        <div className="flex flex-row justify-between items-center mb-8">
                            <p className="text-3xl font-bold text-slate-800">
                                Your Results
                            </p>
                            <button className="border-slate-800 bg-slate-800 text-white p-1 rounded" onClick={openModal}>
                                <div className="flex flex-row space-x-1 p-1 justify-center items-center">

                                    <p>Share</p>
                                    <ShareNetwork size={24} className="px-0" weight="light" />
                                </div>
                            </button>
                        </div>

                        <div>
                            <div className="flex sm:flex-row flex-col">
                                <div className="flex flex-col flex-1 sm:pr-4">
                                    <p className="text-xl pb-4 font-semibold text-slate-800">
                                        Form content
                                    </p>
                                    <FormTable data={data} />
                                </div>
                                <div className="flex flex-col flex-1 sm:pl-4">
                                    {
                                        isParsed &&
                                        <>
                                            <p className="mt-8 sm:mt-0 text-xl pb-4 font-semibold text-slate-800">
                                                Results
                                            </p>
                                            <ResultTable data={data} />
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Transition appear show={showShare} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Share
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Click the link below to copy the link and share it with your practioner/carer.
                                        </p>
                                    </div>

                                    <button className="mt-2 p-2 bg-slate-100 rounded flex flex-row justify-between w-full" onClick={setClipboard}>
                                        <Tooltip isDisabled={!copied} content="Copied!" color={"success"} placement={"bottom"} className="flex flex-1 justify-between">
                                            <p className="text-sm text-gray-500">
                                                {url}
                                            </p>
                                            <ClipboardText size={24} weight="thin" color="#aaaaaa" />
                                        </Tooltip>
                                    </button>


                                    <div className="mt-2 w-full flex flex-row space-x-2 items-center">
                                        <input type={"checkbox"} checked={shareParsed} onChange={() => setShareParsed((prev) => !prev)} />
                                        <p className="text-sm text-gray-500">
                                            Share parsed results
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="transition inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Result;


interface FormTableProps {
    data?: Form | null
}

const FormTable: React.FC<FormTableProps> = (props: FormTableProps) => {

    if (!props.data) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <CircleNotch size={64} weight="bold" className="animate-spin" />
            </div>
        )
    }

    return (
        <>
            <table>
                <tbody>
                    {/** Name */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium rounded-tl-lg">Name</td>
                        <td className="py-2 px-4 font-light capitalize bg-slate-100 rounded-tr-lg w-full">{props.data.givenName} {props.data.surname}</td>
                    </tr>

                    {/** D.O.B */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium">D.O.B</td>
                        <td className="py-2 px-4 font-light capitalize bg-slate-100 w-full">{moment(props.data.dob).format("D MMMM, YYYY")}</td>
                    </tr>

                    {/** Gender */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium">Gender</td>
                        <td className="py-2 px-4 font-light capitalize bg-slate-100 w-full">{props.data.gender}</td>
                    </tr>

                    {/** Height */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium">Height</td>
                        <td className="py-2 px-4 font-light capitalize bg-slate-100 w-full">{props.data.height}</td>
                    </tr>

                    {/** Weight */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium rounded-bl-lg">Weight</td>
                        <td className="py-2 px-4 font-light capitalize bg-slate-100 rounded-br-lg w-full">{props.data.weight}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}


interface ResultTableProps {
    data?: Form | null
}

const ResultTable: React.FC<ResultTableProps> = (props: ResultTableProps) => {

    if (!props.data) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <CircleNotch size={64} weight="bold" className="animate-spin" />
            </div>
        )
    }

    const fNameResult = parseGivenName(props.data.givenName);
    const lNameResult = parseGivenName(props.data.surname);
    const lNameLengthResult = parseSurname(props.data.surname);

    const bmi = calculateBmi(props.data.height, props.data.weight);
    const bmiCategory = getBmiCategory(bmi);

    const age = calculateAge(props.data.dob);

    return (
        <>
            <table className="w-full">
                <tbody className="w-full">
                    {/** Name */}
                    <tr>
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium rounded-tl-lg">Vowels</td>
                        <td className="py-2 px-4 font-light capitalize bg-slate-100">{`Given name: ${fNameResult}`}</td>
                        <td className="py-2 px-4 font-light capitalize bg-slate-100 rounded-tr-lg">{`Surname: ${lNameResult}`}</td>
                        {/* <td className="py-2 px-4 font-light capitalize bg-slate-100">{fNameResult}</td> */}
                    </tr>

                    {/** D.O.B */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium">Surname</td>
                        <td colSpan={2} className="py-2 px-4 font-light bg-slate-100">{`Shorter than ${lNameLengthResult.toFixed(2)}% of the pop.`}</td>
                    </tr>

                    {/** Gender */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium">Age</td>
                        <td colSpan={2} className="py-2 px-4 font-light bg-slate-100">{`${age.years} years, ${age.months} months, ${age.days} days`}</td>
                    </tr>

                    {/** Height */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium">BMI</td>
                        <td colSpan={2} className="py-2 px-4 font-light capitalize bg-slate-100">{bmi.toFixed(2)}</td>
                    </tr>

                    {/** Weight */}
                    <tr >
                        <td className="bg-slate-800 text-white py-2 px-4 font-medium rounded-bl-lg">BMI Category</td>
                        <td colSpan={2} className="py-2 px-4 font-light capitalize bg-slate-100 rounded-br-lg">{bmiCategory}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}