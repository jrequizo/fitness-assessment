import { useRouter } from "next/router";

import Link from "next/link";

export interface SidebarButton {
    title: string,
    path: string
}

export interface SidebarProps {
    basePath?: string,
    components: SidebarButton[],
}

export const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
    const router = useRouter();

    const active = router.pathname;

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

export const SidebarInstance: React.FC = () => {
    return (
        <Sidebar
        basePath="/admin"
        components={[
            {
                title: "Home",
                path: "/home"
            },
            {
                title: "Form Results",
                path: "/results/form"
            }
        ]}
    />
    )
}