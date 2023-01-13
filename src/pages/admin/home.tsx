import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { useRouter } from "next/router";

import { signOut, useSession } from "next-auth/react";
import NavigationHeader from "../../components/header";

import { SidebarInstance } from "../../components/sidebar";


const Home: NextPage = () => {
    const { status, data: session } = useSession();
    const router = useRouter();

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
                        <SidebarInstance/>
                    </div>
                    <div className="h-full w-full p-4">
                        <div className="h-full flex flex-col flex-1 items-start">
                            <button className="border rounded px-2 py-1 bg-slate-800 border-slate-800 hover:bg-slate-400 hover:border-slate-400 transition text-white" onClick={() => signOut({ callbackUrl: "/admin" })}>Sign Out</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home
