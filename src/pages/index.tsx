import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import NavigationHeader from "../components/header";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
            <div className="flex flex-col flex-1 justify-center items-center">
              <div className="w-[50%]">
                <p className="text-4xl py-4">Lorem ipsum. Excepteur sint. Nemo enim.</p>
                <p className="py-4">Take the free assessment today to find out how you could improve your quality of movement.</p>
              </div>
              <div className="w-[50%] flex flex-row py-4">
                <Link href="/assess/get-started" target="_self" className="p-2 rounded bg-slate-800 hover:bg-slate-500 transition">
                  <div>
                    <p className="font-semibold text-white">
                      Get Started
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="pr-32 justify-end">
              <img src={'/hero.png'} className="-scale-x-100 right-0 translate-y-1/4"></img>
            </div>
          </div>
          <div className="spacer layer1"></div>
        </div>
        <div className="h-screen bg-slate-800">
          <p>123</p>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
