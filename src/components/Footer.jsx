function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {year} Kanu.dev — Built with React</p>
    </footer>
  );
}

export default Footer;