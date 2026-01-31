"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuoteEditor({ initialData = null, onSaveSuccess = null }) {
    const router = useRouter();
    const [client, setClient] = useState(initialData?.client || "");
    const [preparedBy, setPreparedBy] = useState(initialData?.preparedBy || "Biel Rivero");
    const [companyName, setCompanyName] = useState(initialData?.companyName || "Servicios de Ingeniería y Desarrollo");
    const [companyAddress, setCompanyAddress] = useState(initialData?.companyAddress || "Palma de Mallorca");
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [showTax, setShowTax] = useState(initialData?.showTax ?? true);
    const [items, setItems] = useState(initialData?.items || [
        { id: Date.now(), description: "", quantity: 1, price: 0, taxRate: 21, total: 0 }
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
        setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0, taxRate: 21, total: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = showTax ? items.reduce((sum, item) => sum + ((item.total || 0) * ((item.taxRate || 0) / 100)), 0) : 0;
    const grandTotal = subtotal + taxAmount;

    const handleSave = async () => {
        if (!client) {
            alert("Por favor, introduce el nombre del cliente.");
            return;
        }

        setIsSaving(true);
        try {
            const isUpdate = initialData && initialData.id;
            const url = isUpdate ? `/api/quotes/${initialData.id}` : "/api/quotes";
            const method = isUpdate ? "PATCH" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client,
                    preparedBy,
                    companyName,
                    companyAddress,
                    date,
                    notes,
                    items,
                    total: grandTotal,
                    taxRate: 0, // No longer used globally, but kept for schema compatibility if needed
                    showTax: Boolean(showTax)
                }),
            });

            if (response.ok) {
                if (isUpdate) {
                    alert("Presupuesto actualizado correctamente.");
                    router.refresh();
                    if (typeof onSaveSuccess === "function") {
                        onSaveSuccess();
                    }
                } else {
                    router.push("/");
                    router.refresh();
                }
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
            <div style={{ marginBottom: '2rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                {/* Información de la Empresa */}
                <div style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '0.75rem', gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Información de la Empresa (Header)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Nombre Empresa</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Nombre de tu empresa"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Dirección / Localización</label>
                            <input
                                type="text"
                                value={companyAddress}
                                onChange={(e) => setCompanyAddress(e.target.value)}
                                placeholder="Ej: Palma de Mallorca"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Información del Presupuesto */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cliente / Preparado para:</label>
                    <input
                        type="text"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="Nombre del cliente"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1.1rem', fontWeight: 'bold' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Preparado por:</label>
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Visualización</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                        <input
                            type="checkbox"
                            checked={showTax}
                            onChange={(e) => setShowTax(e.target.checked)}
                        />
                        Incluir IVA en total
                    </label>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Notas adicionales</label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Info adicional (opcional)"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                    />
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Descripción</th>
                        <th style={{ padding: '0.5rem', width: '80px', textAlign: 'center' }}>Cant.</th>
                        <th style={{ padding: '0.5rem', width: '100px', textAlign: 'center' }}>Precio</th>
                        <th style={{ padding: '0.5rem', width: '80px', textAlign: 'center' }}>IVA %</th>
                        <th style={{ padding: '0.5rem', width: '100px', textAlign: 'right' }}>Total</th>
                        <th style={{ padding: '0.5rem', width: '40px' }}></th>
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
                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem', textAlign: 'center' }}
                                />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))}
                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem', textAlign: 'center' }}
                                />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <input
                                    type="number"
                                    value={item.taxRate}
                                    onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value))}
                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem', textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold' }}
                                />
                            </td>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold', textAlign: 'right' }}>
                                {item.total.toFixed(2)}€
                            </td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

                <div style={{ textAlign: 'right', minWidth: '250px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                        <span style={{ fontWeight: 'bold' }}>{subtotal.toFixed(2)}€</span>

                        {showTax && (
                            <>
                                <span style={{ color: 'var(--text-muted)' }}>Impuestos Totales:</span>
                                <span style={{ fontWeight: 'bold' }}>{taxAmount.toFixed(2)}€</span>
                            </>
                        )}

                        <span style={{ fontSize: '1.2rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>TOTAL:</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                            {grandTotal.toFixed(2)}€
                        </span>
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
                            opacity: isSaving ? 0.7 : 1,
                            width: '100%'
                        }}
                    >
                        {isSaving ? "Guardando..." : "Guardar Presupuesto"}
                    </button>
                </div>
            </div>
        </div>
    );
}
