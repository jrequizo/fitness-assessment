import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import moment from 'moment';

import NavigationHeader from "../../../components/header";
import { SidebarInstance } from "../../../components/sidebar";

import { api } from "../../../utils/api";
import { Form } from "@prisma/client";
import { Column, useTable } from "react-table";
import { CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight, CircleNotch } from "phosphor-react";
import Link from "next/link";

const Result: NextPage = () => {

    const context = api.useContext();

    const { status } = useSession();
    const router = useRouter();

    const [page, setPage] = React.useState(1);
    const [count, setCount] = React.useState(25);

    const [data, setData] = React.useState<Form[]>([]);

    const [total, setTotal] = React.useState(0);

    api.form.getCount.useQuery(undefined, { onSuccess: setTotal });

    const { isLoading } = api.form.get.useQuery({
        page: page,
        count: count
    }, {
        // onSuccess: setData,
        onSuccess: (data) => {
            setData(data);
        },
    });

    const columns: Column[] = React.useMemo(() => [
        {
            id: "index",
            Header: "",
            accessor: (row, index) => {
                return index + 1 + ((page - 1) * count);
            }
        },
        {
            id: "id",
            Header: "UID",
            accessor: (row) => {
                return (
                    <Link href={`/results/${(row as Form).id}?parsed=true`} className="hover:text-slate-400">
                        {(row as Form).id}
                    </Link>
                )
            },
        },
        {
            Header: "First Name",
            accessor: "givenName"
        },
        {
            Header: "Last Name",
            accessor: "surname"
        },

        {
            id: "dob",
            Header: "D.O.B",
            accessor: (row) => {
                // Convert to a string object
                return moment((row as Form).dob).format("YYYY-MM-DD");
            },
        },
        {
            Header: "Gender",
            accessor: "gender"
        },
        {
            Header: "Height",
            accessor: "height"
        },
        {
            Header: "Weight",
            accessor: "weight"
        }
    ], [page, count]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin");
        }
    }, [status]);

    const totalPages = React.useMemo(() => {
        return Math.ceil(total / count);
    }, [total, count]);

    function nextPage() {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    }

    function previousPage() {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    }

    function firstPage() {
        setPage(1);
    }

    function lastPage() {
        setPage(totalPages);
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

                    {/** Main Body */}
                    <div className="flex flex-col flex-1 p-4">
                        <div className="flex flex-row justify-center space-x-2 mb-2">
                            <button
                                className="border rounded bg-slate-800 border-slate-800 aspect-square flex justify-center items-center hover:bg-slate-600 hover:border-slate-600"
                                onClick={firstPage}
                            >
                                <CaretDoubleLeft size={16} color="#FFFFFF" weight="bold" />
                            </button>
                            <button
                                className="border rounded bg-slate-800 border-slate-800 aspect-square flex justify-center items-center hover:bg-slate-600 hover:border-slate-600"
                                onClick={previousPage}
                            >
                                <CaretLeft size={16} color="#FFFFFF" />
                            </button>

                            <div className="flex flex-row space-x-2">
                                <p>Page: </p>
                                <select
                                    onChange={(event) => {
                                        const { value } = event.target;

                                        setPage(parseInt(value));
                                        context.form.get.invalidate();

                                    }}
                                    value={page}
                                >
                                    {
                                        [...Array(totalPages)].map((value, index) => {
                                            return <option value={index + 1}>{index + 1}</option>
                                        })
                                    }
                                </select>
                                <p> / {totalPages}</p>
                                <p className="text-gray-100">|</p>
                                <p>Per page: </p>
                                <select
                                    onChange={(event) => {
                                        const { value } = event.target;

                                        setCount(parseInt(value));
                                        context.form.get.invalidate();
                                    }}
                                    value={count}
                                >
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={75}>75</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>

                            <button
                                className="border rounded bg-slate-800 border-slate-800 aspect-square flex justify-center items-center hover:bg-slate-600 hover:border-slate-600"
                                onClick={nextPage}
                            >
                                <CaretRight size={16} color="#FFFFFF" />
                            </button>
                            <button
                                className="border rounded bg-slate-800 border-slate-800 aspect-square flex justify-center items-center hover:bg-slate-600 hover:border-slate-600"
                                onClick={lastPage}
                            >
                                <CaretDoubleRight size={16} color="#FFFFFF" weight="bold" />
                            </button>
                        </div>
                        {isLoading ?
                            // Simple loading icon while the table data is fetched
                            <div className="w-full h-full flex items-center justify-center">
                                <CircleNotch size={64} weight="bold" className="animate-spin" />
                            </div> :
                            <Table columns={columns} data={data} />
                        }

                    </div>
                </div>
            </main>
        </>
    )
}

interface TableProps<T extends object = {}> {
    columns: Column<T>[],
    data: T[]
}

const Table: React.FC<TableProps> = <T extends object>(props: TableProps<T>) => {
    const { columns, data } = props;

    const tableInstance = useTable({ columns, data });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        // apply the table props
        <table {...getTableProps()} className="">
            <thead className="text-left">

                {// Loop over the header rows
                    headerGroups.map(headerGroup => (

                        // Apply the header row props
                        <tr {...headerGroup.getHeaderGroupProps()}>

                            {// Loop over the headers in each row
                                headerGroup.headers.map((column, index) => (

                                    // Apply the header cell props
                                    <th {...column.getHeaderProps()}
                                        className={`
                                            bg-slate-800 text-white p-1 pl-4 font-medium
                                            ${index == 0 && "rounded-tl-lg"} 
                                            ${index == headerGroup.headers.length - 1 && "rounded-tr-lg"}
                                        `}>

                                        {
                                            // Render the header
                                            column.render('Header')
                                        }

                                    </th>
                                ))}
                        </tr>
                    ))}
            </thead>

            {/* Apply the table body props */}
            <tbody {...getTableBodyProps()}>

                {// Loop over the table rows
                    rows.map((row, rowIndex) => {

                        // Prepare the row for display
                        prepareRow(row)
                        return (

                            // Apply the row props
                            <tr {...row.getRowProps()}>

                                {// Loop over the rows cells
                                    row.cells.map((cell, cellIndex) => {

                                        // Apply the cell props
                                        return (
                                            <td {...cell.getCellProps()}
                                                className={`
                                                    p-1 pl-4 font-light
                                                    ${(rowIndex % 2 == 0 && "bg-slate-100")}
                                                    ${(rowIndex == rows.length - 1 && cellIndex == row.cells.length - 1) && "rounded-br-lg"}
                                                    ${(rowIndex == rows.length - 1 && cellIndex == 0) && "rounded-bl-lg"}
                                                `}
                                            >

                                                {
                                                    // Render the cell contents
                                                    cell.render('Cell', {

                                                    })
                                                }
                                            </td>
                                        )
                                    })}
                            </tr>
                        )
                    })}
            </tbody>
        </table>
    );
}

export default Result
