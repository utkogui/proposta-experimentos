import { notFound } from "next/navigation";
import { getProposta } from "@/lib/storage";
import { listClientLogoSvgs } from "@/lib/client-proof-logos";
import { PropostaView } from "@/components/proposta/PropostaView";

export const dynamic = "force-dynamic";

export default async function PropostaPublicaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposta = await getProposta(slug);
  if (!proposta) notFound();
  const clientLogoFiles = listClientLogoSvgs();
  return (
    <PropostaView data={proposta} clientLogoFiles={clientLogoFiles} />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProposta(slug);
  if (!p) return { title: "Proposta não encontrada" };
  return {
    title: `Proposta · ${p.cliente.nome} · ${p.proposta.projeto} · Matilha`,
    description: p.hero.subtitulo,
  };
}
