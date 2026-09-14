import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { methodologies, products } from "@/lib/content";
import { PageHero } from "@/components/page/PageHero";
import { EvidenceNote } from "@/components/page/Blocks";
import { Button, ArrowRight } from "@/components/ui/brand-button";
import { Field, TextArea, TextField } from "@/components/ui/Field";
import { Erythrocyte } from "@/components/brand/Erythrocyte";
import { Reveal } from "@/components/motion/Reveal";

const TITLE = "Solicitar cotação — ImunoScan";
const DESCRIPTION =
  "Envie a relação de reagentes, a metodologia utilizada e o volume estimado para receber cotação técnica da ImunoScan.";

export const Route = createFileRoute("/cotacao")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Quote,
});

function Quote() {
  const [sent, setSent] = useState(false);
  const [institution, setInstitution] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [methodology, setMethodology] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggleItem = (id: string) =>
    setItems((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <>
      <PageHero
        eyebrow="Cotação"
        title="Solicitar cotação técnica"
        subtitle={DESCRIPTION}
        crumbs={[{ label: "Início", to: "/" }, { label: "Cotação" }]}
      />

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {sent ? (
            <Reveal>
              <div className="rounded-2xl border bg-surface p-8">
                <div className="flex items-center gap-3">
                  <Erythrocyte size={34} />
                  <h2 className="text-xl font-semibold text-ink-950">Solicitação registrada</h2>
                </div>
                <p className="prose-tech mt-4 text-sm">
                  Os dados foram validados no navegador. Este ambiente é uma prova de conceito sem
                  envio real: a integração com o canal comercial da ImunoScan será conectada em etapa
                  posterior.
                </p>
                <ul className="mt-6 space-y-1.5 text-sm text-ink-800">
                  <li>Instituição: {institution || "—"}</li>
                  <li>Contato: {contact || "—"}</li>
                  <li>Itens selecionados: {items.length}</li>
                  <li>Metodologia: {methodology || "não informada"}</li>
                </ul>
                <Button variant="secondary" className="mt-8" onClick={() => setSent(false)}>
                  Revisar solicitação
                </Button>
              </div>
            </Reveal>
          ) : (
            <form
              className="space-y-9"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <fieldset className="space-y-5">
                <legend className="text-sm font-semibold text-ink-950">1. Identificação</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Instituição"
                    required
                    value={institution}
                    onChange={setInstitution}
                    placeholder="Hemocentro, hospital, laboratório ou centro de pesquisa"
                  />
                  <TextField label="Responsável técnico" required value={contact} onChange={setContact} />
                  <TextField label="E-mail" type="email" required value={email} onChange={setEmail} />
                  <TextField label="Telefone" value={phone} onChange={setPhone} />
                  <TextField label="Cidade / UF" value={city} onChange={setCity} />
                  <Field label="Metodologia praticada">
                    {({ className, id }) => (
                      <select
                        id={id}
                        value={methodology}
                        onChange={(event) => setMethodology(event.target.value)}
                        className={`${className} h-11`}
                      >
                        <option value="">Selecione</option>
                        {methodologies.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-ink-950">
                  2. Itens de interesse
                  <span className="ml-2 font-normal text-ink-600">({items.length} selecionados)</span>
                </legend>
                <div className="max-h-80 overflow-y-auto rounded-xl border divide-y">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className="flex cursor-pointer items-start gap-3 px-4 py-3 text-sm transition-colors duration-[var(--duration-fast)] hover:bg-surface"
                    >
                      <input
                        type="checkbox"
                        checked={items.includes(product.id)}
                        onChange={() => toggleItem(product.id)}
                        className="mt-1 size-4 accent-[var(--red-600)]"
                      />
                      <span>
                        <span className="block font-medium text-ink-950">{product.name}</span>
                        <span className="mt-0.5 block font-mono text-[0.7rem] text-ink-600">
                          {product.technical_data.sku ?? product.family} ·{" "}
                          {product.technical_data.presentation ?? "apresentação a confirmar"}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="text-sm font-semibold text-ink-950">3. Detalhes</legend>
                <TextArea
                  label="Volume estimado e observações"
                  value={notes}
                  onChange={setNotes}
                  hint="Informe quantidades por apresentação, periodicidade de consumo e exigências de entrega."
                />
              </fieldset>

              <Button type="submit" size="lg">
                Enviar solicitação
                <ArrowRight />
              </Button>
            </form>
          )}

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-sm font-semibold text-ink-950">Como funciona</h2>
              <ol className="mt-4 space-y-3 text-sm text-ink-800">
                <li>1. Identificação da instituição e do responsável técnico.</li>
                <li>2. Seleção dos itens e da metodologia praticada na bancada.</li>
                <li>3. Retorno da assessoria técnica com condições comerciais.</li>
              </ol>
            </div>
            <EvidenceNote>
              Preços, prazos e disponibilidade atual não constam da base técnica e serão informados
              pela ImunoScan após a validação comercial e regulatória dos itens.
            </EvidenceNote>
          </aside>
        </div>
      </section>
    </>
  );
}
