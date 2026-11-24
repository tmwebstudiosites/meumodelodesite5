import { useSearchParams } from "react-router-dom";
import { BookingForm } from "@/features/booking";
import { Reveal } from "@/shared/ui/Reveal";

export default function BookingPage() {
  const [params] = useSearchParams();
  return (
    <section className="section">
      <div className="container container--narrow">
        <Reveal className="section-head">
          <p className="eyebrow">Agendamento</p>
          <h1 className="h2">Agende a sua prova</h1>
          <p className="lead">
            Em três passos rápidos montamos a sua mensagem e abrimos o contato com a nossa equipe.
          </p>
        </Reveal>
        <Reveal>
          <BookingForm initialDress={params.get("vestido") ?? ""} />
        </Reveal>
      </div>
    </section>
  );
}
