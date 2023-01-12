import React, { useEffect } from "react";
import { type NextPage, GetServerSideProps } from "next";
import Head from "next/head";

import { useSession, signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { Tooltip } from "@nextui-org/react";
import { CircleNotch } from "phosphor-react";

import NavigationHeader from "../../components/header";


interface LoginFormProps {
    csrfToken: string
}

interface LoginFormInput {
    email: string,
    password: string,
}

const Login: NextPage<LoginFormProps> = ({ csrfToken }) => {
    const { status } = useSession();
    const router = useRouter();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginFormInput>();

    const [isLoading, setIsLoading] = React.useState(false);

    const [loginErrors, setLoginErrors] = React.useState(false);

    async function login(event: React.MouseEvent<HTMLButtonElement>) {
        setIsLoading(true);
        event.preventDefault();
        setLoginErrors(false);
        handleSubmit(() => { })();

        const response = await signIn("credentials", {
            redirect: false,
            callbackUrl: "/admin/home",
            email: getValues().email,
            password: getValues().password
        });

        if (response?.status === 401) {
            setLoginErrors(true);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/admin/home");
        }
    }, [status]);

    return (
        <>
            <Head>
                <title>StayFit - Admin Panel Login</title>
                <meta name="assessment-details" content="Fitness assessment demo page." />
                <link rel="icon" href="/favicon.ico" /> {/** TODO: change favicon.ico */}
            </Head>
            <main className="flex flex-col h-full">
                <NavigationHeader />
                <div className="h-full flex flex-col flex-1 items-center pt-32">
                    <form method="post" action="/api/auth/callback/credentials" className="flex flex-col">
                        <div className="py-4 flex flex-col">
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <label className="text-xl">Email</label>
                            <Tooltip content={errors.email?.message} isDisabled={errors.email === undefined} color={"error"} placement={"right"} initialVisible={true}>
                                <input id="email" type={"email"} className="border rounded px-1 pb-1 text-xl" placeholder="Email..."
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message: "Please enter your email."
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Must be longer than 3 characters."
                                        },
                                        value: ""
                                    })}
                                ></input>

                            </Tooltip>
                        </div>

                        <div className="py-4 flex flex-col">
                            <label className="text-xl">Password</label>
                            <Tooltip content={errors.password?.message} isDisabled={errors.password === undefined} color={"error"} placement={"right"}>
                                <input type={"password"} className="border rounded px-1 pb-1 text-xl" placeholder="Password..."
                                    {...register("password", {
                                        required: {
                                            value: true,
                                            message: "Please enter your password."
                                        },
                                        value: ""
                                    })}
                                ></input>
                            </Tooltip>
                        </div>
                    </form>
                    <div className="min-h-[36px]">
                        {loginErrors && <p className="opacity-100 text-red-700 transition-all auto-hide">The provided email and password combination was not found.</p>}
                    </div>
                    <div className="flex flex-row">
                        <button className="border rounded border-slate-800 px-2 py-1 bg-slate-800 text-white hover:bg-slate-600 hover:border-slate-600 transition disabled:bg-slate-200 disabled:border-slate-200" onClick={login} disabled={isLoading}>Sign In</button>
                        {isLoading && <div className="px-2"><CircleNotch size={32} className="animate-spin" /></div>}
                    </div>
                    
                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}

export default Login
