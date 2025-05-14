import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ContactoModal } from "../components/modales/ContactoModal";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("Todos");
  const [soloCitasProximas, setSoloCitasProximas] = useState(false);

  useEffect(() => {
    const iniciarApp = async () => {
      try {
        await fetch("https://playground.4geeks.com/contact/agendas/nelcy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: "nelcy", id: 0 })
        });
      } catch (e) {
        console.error("Error creando agenda:", e);
      }

      await cargarContactos();
    };

    iniciarApp();
  }, []);

  const cargarContactos = async () => {
    try {
      const res = await fetch("https://playground.4geeks.com/contact/agendas/nelcy/contacts");
      const data = await res.json();
      dispatch({ type: "set_contacts", payload: data.contacts });
    } catch (error) {
      console.error("Error cargando contactos:", error);
    }
  };

  const eliminarContacto = async (id) => {
    try {
      await fetch(`https://playground.4geeks.com/contact/agendas/nelcy/contacts/${id}`, {
        method: "DELETE"
      });
      await cargarContactos();
    } catch (error) {
      console.error("Error eliminando contacto:", error);
    }
  };

  const handleCreate = () => {
    setSelectedContact(null);
    setModalMode("create");
    const modal = new bootstrap.Modal(document.getElementById("contactModal"));
    modal.show();
  };

  const openModal = (contact) => {
    setSelectedContact(contact);
    setModalMode("edit");
    const modal = new bootstrap.Modal(document.getElementById("contactModal"));
    modal.show();
  };

  const especialidadesDisponibles = [
    "Todos",
    "Medicina General",
    "Pediatría",
    "Cardiología",
    "Ginecología",
    "Dermatología",
    "Oftalmología",
    "Neurología",
    "Odontología"
  ];

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <select
          className="form-select w-auto"
          value={filtroEspecialidad}
          onChange={(e) => setFiltroEspecialidad(e.target.value)}
        >
          {especialidadesDisponibles.map((esp) => (
            <option key={esp} value={esp}>{esp}</option>
          ))}
        </select>

        <div className="d-flex gap-2">
          <button
            className={`btn btn-outline-${soloCitasProximas ? "danger" : "info"}`}
            onClick={() => setSoloCitasProximas(!soloCitasProximas)}
          >
            {soloCitasProximas ? "Ver todos" : "Solo próximas citas"}
          </button>

          <button
            className="btn btn-outline-success d-flex align-items-center gap-1"
            onClick={handleCreate}
          >
            <span>➕</span> Añadir Médico
          </button>
        </div>
      </div>

      {(!Array.isArray(store.contacts) || store.contacts.length === 0) ? (
        <p className="text-muted text-center">No hay médicos registrados.</p>
      ) : (
        <div className="row">
          {store.contacts
            .map((contact) => {
              const [realAddress, extra] = (contact.address || "").split(" | Especialidad:");
              const specialty = extra?.split(" | Cita:")[0]?.trim() || "No especificada";
              const citaSplit = extra?.split(" | Cita:")[1] || "";
              const appointment = citaSplit.split(" | Género:")[0]?.trim();
              const gender = citaSplit.split(" | Género:")[1]?.trim() || "masculino";

              let isUpcoming = false;
              if (appointment && appointment !== "N/A") {
                const today = new Date();
                const citaDate = new Date(appointment);
                const diff = (citaDate - today) / (1000 * 60 * 60 * 24);
                isUpcoming = diff >= 0 && diff <= 3;
              }

              const avatarURL =
                gender === "femenino"
                  ? "https://cdn-icons-png.flaticon.com/512/387/387569.png"
                  : "https://cdn-icons-png.flaticon.com/512/387/387561.png";

              return {
                ...contact,
                realAddress,
                specialty,
                appointment,
                gender,
                isUpcoming,
                avatarURL
              };
            })
            .filter((contact) =>
              (filtroEspecialidad === "Todos" || contact.specialty === filtroEspecialidad) &&
              (!soloCitasProximas || contact.isUpcoming)
            )
            .map((contact) => {
              const specialtyColors = {
                "Pediatría": "#f06292",
                "Cardiología": "#ef5350",
                "Ginecología": "#ba68c8",
                "Medicina General": "#4db6ac",
                "Dermatología": "#ffd54f",
                "Oftalmología": "#64b5f6",
                "Neurología": "#7986cb",
                "Odontología": "#ff8a65",
                "No especificada": "#90a4ae"
              };

              const specialtyIcons = {
                "Pediatría": "👶",
                "Cardiología": "❤️",
                "Ginecología": "🌸",
                "Medicina General": "🩺",
                "Dermatología": "🧴",
                "Oftalmología": "👁️",
                "Neurología": "🧠",
                "Odontología": "🦷",
                "No especificada": "👨‍⚕️"
              };

              const borderColor = specialtyColors[contact.specialty] || specialtyColors["No especificada"];
              const specialtyIcon = specialtyIcons[contact.specialty] || "👨‍⚕️";

              return (
                <div className="col-12 col-md-6 mb-4" key={contact.id}>
                  <div className="card" style={{ borderLeft: `6px solid ${borderColor}` }}>
                    <div className="card-body d-flex flex-column flex-sm-row">
                      <img
                        src={contact.avatarURL}
                        alt="avatar médico"
                        className="rounded-circle me-3 mb-3 mb-sm-0"
                        width="64"
                        height="64"
                      />
                      <div>
                        <h5 className="card-title">
                          {contact.name}
                          <span className="badge bg-secondary ms-2">
                            {specialtyIcon} {contact.specialty}
                          </span>
                        </h5>
                        <p className="card-text">
                          <strong>Teléfono:</strong> {contact.phone}<br />
                          <strong>Email:</strong> {contact.email}<br />
                          <strong>Dirección:</strong> {contact.realAddress}<br />
                          {contact.appointment && contact.appointment !== "N/A" && (
                            <div className={`mt-2 ${contact.isUpcoming ? "text-danger fw-bold" : ""}`}>
                              <strong>🗓️ Próxima cita:</strong>{" "}
                              {new Date(contact.appointment).toLocaleDateString("es-ES")}
                              {contact.isUpcoming && (
                                <span className="ms-2 badge bg-warning text-dark">¡Muy pronto!</span>
                              )}
                            </div>
                          )}
                        </p>
                        <button className="btn btn-primary me-2 mb-2" onClick={() => openModal(contact)}>
                          Editar
                        </button>
                        <button className="btn btn-danger mb-2" onClick={() => eliminarContacto(contact.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <ContactoModal
        contact={selectedContact}
        mode={modalMode}
        onClose={() => {
          setSelectedContact(null);
          cargarContactos();
        }}
      />
    </div>
  );
};
