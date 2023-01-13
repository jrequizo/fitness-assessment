import React, { useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import NavigationHeader from "../../components/header";
import { Sidebar } from "../../components/sidebar";

import { api } from "../../utils/api";
import { Form } from "@prisma/client";
import { Column, useTable } from "react-table";

const Result: NextPage = () => {
    const { status } = useSession();
    const router = useRouter();

    const [page, setPage] = React.useState(1);
    const [count, setCount] = React.useState(25);

    const [data, setData] = React.useState<Form[]>([]);

    api.form.get.useQuery({
        page: page,
        count: count
    }, {
        onSuccess: setData,
    });

    const columns: Column[] = React.useMemo(() => [
        {
            Header: "User ID",
            accessor: "id"
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
            Header: "Date of Birth",
            accessor: (row) => {
                // Convert to a string object
                return (row as Form).dob.toISOString();
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

                    {/** Main Body */}
                    <div className="flex flex-col flex-1 justify-center items-center">

                        <Table columns={columns} data={data} />

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
        <table {...getTableProps()}>
            <thead>

                {// Loop over the header rows
                    headerGroups.map(headerGroup => (

                        // Apply the header row props
                        <tr {...headerGroup.getHeaderGroupProps()}>

                            {// Loop over the headers in each row
                                headerGroup.headers.map(column => (

                                    // Apply the header cell props
                                    <th {...column.getHeaderProps()}>

                                        {// Render the header
                                            column.render('Header')}

                                    </th>
                                ))}
                        </tr>
                    ))}
            </thead>

            {/* Apply the table body props */}
            <tbody {...getTableBodyProps()}>

                {// Loop over the table rows
                    rows.map(row => {

                        // Prepare the row for display
                        prepareRow(row)
                        return (

                            // Apply the row props
                            <tr {...row.getRowProps()}>

                                {// Loop over the rows cells
                                    row.cells.map(cell => {

                                        // Apply the cell props
                                        return (
                                            <td {...cell.getCellProps()}>

                                                {// Render the cell contents
                                                    cell.render('Cell')}
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
