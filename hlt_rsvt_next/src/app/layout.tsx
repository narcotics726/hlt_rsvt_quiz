import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'HLT Reservations',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Navbar>
                        <NavbarBrand>
                            <p className="font-bold text-inherit">HLT RSVT</p>
                        </NavbarBrand>
                        <NavbarContent
                            className="hidden sm:flex gap-4"
                            justify="center"
                        >
                            <NavbarItem>
                                <Link href="/reservations">
                                    Reservations
                                </Link>
                            </NavbarItem>
                            <NavbarItem>
                                <Link href="/internal/reservations">
                                    Admin
                                </Link>
                            </NavbarItem>
                        </NavbarContent>
                    </Navbar>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
