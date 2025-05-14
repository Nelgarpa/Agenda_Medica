import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm py-3">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            alt="logo médico"
            width="40"
            height="40"
          />
          <div className="d-flex flex-column">
            <span className="fs-2 fw-semibold text-success">
              Medi<span className="text-primary">Notas</span>
            </span>
            <small className="text-muted" style={{ fontSize: "0.75rem", marginTop: "-4px" }}>
              Tu agenda médica inteligente 
            </small>
          </div>
        </Link>
      </div>
    </nav>
  );
};
