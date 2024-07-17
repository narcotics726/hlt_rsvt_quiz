'use client';

import {
    DateRangePicker,
    Divider,
    getKeyValue,
    Pagination,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'customerPhone', label: 'Customer Phone' },
    { key: 'status', label: 'Status' },
    { key: 'tableSize', label: 'Table Size' },
    { key: 'time', label: 'Time' },
];

export function EmployeeReservationsTable({
    reservations,
    page,
    pages,
}: {
    reservations: any[];
    page: number;
    pages: number;
}) {
    const router = useRouter();
    const [queryInput, setQuery] = useState<{
        status?: string;
        timeRange?: { from?: string; until?: string };
    }>({});

    useEffect(() => {
        let queries = [];
        const { status, timeRange } = queryInput;
        if (status) {
            queries.push(`&status=${status}`);
        }
        if (timeRange?.from) {
            queries.push(`&from=${timeRange.from}`);
        }
        if (timeRange?.until) {
            queries.push(`&until=${timeRange.until}`);
        }
        router.push(`/internal/reservations?page=${page}${queries.join('')}`);
    });

    return (
        <>
            <div className="flex">
                <Select
                    className="max-w-xs"
                    label="Status"
                    onChange={(e) => {
                        setQuery({ ...queryInput, status: e.target.value });
                    }}
                >
                    <SelectItem key={'pending'}>Pending</SelectItem>
                    <SelectItem key={'cancelled'}>Cancelled</SelectItem>
                    <SelectItem key={'done'}>Done</SelectItem>
                </Select>
                <DateRangePicker
                    label="Time range"
                    className="max-w-xs"
                    onChange={(e) => {
                        setQuery({
                            ...queryInput,
                            timeRange: {
                                from: e?.start.toDate('utc').toISOString(),
                                until: e?.end.toDate('utc').toISOString(),
                            }
                        });
                    }}
                />
            </div>
            <Divider className="my-4"></Divider>
            <Table
                aria-label="Reservations"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => {
                                router.push(
                                    `/internal/reservations?page=${page}`
                                );
                            }}
                        />
                    </div>
                }
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={reservations}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {getKeyValue(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
