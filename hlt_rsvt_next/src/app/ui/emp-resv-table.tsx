'use client';

import {
    getKeyValue,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/react';
import { redirect, useRouter } from 'next/navigation';

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
    pages
}: {
    reservations: any[];
    page: number;
    pages: number;
}) {
    const router = useRouter()
    return (
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
                        onChange={(page) => {router.push(`/internal/reservations?page=${page}`)}}
                    />
                </div>
            }
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
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
    );
}
