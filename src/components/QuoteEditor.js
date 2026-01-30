"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuoteEditor({ initialData = null }) {
    const router = useRouter();
    const [client, setClient] = useState(initialData?.client || "");
    const [preparedBy, setPreparedBy] = useState(initialData?.preparedBy || "Biel Rivero");
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [items, setItems] = useState(initialData?.items || [
        { id: Date.now(), description: "", quantity: 1, price: 0, total: 0 }
    ]);
    const [isSaving, setIsSaving] = useState(false);

    // Recalculate row total when quantity or price changes
    const updateItem = (id, field, value) => {
        const newItems = items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === "quantity" || field === "price") {
                    updatedItem.total = (updatedItem.quantity || 0) * (updatedItem.price || 0);
                }
                return updatedItem;
            }
            return item;
        });
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0, total: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const grandTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

    const handleSave = async () => {
        if (!client) {
            alert("Por favor, introduce el nombre del cliente.");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client, preparedBy, date, notes, items, total: grandTotal }),
            });

            if (response.ok) {
                router.push("/");
                router.refresh();
            } else {
                const errData = await response.json();
                alert(`Error al guardar el presupuesto: ${errData.details || "Error desconocido"} (Código: ${errData.code || "N/A"})`);
            }
        } catch (error) {
            console.error("Save Error:", error);
            alert("Error de conexión.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
            <div style={{ marginBottom: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cliente</label>
                    <input
                        type="text"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="Nombre del cliente"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Preparado por</label>
                    <input
                        type="text"
                        value={preparedBy}
                        onChange={(e) => setPreparedBy(e.target.value)}
                        placeholder="Nombre de quien emite"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Notas</label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notas adicionales (opcional)"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                    />
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Descripción</th>
                        <th style={{ padding: '0.5rem', width: '100px' }}>Cant.</th>
                        <th style={{ padding: '0.5rem', width: '120px' }}>Precio Bruto</th>
                        <th style={{ padding: '0.5rem', width: '120px' }}>Total</th>
                        <th style={{ padding: '0.5rem', width: '50px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                    placeholder="Descripción del artículo..."
                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value))}
                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))}
                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                />
                            </td>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>
                                {item.total.toFixed(2)}€
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    &times;
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={addItem}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: '1px dashed var(--primary)',
                        color: 'var(--primary)',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    + Añadir Fila
                </button>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        Total Presupuesto: <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.5rem' }}>{grandTotal.toFixed(2)}€</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            opacity: isSaving ? 0.7 : 1
                        }}
                    >
                        {isSaving ? "Guardando..." : "Guardar Presupuesto"}
                    </button>
                </div>
            </div>
        </div>
    );
}
