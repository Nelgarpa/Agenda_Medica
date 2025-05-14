export const Footer = () => {
  return (
    <footer className="text-center text-muted py-4 border-top mt-5">
      <small>
        Desarrollado con ❤️ por Nelcy García © {new Date().getFullYear()} <br />
        <a
          href="https://www.linkedin.com/in/nelcy-garcia"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-primary"
        >
          LinkedIn
        </a>
      </small>
    </footer>
  );
};