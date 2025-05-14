import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ContactoModal } from "../components/modales/ContactoModal";

export const Home = () => {
	const { store, dispatch } = useGlobalReducer();
	const [selectedContact, setSelectedContact] = useState(null);
	const [modalMode, setModalMode] = useState("create");

	useEffect(() => {
		const iniciarApp = async () => {
			try {
				await fetch("https://playground.4geeks.com/contact/agendas/nelcy", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ slug: "nelcy", id: 0 })
				});
			} catch (e) {
				
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

		}
	};


	const eliminarContacto = async (id) => {
		try {
			await fetch(`https://playground.4geeks.com/contact/agendas/nelcy/contacts/${id}`, {
				method: "DELETE"
			});
			await cargarContactos();
		} catch (error) {
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

	return (
		<div className="container my-4">
			<div className="d-flex justify-content-end mb-3">
				<button className="btn btn-success" onClick={handleCreate}>
					Crear nuevo contacto
				</button>
			</div>

			{!Array.isArray(store.contacts) || store.contacts.length === 0 ? (
				<p className="text-muted">No hay contactos guardados.</p>
			) : (
				<div className="row">
					{store.contacts.map(contact => (
						<div className="col-md-6 mb-4" key={contact.id}>
							<div className="card">
								<div className="card-body d-flex">
									<img
										src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
										alt="avatar"
										className="rounded-circle me-3"
										width="64"
										height="64"
									/>
									<div>
										<h5 className="card-title">{contact.name}</h5>
										<p className="card-text">
											<strong>Teléfono:</strong> {contact.phone}<br />
											<strong>Email:</strong> {contact.email}<br />
											<strong>Dirección:</strong> {contact.address}
										</p>
										<button className="btn btn-primary me-2" onClick={() => openModal(contact)}>
											Editar
										</button>
										<button className="btn btn-danger" onClick={() => eliminarContacto(contact.id)}>
											Eliminar
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<ContactoModal
				contact={selectedContact}
				mode={modalMode}
				onClose={() => {
					setSelectedContact(null);
					cargarContactos(); // refresca después de guardar
				}}
			/>
		</div>
	);
};
