import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import NavigationHeader from "../components/header";

const About: NextPage = () => {
    return (
        <>
            <Head>
                <title>Fitness Assessment</title>
                <meta name="description" content="Fitness assessment demo page." />
                <link rel="icon" href="/favicon.ico" /> {/** TODO: change favicon.ico */}
            </Head>
            <main className="flex flex-col">

                <div className="h-screen flex flex-col">
                    <NavigationHeader />
                    <div className=" flex-1 flex flex-row ">
                        <p>About</p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default About;