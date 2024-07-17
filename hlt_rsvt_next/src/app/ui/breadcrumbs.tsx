'use client';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';

export default function HLTBreadcrumbs({
    items,
}: {
    items: { name: string; href: string }[];
}) {
    return (
        <Breadcrumbs className='container mx-auto max-w-4xl bg-gray-50 p-4'>
            {items.map((item) => (
                <BreadcrumbItem key={item.href} href={item.href}>
                    {item.name}
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
}
