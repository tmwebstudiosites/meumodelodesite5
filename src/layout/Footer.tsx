import { Link } from "react-router-dom";
import { SITE } from "@/shared/config/site";
import { Wordmark } from "@/shared/ui/Wordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Wordmark light />
          <p>
            {SITE.tagline}. {SITE.description}
          </p>
        </div>
        <div>
          <h2 className="footer__title">Navegue</h2>
          <ul className="footer__list">
            <li>
              <Link to="/vestidos">Vestidos</Link>
            </li>
            <li>
              <Link to="/agendar">Agendar prova</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer__title">Visite</h2>
          <address>
            {SITE.address.line1}
            <br />
            {SITE.address.line2}
          </address>
          <ul className="footer__list">
            <li>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {SITE.instagram.handle}
              </a>
            </li>
            <li>
              <a href={SITE.contactLink} target="_blank" rel="noopener noreferrer">
                Fale conosco
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="footer__copy">
        © {new Date().getFullYear()} Annaly Noivas. Todos os direitos reservados.
      </p>
    </footer>
  );
}
