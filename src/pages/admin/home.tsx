import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { useRouter } from "next/router";

import { signOut, useSession } from "next-auth/react";

import { useForm } from "react-hook-form";

import { Tooltip } from "@nextui-org/react";

import NavigationHeader from "../../components/header";
import { proseWrap } from "../../../prettier.config.cjs";
import Link from "next/link";


interface LoginFormInput {
}

const Home: NextPage = () => {
    const { status, data: session } = useSession();
    const router = useRouter();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginFormInput>();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin");
        }
    }, [status])

    return (
        <>
            <Head>
                <title>StayFit - Admin Panel</title>
                <meta name="assessment-details" content="Fitness assessment demo page." />
                <link rel="icon" href="/favicon.ico" /> {/** TODO: change favicon.ico */}
            </Head>
            <main className="flex flex-col h-full">
                <NavigationHeader />

                <div className=" flex-1 flex flex-row ">
                    {/** Sidebar */}
                    <div className="flex flex-col">
                        <Sidebar
                            basePath="/admin"
                            components={[
                                {
                                    title: "Home",
                                    path: "/home"
                                },
                                {
                                    title: "Result",
                                    path: "/results"
                                }
                            ]}
                        />
                    </div>
                    <div className="flex flex-col flex-1 justify-center items-center">


                    </div>
                </div>
                {/* <div className="h-full flex flex-col flex-1 items-center pt-32">
                    <button onClick={() => signOut({ callbackUrl: "/admin" })}>Sign Out</button>
                </div> */}
            </main>
        </>
    )
}

interface SidebarButton {
    title: string,
    path: string
}

interface SidebarProps {
    basePath?: string,
    components: SidebarButton[],
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
    const router = useRouter();

    const active = router.pathname;

    console.log(active);

    return (
        <div className="md:min-w-[200px] flex flex-col p-2 bg-slate-600 h-full">
            {
                props.components.map(component => (
                    <Link
                        className={`rounded bg-slate-600 px-4 py-2 text-xl mb-2 hover:bg-slate-500 transition ${active === props.basePath + component.path ? "text-slate-300 font-semibold" : "text-white font-light"}`}
                        href={`${props.basePath}${component.path}`}>{component.title}
                    </Link>
                ))
            }
        </div>
    )
}

export default Home
