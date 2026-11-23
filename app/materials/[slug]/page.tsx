import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Library,
} from "lucide-react";
import { MaterialContent } from "@/components/material-content";
import { MaterialCopyButton } from "@/components/material-copy-button";
import {
  getMaterialBySlug,
  materialToPlainText,
  materials,
  promptLibraryHref,
} from "@/lib/materials-data";

interface MaterialPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.slug }));
}

export async function generateMetadata({
  params,
}: MaterialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);

  if (!material) {
    return { title: "Материал не найден — ГК ПИР" };
  }

  return {
    title: `${material.shortTitle} — ГК ПИР`,
    description: material.description,
  };
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);

  if (!material) {
    notFound();
  }

  const copyText = materialToPlainText(material);
  const currentIndex = materials.findIndex(
    (item) => item.slug === material.slug
  );
  const nextMaterial =
    currentIndex >= 0 && currentIndex < materials.length - 1
      ? materials[currentIndex + 1]
      : null;

  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/materials"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Полезные материалы
        </Link>

        <header className="mt-5 border-b border-black/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {material.category}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {material.readingTime}
            </span>
            <span className="rounded-full bg-[#f3f1ec] px-2.5 py-1 text-[11px] text-muted-foreground">
              Доступно без уроков
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {material.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {material.intro}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {material.copyable && (
              <MaterialCopyButton
                text={copyText}
                label={material.copyLabel}
                description={`«${material.shortTitle}» скопирован в буфер обмена.`}
                className="h-11"
              />
            )}
            <Link
              href={promptLibraryHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-foreground transition-colors hover:bg-[#f9f8f5]"
            >
              <Library className="h-4 w-4" />
              Библиотека промптов
            </Link>
          </div>
        </header>

        <div className="mt-6">
          <MaterialContent sections={material.sections} />
        </div>

        <nav
          aria-label="Навигация по материалам"
          className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href="/materials"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Все материалы
          </Link>

          {nextMaterial ? (
            <Link
              href={`/materials/${nextMaterial.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
            >
              {nextMaterial.shortTitle}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={promptLibraryHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
            >
              Перейти в библиотеку промптов
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
