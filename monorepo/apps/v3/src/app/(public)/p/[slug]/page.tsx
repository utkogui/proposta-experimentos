import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getProposta } from "@/lib/storage";
import {
  listClientLogoSvgs,
  listEducationProofLogos,
} from "@/lib/client-proof-logos";
import { PropostaView } from "@/components/proposta/PropostaView";
import {
  CMS_TEMPLATE_COOKIE,
  CMS_TEMPLATE_HEADER,
  parseTemplateCookie,
} from "@/lib/cms-template";

export const dynamic = "force-dynamic";

export default async function PropostaPublicaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposta = await getProposta(slug);
  if (!proposta) notFound();
  const clientLogoFiles =
    slug === "educacao"
      ? listEducationProofLogos()
      : listClientLogoSvgs();
  const h = await headers();
  const jar = await cookies();
  const template = parseTemplateCookie(
    h.get(CMS_TEMPLATE_HEADER) ?? jar.get(CMS_TEMPLATE_COOKIE)?.value,
  );
  return (
    <PropostaView
      data={proposta}
      clientLogoFiles={clientLogoFiles}
      template={template}
    />
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
