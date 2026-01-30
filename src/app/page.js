"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const confirmDelete = async () => {
    const { id } = deleteModal;
    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setQuotes(quotes.filter(q => q.id !== id));
        setDeleteModal({ show: false, id: null });
      } else {
        alert("Error al eliminar el presupuesto.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error de conexión.");
    }
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setDeleteModal({ show: true, id });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text-main)' }}>Mis Presupuestos</h1>
        <Link href="/new" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: 'bold'
        }}>
          + Nuevo Presupuesto
        </Link>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando presupuestos...</div>
      ) : quotes.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No tienes presupuestos guardados aún.</p>
          <Link href="/new" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Crea tu primer presupuesto ahora &rarr;</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {quotes.map((quote) => (
            <div key={quote.id} className="glass" style={{
              padding: '1.5rem',
              borderRadius: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
              onClick={() => window.location.href = `/quote/${quote.id}`}
            >
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{quote.client}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {new Date(quote.date).toLocaleDateString()} • {quote.items.length} artículos
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {quote.total.toFixed(2)}€
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {quote.id.substring(0, 8)}</div>
                <button
                  onClick={(e) => openDeleteModal(e, quote.id)}
                  style={{
                    marginTop: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#ff4444',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textDecoration: 'underline'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Eliminación */}
      {deleteModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}
          onClick={() => setDeleteModal({ show: false, id: null })}
        >
          <div className="glass" style={{
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1rem' }}>¿Eliminar presupuesto?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Esta acción no se puede deshacer. Se borrarán todos los datos asociados.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: '#ff4444',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
