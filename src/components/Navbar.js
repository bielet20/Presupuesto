"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="glass no-print" style={{
            padding: '1rem 2rem',
            marginBottom: '2rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                <Link href="/">Presupuestos Biel</Link>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link
                    href="/"
                    style={{
                        color: pathname === "/" ? "var(--primary)" : "var(--text-main)",
                        fontWeight: pathname === "/" ? "600" : "400"
                    }}
                >
                    Dashboard
                </Link>
                <Link
                    href="/new"
                    style={{
                        color: pathname === "/new" ? "var(--primary)" : "var(--text-main)",
                        fontWeight: pathname === "/new" ? "600" : "400"
                    }}
                >
                    Nuevo Presupuesto
                </Link>
            </div>
        </nav>
    );
}
