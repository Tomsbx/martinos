export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h3 className="footer-heading">Martinos Grill</h3>
          <p className="footer-text">
            Smash Burgers artesanales en Pando, Canelones. Delivery Viernes a Domingo de 20:30 a 00:30.
          </p>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">Contacto</h3>
          <ul className="footer-list">
            <li>094 573 638</li>
            <li>martinosgrill@gmail.com</li>
            <li>Pando, Canelones, Uruguay</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">Horarios</h3>
          <ul className="footer-list">
            <li>Viernes a Domingo</li>
            <li>20:30 a 00:30</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 Martinos Grill · Todos los derechos reservados
      </div>
    </footer>
  );
}
