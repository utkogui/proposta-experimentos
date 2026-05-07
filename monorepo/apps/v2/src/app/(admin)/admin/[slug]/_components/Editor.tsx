"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Proposta } from "@/lib/types";
import { normalizeSectionOrder } from "@/lib/types";
import {
  Field,
  TextArea,
  TextInput,
  ListEditor,
  Section,
  LogoUploader,
  CronogramaEditor,
  SectionOrderEditor,
} from "./EditorParts";

export function Editor({ initial }: { initial: Proposta }) {
  const router = useRouter();
  const [data, setData] = useState<Proposta>(initial);
  const [saving, startSaving] = useTransition();
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "ok"; at: number }
    | { kind: "err"; msg: string }
  >({ kind: "idle" });

  function update<K extends keyof Proposta>(
    key: K,
    value: Proposta[K]
  ) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setStatus({ kind: "idle" });
    startSaving(async () => {
      const res = await fetch(`/api/admin/propostas/${data.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus({
          kind: "err",
          msg: body?.error ?? "Erro ao salvar",
        });
        return;
      }
      const { proposta } = await res.json();
      setData(proposta);
      setStatus({ kind: "ok", at: Date.now() });
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!confirm(`Excluir a proposta "${data.cliente.nome}"? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/propostas/${data.slug}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-[57px] z-10 bg-neutral-50 -mx-6 px-6 py-3 flex items-center justify-between border-b border-neutral-200">
        <div className="text-sm">
          {status.kind === "ok" && (
            <span className="text-green-700">Salvo ✓</span>
          )}
          {status.kind === "err" && (
            <span className="text-red-600">{status.msg}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-600 hover:text-red-700 px-3 py-2"
          >
            Excluir
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="text-sm rounded-lg bg-neutral-900 text-white font-medium px-4 py-2 hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>

      <Section title="Cliente" defaultOpen>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome do cliente">
            <TextInput
              value={data.cliente.nome}
              onChange={(v) =>
                update("cliente", { ...data.cliente, nome: v })
              }
            />
          </Field>
          <Field label="Contato">
            <TextInput
              value={data.cliente.contato}
              onChange={(v) =>
                update("cliente", { ...data.cliente, contato: v })
              }
            />
          </Field>
          <Field label="Logo do cliente" full>
            <LogoUploader
              currentUrl={data.cliente.logoUrl}
              currentBg={data.cliente.logoBg}
              onChange={(url) =>
                update("cliente", { ...data.cliente, logoUrl: url })
              }
              onChangeBg={(bg) =>
                update("cliente", { ...data.cliente, logoBg: bg })
              }
            />
          </Field>
        </div>
      </Section>

      <Section title="Dados da proposta">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Número (ex.: #832)">
            <TextInput
              value={data.proposta.numero}
              onChange={(v) =>
                update("proposta", { ...data.proposta, numero: v })
              }
            />
          </Field>
          <Field label="Projeto">
            <TextInput
              value={data.proposta.projeto}
              onChange={(v) =>
                update("proposta", { ...data.proposta, projeto: v })
              }
            />
          </Field>
          <Field label="Data (ex.: Abril 2026)">
            <TextInput
              value={data.proposta.data}
              onChange={(v) =>
                update("proposta", { ...data.proposta, data: v })
              }
            />
          </Field>
          <Field label="Cidade">
            <TextInput
              value={data.proposta.cidade}
              onChange={(v) =>
                update("proposta", { ...data.proposta, cidade: v })
              }
            />
          </Field>
          <Field label="Label superior do hero" full>
            <TextInput
              value={data.proposta.label}
              onChange={(v) =>
                update("proposta", { ...data.proposta, label: v })
              }
            />
          </Field>
        </div>
      </Section>

      <Section title="Hero">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Título">
            <TextInput
              value={data.hero.titulo}
              onChange={(v) => update("hero", { ...data.hero, titulo: v })}
            />
          </Field>
          <Field label="Título destaque (em accent)">
            <TextInput
              value={data.hero.tituloAccent}
              onChange={(v) =>
                update("hero", { ...data.hero, tituloAccent: v })
              }
            />
          </Field>
          <Field label="Subtítulo" full>
            <TextArea
              value={data.hero.subtitulo}
              onChange={(v) =>
                update("hero", { ...data.hero, subtitulo: v })
              }
            />
          </Field>
        </div>
        <ListEditor
          label="Aspectos (caixinhas do hero)"
          items={data.aspects}
          empty={() => ({ valor: "", label: "" })}
          onChange={(items) => update("aspects", items)}
          render={(item, set) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                value={item.valor}
                onChange={(v) => set({ ...item, valor: v })}
                placeholder="Ex.: 4 semanas"
              />
              <TextInput
                value={item.label}
                onChange={(v) => set({ ...item, label: v })}
                placeholder="Ex.: Correção do site"
              />
            </div>
          )}
        />
      </Section>

      <Section title="Ordem dos blocos">
        <SectionOrderEditor
          value={normalizeSectionOrder(data.sectionOrder)}
          onChange={(sectionOrder) => update("sectionOrder", sectionOrder)}
        />
      </Section>

      <Section title="01 · Solução">
        <Field label="Section label">
          <TextInput
            value={data.solucao.sectionLabel}
            onChange={(v) =>
              update("solucao", { ...data.solucao, sectionLabel: v })
            }
          />
        </Field>
        <Field label="Título da seção">
          <TextArea
            value={data.solucao.heading}
            onChange={(v) =>
              update("solucao", { ...data.solucao, heading: v })
            }
          />
        </Field>
        <Field label="Lead (parágrafo principal)">
          <TextArea
            value={data.solucao.lead}
            onChange={(v) =>
              update("solucao", { ...data.solucao, lead: v })
            }
            rows={5}
          />
        </Field>
        <ListEditor
          label="Cards"
          items={data.solucao.cards}
          empty={() => ({ label: "", titulo: "", descricao: "", itens: [] })}
          onChange={(items) =>
            update("solucao", { ...data.solucao, cards: items })
          }
          render={(item, set) => (
            <div className="space-y-3">
              <TextInput
                value={item.label}
                onChange={(v) => set({ ...item, label: v })}
                placeholder="Label (ex.: Nosso foco)"
              />
              <TextInput
                value={item.titulo}
                onChange={(v) => set({ ...item, titulo: v })}
                placeholder="Título"
              />
              <TextArea
                value={item.descricao}
                onChange={(v) => set({ ...item, descricao: v })}
                placeholder="Descrição (opcional)"
              />
              <ListEditor
                label="Itens (bullets)"
                items={item.itens}
                empty={() => ""}
                onChange={(itens) => set({ ...item, itens })}
                render={(it, setIt) => (
                  <TextInput value={it} onChange={setIt} />
                )}
                compact
              />
            </div>
          )}
        />
      </Section>

      <Section title="02 · Objetivo">
        <Field label="Section label">
          <TextInput
            value={data.objetivo.sectionLabel}
            onChange={(v) =>
              update("objetivo", { ...data.objetivo, sectionLabel: v })
            }
          />
        </Field>
        <Field label="Título">
          <TextArea
            value={data.objetivo.heading}
            onChange={(v) =>
              update("objetivo", { ...data.objetivo, heading: v })
            }
          />
        </Field>
        <Field label="Lead">
          <TextArea
            value={data.objetivo.lead}
            onChange={(v) =>
              update("objetivo", { ...data.objetivo, lead: v })
            }
          />
        </Field>
        <ListEditor
          label="Pilares (etapas)"
          items={data.objetivo.pilares}
          empty={() => ({ label: "", titulo: "", descricao: "" })}
          onChange={(items) =>
            update("objetivo", { ...data.objetivo, pilares: items })
          }
          render={(item, set) => (
            <div className="space-y-3">
              <TextInput
                value={item.label}
                onChange={(v) => set({ ...item, label: v })}
                placeholder="Etapa 0X"
              />
              <TextInput
                value={item.titulo}
                onChange={(v) => set({ ...item, titulo: v })}
                placeholder="Título do pilar"
              />
              <TextArea
                value={item.descricao}
                onChange={(v) => set({ ...item, descricao: v })}
              />
            </div>
          )}
        />
        <Field label="Heading do bloco 'O que nos conecta'">
          <TextInput
            value={data.objetivo.headingConexao}
            onChange={(v) =>
              update("objetivo", { ...data.objetivo, headingConexao: v })
            }
          />
        </Field>
        <Field label="Lead da conexão">
          <TextArea
            value={data.objetivo.leadConexao}
            onChange={(v) =>
              update("objetivo", { ...data.objetivo, leadConexao: v })
            }
            rows={5}
          />
        </Field>
        <Field label="Callout (caixa destacada)">
          <TextArea
            value={data.objetivo.callout}
            onChange={(v) =>
              update("objetivo", { ...data.objetivo, callout: v })
            }
            rows={4}
          />
        </Field>
      </Section>

      <Section title="03 · Imersão">
        <Field label="Section label">
          <TextInput
            value={data.imersao.sectionLabel}
            onChange={(v) =>
              update("imersao", { ...data.imersao, sectionLabel: v })
            }
          />
        </Field>
        <Field label="Título">
          <TextInput
            value={data.imersao.heading}
            onChange={(v) =>
              update("imersao", { ...data.imersao, heading: v })
            }
          />
        </Field>
        <Field label="Lead">
          <TextArea
            value={data.imersao.lead}
            onChange={(v) =>
              update("imersao", { ...data.imersao, lead: v })
            }
            rows={5}
          />
        </Field>
        <Field label="Callout">
          <TextArea
            value={data.imersao.callout}
            onChange={(v) =>
              update("imersao", { ...data.imersao, callout: v })
            }
          />
        </Field>
        <ListEditor
          label="Steps da imersão"
          items={data.imersao.steps}
          empty={() => ({ titulo: "", descricao: "" })}
          onChange={(items) =>
            update("imersao", { ...data.imersao, steps: items })
          }
          render={(item, set) => (
            <div className="space-y-3">
              <TextInput
                value={item.titulo}
                onChange={(v) => set({ ...item, titulo: v })}
                placeholder="Título"
              />
              <TextArea
                value={item.descricao}
                onChange={(v) => set({ ...item, descricao: v })}
              />
            </div>
          )}
        />
      </Section>

      <Section title="04 · Cronograma">
        <Field label="Section label">
          <TextInput
            value={data.cronograma.sectionLabel}
            onChange={(v) =>
              update("cronograma", {
                ...data.cronograma,
                sectionLabel: v,
              })
            }
          />
        </Field>
        <Field label="Título">
          <TextInput
            value={data.cronograma.heading}
            onChange={(v) =>
              update("cronograma", { ...data.cronograma, heading: v })
            }
          />
        </Field>
        <Field label="Lead">
          <TextArea
            value={data.cronograma.lead}
            onChange={(v) =>
              update("cronograma", { ...data.cronograma, lead: v })
            }
          />
        </Field>
        <Field label="Nota (rodapé do cronograma)">
          <TextInput
            value={data.cronograma.nota}
            onChange={(v) =>
              update("cronograma", { ...data.cronograma, nota: v })
            }
          />
        </Field>
        <CronogramaEditor
          value={data.cronograma}
          onChange={(c) => update("cronograma", c)}
        />
      </Section>

      <Section title="05 · Equipe">
        <Field label="Section label">
          <TextInput
            value={data.equipe.sectionLabel}
            onChange={(v) =>
              update("equipe", { ...data.equipe, sectionLabel: v })
            }
          />
        </Field>
        <Field label="Título">
          <TextInput
            value={data.equipe.heading}
            onChange={(v) =>
              update("equipe", { ...data.equipe, heading: v })
            }
          />
        </Field>
        <Field label="Lead">
          <TextArea
            value={data.equipe.lead}
            onChange={(v) =>
              update("equipe", { ...data.equipe, lead: v })
            }
          />
        </Field>
        <ListEditor
          label="Membros do squad"
          items={data.equipe.membros}
          empty={() => ({ label: "", titulo: "", descricao: "" })}
          onChange={(items) =>
            update("equipe", { ...data.equipe, membros: items })
          }
          render={(item, set) => (
            <div className="space-y-3">
              <TextInput
                value={item.label}
                onChange={(v) => set({ ...item, label: v })}
                placeholder="Label (ex.: Gestão)"
              />
              <TextInput
                value={item.titulo}
                onChange={(v) => set({ ...item, titulo: v })}
                placeholder="Cargo / título"
              />
              <TextArea
                value={item.descricao}
                onChange={(v) => set({ ...item, descricao: v })}
              />
            </div>
          )}
        />
      </Section>

      <Section title="06 · Histórico">
        <Field label="Section label">
          <TextInput
            value={data.historico.sectionLabel}
            onChange={(v) =>
              update("historico", { ...data.historico, sectionLabel: v })
            }
          />
        </Field>
        <Field label="Título">
          <TextInput
            value={data.historico.heading}
            onChange={(v) =>
              update("historico", { ...data.historico, heading: v })
            }
          />
        </Field>
        <Field label="Lead">
          <TextArea
            value={data.historico.lead}
            onChange={(v) =>
              update("historico", { ...data.historico, lead: v })
            }
          />
        </Field>
        <ListEditor
          label="Estatísticas"
          items={data.historico.stats}
          empty={() => ({ label: "", valor: "" })}
          onChange={(items) =>
            update("historico", { ...data.historico, stats: items })
          }
          render={(item, set) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                value={item.label}
                onChange={(v) => set({ ...item, label: v })}
                placeholder="Label"
              />
              <TextInput
                value={item.valor}
                onChange={(v) => set({ ...item, valor: v })}
                placeholder="Valor"
              />
            </div>
          )}
        />
      </Section>

      <Section title="07 · Investimento">
        <Field label="Section label">
          <TextInput
            value={data.investimento.sectionLabel}
            onChange={(v) =>
              update("investimento", {
                ...data.investimento,
                sectionLabel: v,
              })
            }
          />
        </Field>
        <Field label="Título">
          <TextInput
            value={data.investimento.heading}
            onChange={(v) =>
              update("investimento", { ...data.investimento, heading: v })
            }
          />
        </Field>
        <Field label="Lead">
          <TextArea
            value={data.investimento.lead}
            onChange={(v) =>
              update("investimento", { ...data.investimento, lead: v })
            }
          />
        </Field>
        <ListEditor
          label="Blocos de investimento"
          items={data.investimento.blocos}
          empty={() => ({
            label: "",
            titulo: "",
            preco: "",
            sufixoPreco: "",
            pagamento: "",
          })}
          onChange={(items) =>
            update("investimento", {
              ...data.investimento,
              blocos: items,
            })
          }
          render={(item, set) => (
            <div className="space-y-3">
              <TextInput
                value={item.label}
                onChange={(v) => set({ ...item, label: v })}
                placeholder="Label"
              />
              <TextInput
                value={item.titulo}
                onChange={(v) => set({ ...item, titulo: v })}
                placeholder="Título"
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <TextInput
                    value={item.preco}
                    onChange={(v) => set({ ...item, preco: v })}
                    placeholder="R$ 15.680,00"
                  />
                </div>
                <TextInput
                  value={item.sufixoPreco}
                  onChange={(v) => set({ ...item, sufixoPreco: v })}
                  placeholder="/ mês"
                />
              </div>
              <TextArea
                value={item.pagamento}
                onChange={(v) => set({ ...item, pagamento: v })}
                placeholder="Condição de pagamento"
              />
            </div>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Label do total">
            <TextInput
              value={data.investimento.totalLabel}
              onChange={(v) =>
                update("investimento", {
                  ...data.investimento,
                  totalLabel: v,
                })
              }
            />
          </Field>
          <Field label="Valor total">
            <TextInput
              value={data.investimento.totalPreco}
              onChange={(v) =>
                update("investimento", {
                  ...data.investimento,
                  totalPreco: v,
                })
              }
            />
          </Field>
        </div>
        <Field label="Observações — texto introdutório">
          <TextArea
            value={data.investimento.observacoes.texto}
            onChange={(v) =>
              update("investimento", {
                ...data.investimento,
                observacoes: {
                  ...data.investimento.observacoes,
                  texto: v,
                },
              })
            }
            rows={5}
          />
        </Field>
        <ListEditor
          label="Observações — bullets"
          items={data.investimento.observacoes.itens}
          empty={() => ""}
          onChange={(itens) =>
            update("investimento", {
              ...data.investimento,
              observacoes: {
                ...data.investimento.observacoes,
                itens,
              },
            })
          }
          render={(it, setIt) => <TextInput value={it} onChange={setIt} />}
          compact
        />
      </Section>

      <Section title="08 · Próximos passos">
        <Field label="Section label">
          <TextInput
            value={data.proximos.sectionLabel}
            onChange={(v) =>
              update("proximos", { ...data.proximos, sectionLabel: v })
            }
          />
        </Field>
        <Field label="Título">
          <TextInput
            value={data.proximos.heading}
            onChange={(v) =>
              update("proximos", { ...data.proximos, heading: v })
            }
          />
        </Field>
        <ListEditor
          label="Steps"
          items={data.proximos.steps}
          empty={() => ({ titulo: "", descricao: "" })}
          onChange={(items) =>
            update("proximos", { ...data.proximos, steps: items })
          }
          render={(item, set) => (
            <div className="space-y-3">
              <TextInput
                value={item.titulo}
                onChange={(v) => set({ ...item, titulo: v })}
                placeholder="Título"
              />
              <TextArea
                value={item.descricao}
                onChange={(v) => set({ ...item, descricao: v })}
              />
            </div>
          )}
        />
      </Section>

      <div className="pt-4 pb-12 text-center">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-lg bg-neutral-900 text-white text-sm font-medium px-6 py-3 hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
