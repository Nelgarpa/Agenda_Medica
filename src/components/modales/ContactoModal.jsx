import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ContactoModal = ({ contact, mode, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    specialty: "",
    appointment: "",
    gender: ""
  });

  const { dispatch } = useGlobalReducer();

  useEffect(() => {
    if (contact) {
      const [realAddress, extra] = (contact.address || "").split(" | Especialidad:");
      const specialty = extra?.split(" | Cita:")[0]?.trim() || "";
      const citaSplit = extra?.split(" | Cita:")[1] || "";
      const appointment = citaSplit.split(" | Género:")[0]?.trim();
      const gender = citaSplit.split(" | Género:")[1]?.trim() || "";

      setForm({
        name: contact.name || "",
        phone: contact.phone || "",
        email: contact.email || "",
        address: realAddress || "",
        specialty,
        appointment,
        gender
      });
    } else {
      setForm({ name: "", phone: "", email: "", address: "", specialty: "", appointment: "", gender: "" });
    }
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

    if (!form.name || !form.phone || !form.email || !form.address || !form.specialty || !form.gender) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const combinedAddress = `${form.address} | Especialidad: ${form.specialty} | Cita: ${form.appointment || "N/A"} | Género: ${form.gender}`;

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: combinedAddress
    };

    const url = mode === "edit"
      ? `https://playground.4geeks.com/contact/agendas/nelcy/contacts/${contact.id}`
      : "https://playground.4geeks.com/contact/agendas/nelcy/contacts";

    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error al guardar contacto");

      const updated = await fetch("https://playground.4geeks.com/contact/agendas/nelcy/contacts");
      const data = await updated.json();
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
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="contactModalLabel">
              {mode === "edit" ? "Editar Médico" : "Nuevo Médico"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control mb-3" placeholder="Nombre del médico" required />

            <select name="specialty" value={form.specialty} onChange={handleChange} className="form-control mb-3" required>
              <option value="">Selecciona una especialidad</option>
              <option value="Medicina General">Medicina General</option>
              <option value="Pediatría">Pediatría</option>
              <option value="Cardiología">Cardiología</option>
              <option value="Ginecología">Ginecología</option>
              <option value="Dermatología">Dermatología</option>
              <option value="Oftalmología">Oftalmología</option>
              <option value="Neurología">Neurología</option>
              <option value="Odontología">Odontología</option>
            </select>

            <select name="gender" value={form.gender} onChange={handleChange} className="form-control mb-3" required>
              <option value="">Selecciona género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>

            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control mb-3" placeholder="Teléfono" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control mb-3" placeholder="Correo electrónico" required />
            <input type="text" name="address" value={form.address} onChange={handleChange} className="form-control mb-3" placeholder="Dirección del consultorio" required />
            <input type="date" name="appointment" value={form.appointment} onChange={handleChange} className="form-control mb-3" />
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