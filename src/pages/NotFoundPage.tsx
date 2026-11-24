import { LinkButton } from "@/shared/ui/Button";
import { Reveal } from "@/shared/ui/Reveal";

export default function NotFoundPage() {
  return (
    <section className="section">
      <Reveal className="container container--narrow center">
        <p className="script">Ops…</p>
        <h1 className="h2">Página não encontrada</h1>
        <p className="lead">
          O endereço que você procura não existe, mas ainda há muitos vestidos lindos para ver.
        </p>
        <LinkButton to="/vestidos">Ver vestidos</LinkButton>
      </Reveal>
    </section>
  );
}
