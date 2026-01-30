"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function QuoteDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [quote, setQuote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch(`/api/quotes/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setQuote(data);
                } else {
                    console.error("Failed to fetch quote");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchQuote();
    }, [id]);

    if (isLoading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando detalles...</div>;
    if (!quote) return <div style={{ textAlign: 'center', padding: '3rem' }}>Presupuesto no encontrado.</div>;

    return (
        <div>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)' }}>&larr; Volver al Dashboard</Link>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => window.print()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        🖨️ Imprimir / Guardar PDF
                    </button>
                </div>
            </div>

            <div className="print-container glass" style={{
                padding: '3rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                minHeight: '297mm', // A4 height
                position: 'relative'
            }}>
                {/* Header de la factura/presupuesto */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>PRESUPUESTO</h1>
                        <p style={{ color: 'var(--text-muted)' }}>ID: {quote.id}</p>
                        <p style={{ color: 'var(--text-muted)' }}>Fecha: {new Date(quote.date).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{quote.preparedBy}</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Servicios de Ingeniería y Desarrollo<br />
                            Palma de Mallorca
                        </p>
                    </div>
                </div>

                {/* Cliente */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Preparado para:</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{quote.client}</p>
                </div>

                {/* Tabla de Artículos */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem 0' }}>Descripción</th>
                            <th style={{ padding: '1rem 0', textAlign: 'right', width: '80px' }}>Cant.</th>
                            <th style={{ padding: '1rem 0', textAlign: 'right', width: '120px' }}>Precio</th>
                            <th style={{ padding: '1rem 0', textAlign: 'right', width: '120px' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quote.items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 0' }}>{item.description}</td>
                                <td style={{ padding: '1rem 0', textAlign: 'right' }}>{item.quantity}</td>
                                <td style={{ padding: '1rem 0', textAlign: 'right' }}>{item.price.toFixed(2)}€</td>
                                <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 'bold' }}>{item.total.toFixed(2)}€</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totales */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal:</span>
                            <span>{quote.total.toFixed(2)}€</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            <span>IVA (0%):</span>
                            <span>0.00€</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '2px solid var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total:</span>
                            <span style={{ color: 'var(--primary)' }}>{quote.total.toFixed(2)}€</span>
                        </div>
                    </div>
                </div>

                {/* Notas */}
                {quote.notes && (
                    <div style={{ marginTop: '4rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Notas:</h4>
                        <p style={{ fontSize: '0.9rem' }}>{quote.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Este presupuesto tiene una validez de 30 días. Gracias por su confianza.
                </div>
            </div>
        </div>
    );
}
