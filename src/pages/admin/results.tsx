import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import moment from 'moment';

import NavigationHeader from "../../components/header";
import { SidebarInstance } from "../../components/sidebar";

import { api } from "../../utils/api";
import { Form } from "@prisma/client";
import { Column, useTable } from "react-table";
import { CircleNotch } from "phosphor-react";

const Result: NextPage = () => {
    const { status } = useSession();
    const router = useRouter();

    const [page, setPage] = React.useState(1);
    const [count, setCount] = React.useState(25);

    const [data, setData] = React.useState<Form[]>([]);

    const { isLoading } = api.form.get.useQuery({
        page: page,
        count: count
    }, {
        // onSuccess: setData,
        onSuccess: (data) => {
            setData([...data, ...data, ...data])
        },
    });

    const columns: Column[] = React.useMemo(() => [
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
    ], []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin");
        }
    }, [status]);

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
    data: T[],
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
                                                    cell.render('Cell')
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
