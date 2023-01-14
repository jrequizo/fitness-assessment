import Link from "next/link";

import { useRouter } from "next/router";

const NavigationHeader: React.FC = () => {
    const router = useRouter();

    return (
        <div className="flex w-screen min-h-12 bg-slate-800 flex-row pr-8">
            <Link href="/" target="_self">
                <div className="flex flex-row">
                    <img src={'/logo.png'} className="p-3 h-20"></img>
                    <div className="flex-col justify-center text-slate-200 hidden md:flex">
                        <p className="font-bold text-xl">StayFit</p>
                        <p className="text-sm">Better health. Better living.</p>
                    </div>
                </div>
            </Link>

            <Link href="/" target="_self" className="ml-auto">
                <div className="hover:text-slate-300 text-white flex h-full px-5 justify-center items-center transition">
                    <p className={`${router.pathname === "/" && "text-slate-300 font-semibold"}`}>
                        Home
                    </p>
                </div>
            </Link>
            <Link href="/about" target="_self">
                <div className="hover:text-slate-300 text-white flex h-full px-5 justify-center items-center transition">
                    <p className={`${router.pathname === "/about" && "text-slate-300 font-semibold"}`}>
                        About
                    </p>
                </div>
            </Link>
            <Link href="/assess/get-started" target="_self">
                <div className="hover:text-slate-300 text-white flex h-full px-5 justify-center items-center transition">
                    <p className={`${router.pathname === "/assess/get-started" && "text-slate-300 font-semibold"}`}>
                        Assessment
                    </p>
                </div>
            </Link>
            <Link href="/learn" target="_self">
                <div className="hover:text-slate-300 text-white flex h-full px-5 justify-center items-center transition">
                    <p className={`${router.pathname === "/learn" && "text-slate-300 font-semibold"}`}>
                        Learn
                    </p>
                </div>
            </Link>
            <Link href="/contact" target="_self">
                <div className="hover:text-slate-300 text-white flex h-full px-5 justify-center items-center transition">
                    <p className={`${router.pathname === "/contact" && "text-slate-300 font-semibold"}`}>
                        Contact Us
                    </p>
                </div>
            </Link>
        </div>
    )
}

export default NavigationHeader;