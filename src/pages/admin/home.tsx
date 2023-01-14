import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { useRouter } from "next/router";

import { signOut, useSession } from "next-auth/react";
import NavigationHeader from "../../components/header";

import { SidebarInstance } from "../../components/sidebar";

import { faker } from '@faker-js/faker';

import { api } from "../../utils/api";
import { Form } from "@prisma/client";

type Genders = "Male" | "Female" | "Trans" | "Prefer not to answer";

interface CreateForm {
    givenName: string,
    surname: string,
    dob: Date,
    gender: "Male" | "Female" | "Trans" | "Prefer not to answer",
    height: number,
    weight: number
}

const genders = ["Male", "Female", "Trans", "Prefer not to answer"];

const Home: NextPage = () => {
    const { status, data: session } = useSession();
    const router = useRouter();

    const createForm = api.form.create.useMutation();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin");
        }
    }, [status]);

    function generateMockData() {
        const forms: CreateForm[] = [];
        for (let i = 0; i < 100; i++) {
            forms.push({
                givenName: faker.name.firstName(),
                surname: faker.name.lastName(),
                dob: faker.date.birthdate(),
                gender: genders[Math.floor(Math.random() * genders.length)] as Genders,
                height: Math.round(100 + Math.random() * 120),
                weight: Math.round(30 + Math.random() * 120)
            })
        }

        forms.forEach((form) => {
            createForm.mutate(form);
        })
    }
    

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
                        <SidebarInstance />
                    </div>
                    <div className="h-full w-full p-4">
                        <div className="h-full flex flex-col flex-1 items-start space-y-4">
                            <button className="border rounded px-2 py-1 bg-slate-800 border-slate-800 hover:bg-slate-400 hover:border-slate-400 transition text-white"
                                onClick={() => signOut({ callbackUrl: "/admin" })}
                            >Sign Out</button>
                            <button className="border rounded px-2 py-1 bg-slate-800 border-slate-800 hover:bg-slate-400 hover:border-slate-400 transition text-white"
                                onClick={generateMockData}
                            >Generate Mock Data</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home
