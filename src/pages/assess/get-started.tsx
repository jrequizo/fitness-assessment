import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useState, useRef, ChangeEvent, useTransition } from "react";

import NavigationHeader from "../../components/header";

const inactiveCss = 'transition duration-0 opacity-0 max-h-0 invisible';
const activeCss = 'transition duration-300 opacity-100 max-h-full h-full visible';

const GetStarted: NextPage = () => {


    return (
        <>

            <Head>
                <title>StayFit - Assessment: Get Started</title>
                <meta name="Assessment - Get Started" content="Fitness assessment demo page." />
                <link rel="icon" href="/favicon.ico" /> {/** TODO: change favicon.ico */}
            </Head>
            <div className="h-screen flex flex-col">
                <NavigationHeader />
                <div className=" flex-1 flex flex-row ">
                    <div className="flex flex-col flex-1 items-center py-8">
                        <p className="text-4xl py-4">StayFit Health Assessor</p>
                        <p className="pt-4">Take the free assessment today to find out how you could improve your quality of movement.</p>
                        <p className="py-1">Complete a short, and easy and completely free form to receive a personalised response tailored to your needs.</p>
                        <Link className="p-2 rounded bg-slate-800 hover:bg-slate-500 transition mt-8" href="/assess/form">
                            <div>
                                <p className="font-semibold text-white">
                                    Start Assessment
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="spacer layer1"></div>
            </div>

        </>
    );
}

interface TransitionContainerProps {
    active?: boolean
    children: React.ReactNode[] | React.ReactNode
}

const TransitionContainerProps = {
    active: true,
}

const TransitionContainer: React.FC<TransitionContainerProps> = (props: TransitionContainerProps) => {

    return (
        <div className={props.active ? activeCss : inactiveCss} style={props.active ? { transition: "visibility 0.5s, opacity 0.5s" } : { transition: "opacity 0s" }}>
            {props.children}
        </div>
    )
}

TransitionContainer.defaultProps = TransitionContainerProps;

export default GetStarted;