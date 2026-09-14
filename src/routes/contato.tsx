import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { project } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { EvidenceNote } from "@/components/page/Blocks";
import { ArrowRight, Button, ButtonLink } from "@/components/ui/Button";
import { Field, TextArea, TextField } from "@/components/ui/Field";
import { Reveal } from "@/components/motion/Reveal";
import { Erythrocyte } from "@/components/brand/Erythrocyte";

const TITLE = "Contato e assessoria técnica — ImunoScan";
const DESCRIPTION =
  "Fale com a assessoria técnica da ImunoScan sobre reagentes de imuno-hematologia, metodologias e insumos de pesquisa.";

const SUBJECTS = [
  "Dúvida técnica sobre reagente",
  "Metodologia e padronização de bancada",
  "Documentação e instruções de uso",
  "Pesquisa & Life Sciences",
  "Outro assunto",
];

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Assessoria técnica"
        subtitle={DESCRIPTION}
        crumbs={[{ label: "Início", to: "/" }, { label: "Contato" }]}
        tone="blue"
      />

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {sent ? (
            <Reveal>
              <div className="rounded-2xl border bg-surface p-8">
                <div className="flex items-center gap-3">
                  <Erythrocyte size={32} tone="blue" />
                  <h2 className="text-xl font-semibold text-ink-950">Mensagem registrada</h2>
                </div>
                <p className="prose-tech mt-4 text-sm">
                  Nesta prova de conceito a mensagem é validada no navegador, sem envio. O canal de
                  atendimento oficial será conectado quando informado pela ImunoScan.
                </p>
                <Button variant="secondary" className="mt-8" onClick={() => setSent(false)}>
                  Escrever outra mensagem
                </Button>
              </div>
            </Reveal>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Nome" required value={name} onChange={setName} />
                <TextField label="Instituição" value={institution} onChange={setInstitution} />
                <TextField label="E-mail" type="email" required value={email} onChange={setEmail} />
                <Field label="Assunto">
                  {({ className, id }) => (
                    <select
                      id={id}
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      className={`${className} h-11`}
                    >
                      {SUBJECTS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
              <TextArea label="Mensagem" required value={message} onChange={setMessage} rows={6} />
              <Button type="submit" size="lg">
                Enviar mensagem
                <ArrowRight />
              </Button>
            </form>
          )}

          <aside className="space-y-6">
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-sm font-semibold text-ink-950">{project.legal_entity}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{project.target_audience}</p>
            </div>
            <EvidenceNote>
              Endereço, telefone e e-mail institucionais não constam da base editorial fornecida e
              serão publicados após confirmação da ImunoScan.
            </EvidenceNote>
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-sm font-semibold text-ink-950">Precisa de preços?</h2>
              <p className="mt-2 text-sm text-ink-600">
                Solicitações comerciais seguem pelo fluxo de cotação, com seleção de itens e
                metodologia.
              </p>
              <ButtonLink to="/cotacao" variant="secondary" className="mt-5">
                Ir para cotação
                <ArrowRight />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
