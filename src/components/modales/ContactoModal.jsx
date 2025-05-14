
import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ContactoModal = ({ contact, mode, onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const { dispatch } = useGlobalReducer();

  useEffect(() => {
    setForm(contact || { name: "", phone: "", email: "", address: "" });
  }, [contact]);

  useEffect(() => {
    const modalElement = document.getElementById("contactModal");
    if (!modalElement) return;

    const handleHidden = () => {
      if (typeof onClose === "function") onClose();
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => modalElement.removeEventListener("hidden.bs.modal", handleHidden);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = mode === "edit"
      ? `https://playground.4geeks.com/contact/agendas/nelcy/contacts/${contact.id}`
      : "https://playground.4geeks.com/contact/agendas/nelcy/contacts";

    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...form, id: 0 })
      });

      if (!response.ok) throw new Error("Error al guardar contacto");

      const contactosActualizadosResponse = await fetch("https://playground.4geeks.com/contact/agendas/nelcy/contacts");
      const data = await contactosActualizadosResponse.json();
      dispatch({ type: "set_contacts", payload: data.contacts });

      const modalElement = bootstrap.Modal.getInstance(document.getElementById("contactModal"));
      modalElement?.hide();
    } catch (err) {
      console.error("Error al guardar contacto:", err);
    }
  };

  return (
    <div className="modal fade" id="contactModal" tabIndex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title" id="contactModalLabel">
              {mode === "edit" ? "Editar Contacto" : "Nuevo Contacto"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <input name="name" value={form.name} onChange={handleChange} className="form-control mb-2" placeholder="Nombre" />
            <input name="phone" value={form.phone} onChange={handleChange} className="form-control mb-2" placeholder="Teléfono" />
            <input name="email" value={form.email} onChange={handleChange} className="form-control mb-2" placeholder="Email" />
            <input name="address" value={form.address} onChange={handleChange} className="form-control mb-2" placeholder="Dirección" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
