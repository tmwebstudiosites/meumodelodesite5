import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useId, useState } from "react";
import { DRESSES } from "@/features/catalog";
import { formatDateBR, formatPhone } from "@/shared/lib/format";
import { resolveContact } from "@/shared/lib/whatsapp";
import { duration, ease } from "@/shared/motion/tokens";
import { fadeIn } from "@/shared/motion/variants";
import { track } from "@/shared/observability";
import { Button } from "@/shared/ui/Button";
import { ProgressBar } from "@/shared/ui/Progress";
import {
  type BookingData,
  type BookingErrors,
  buildMessage,
  EMPTY_BOOKING,
  EVENT_TYPES,
  type EventType,
  STEP_TITLES,
  type StepId,
  stepProgress,
  validateStep,
} from "./booking";

type Phase = "editing" | "sending" | "done";
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

export function BookingForm({ initialDress = "" }: { initialDress?: string }) {
  const uid = useId();
  const [step, setStep] = useState<StepId>(0);
  const [data, setData] = useState<BookingData>({ ...EMPTY_BOOKING, dress: initialDress });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [phase, setPhase] = useState<Phase>("editing");
  const [prefilled, setPrefilled] = useState(true);

  const set = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const next = () => {
    const found = validateStep(step, data);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep((s) => Math.min(2, s + 1) as StepId);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 2) return next();
    setPhase("sending");
    const message = buildMessage(data);
    const target = resolveContact(whatsappNumber, message);
    setPrefilled(target.prefilled);
    track("booking_submit", {
      eventType: data.eventType,
      hasDress: Boolean(data.dress),
      prefilled: target.prefilled,
    });
    if (!target.prefilled) await navigator.clipboard?.writeText(message).catch(() => undefined);
    await new Promise((r) => setTimeout(r, 900));
    window.open(target.url, "_blank", "noopener,noreferrer");
    setPhase("done");
  };

  const err = (k: keyof BookingData) => errors[k];
  const field = (k: keyof BookingData) => ({
    id: `${uid}-${k}`,
    "aria-invalid": Boolean(err(k)) || undefined,
    "aria-describedby": err(k) ? `${uid}-${k}-err` : undefined,
  });
  const fieldError = (k: keyof BookingData) => (
    <AnimatePresence>
      {err(k) && (
        <motion.span
          id={`${uid}-${k}-err`}
          role="alert"
          className="field__error"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {err(k)}
        </motion.span>
      )}
    </AnimatePresence>
  );

  if (phase === "done") {
    return (
      <motion.div
        className="form-card form-done"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        role="status"
      >
        <motion.svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: duration.slow, ease: ease.out }}
          />
          <motion.path
            d="M20 33l8 8 16-17"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: duration.base, ease: ease.out }}
          />
        </motion.svg>
        <h2>Tudo pronto!</h2>
        <p>
          {prefilled
            ? "Abrimos o WhatsApp com a sua mensagem. É só enviar."
            : "Abrimos o nosso canal de contato e copiamos a sua mensagem — é só colar na conversa."}
        </p>
      </motion.div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate aria-label="Agendar prova">
      <div className="form-card__head">
        <p className="eyebrow">
          Etapa {step + 1} de {STEP_TITLES.length} · {STEP_TITLES[step]}
        </p>
        <ProgressBar value={stepProgress(step)} label="Progresso do agendamento" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="stack"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.out } }}
          exit={{ opacity: 0, x: -24, transition: { duration: duration.fast, ease: ease.in } }}
        >
          {step === 0 && (
            <>
              <label className="field">
                <span>Nome completo</span>
                <input
                  {...field("name")}
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </label>
              {fieldError("name")}
              <label className="field">
                <span>WhatsApp (com DDD)</span>
                <input
                  {...field("phone")}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(21) 99999-9999"
                  value={data.phone}
                  onChange={(e) => set("phone", formatPhone(e.target.value))}
                />
              </label>
              {fieldError("phone")}
            </>
          )}
          {step === 1 && (
            <>
              <label className="field">
                <span>Tipo de evento</span>
                <select
                  {...field("eventType")}
                  value={data.eventType}
                  onChange={(e) => set("eventType", e.target.value as EventType)}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Data do evento</span>
                <input
                  {...field("eventDate")}
                  type="date"
                  value={data.eventDate}
                  onChange={(e) => set("eventDate", e.target.value)}
                />
              </label>
              {fieldError("eventDate")}
              <label className="field">
                <span>Vestido de interesse (opcional)</span>
                <select
                  {...field("dress")}
                  value={data.dress}
                  onChange={(e) => set("dress", e.target.value)}
                >
                  <option value="">Ainda não escolhi</option>
                  {DRESSES.map((d) => (
                    <option key={d.slug}>{d.name}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <dl className="review">
                <div>
                  <dt>Nome</dt>
                  <dd>{data.name}</dd>
                </div>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>{data.phone}</dd>
                </div>
                <div>
                  <dt>Evento</dt>
                  <dd>
                    {data.eventType} · {formatDateBR(data.eventDate)}
                  </dd>
                </div>
                <div>
                  <dt>Vestido</dt>
                  <dd>{data.dress || "A definir na prova"}</dd>
                </div>
              </dl>
              <label className="field">
                <span>Observações (opcional)</span>
                <textarea
                  {...field("notes")}
                  rows={3}
                  value={data.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </label>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="form-card__actions">
        {step > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1) as StepId)}
            disabled={phase === "sending"}
          >
            Voltar
          </Button>
        )}
        {step < 2 ? (
          <Button key="next" type="button" onClick={next}>
            Continuar
          </Button>
        ) : (
          <Button key="submit" type="submit" loading={phase === "sending"}>
            {phase === "sending" ? "Preparando mensagem…" : "Enviar pelo WhatsApp"}
          </Button>
        )}
      </div>
    </form>
  );
}
