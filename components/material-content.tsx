import { CheckSquare, Info } from "lucide-react";
import { sectionToPlainText, type MaterialSection } from "@/lib/materials-data";
import { MaterialCopyButton } from "@/components/material-copy-button";

interface MaterialContentProps {
  sections: MaterialSection[];
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
      {title}
    </h2>
  );
}

function SectionIntro({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
      {text}
    </p>
  );
}

function CopyableSectionHeader({
  title,
  section,
  label,
}: {
  title: string;
  section: MaterialSection;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SectionHeading title={title} />
      <MaterialCopyButton
        text={sectionToPlainText(section)}
        label={label}
        description={`Раздел «${title}» скопирован.`}
        variant="outline"
        size="sm"
        className="border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
      />
    </div>
  );
}

export function MaterialContent({ sections }: MaterialContentProps) {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const key = `${section.type}-${index}`;

        if (section.type === "text") {
          return (
            <section
              key={key}
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              {section.title && <SectionHeading title={section.title} />}
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className="text-sm leading-relaxed text-foreground sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === "terms") {
          return (
            <section
              key={key}
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              {section.title && <SectionHeading title={section.title} />}
              <SectionIntro text={section.intro} />
              <dl className="mt-4 divide-y divide-black/10">
                {section.items.map((item) => (
                  <div key={item.term} className="py-3 first:pt-0 last:pb-0">
                    <dt className="text-sm font-semibold text-foreground">
                      {item.term}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        }

        if (section.type === "steps") {
          const ListTag = section.ordered ? "ol" : "ul";

          return (
            <section
              key={key}
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              {section.title && <SectionHeading title={section.title} />}
              <SectionIntro text={section.intro} />
              <ListTag className="mt-4 space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3f1ec] text-xs font-semibold text-foreground">
                      {section.ordered ? itemIndex + 1 : "•"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ListTag>
            </section>
          );
        }

        if (section.type === "checklist") {
          return (
            <section
              key={key}
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              {section.title ? (
                <CopyableSectionHeader
                  title={section.title}
                  section={section}
                  label="Скопировать раздел"
                />
              ) : (
                <SectionHeading title="Чек-лист" />
              )}
              <SectionIntro text={section.intro} />
              <ul className="mt-4 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#f36f21]" />
                    <span className="text-sm leading-relaxed text-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (section.type === "template") {
          return (
            <section
              key={key}
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              {section.title ? (
                <CopyableSectionHeader
                  title={section.title}
                  section={section}
                  label="Скопировать шаблон"
                />
              ) : (
                <SectionHeading title="Шаблон" />
              )}
              <SectionIntro text={section.intro} />
              <div className="mt-4 overflow-x-auto rounded-lg border border-black/10 bg-[#fbfaf7] p-4">
                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-foreground sm:text-sm">
                  {section.lines.join("\n")}
                </pre>
              </div>
              {section.note && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {section.note}
                </p>
              )}
            </section>
          );
        }

        if (section.type === "table") {
          return (
            <section
              key={key}
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              {section.title ? (
                <CopyableSectionHeader
                  title={section.title}
                  section={section}
                  label="Скопировать таблицу"
                />
              ) : (
                <SectionHeading title="Таблица" />
              )}
              <SectionIntro text={section.intro} />
              <div className="mt-4 overflow-x-auto rounded-lg border border-black/10">
                <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                  <thead className="bg-[#f3f1ec]">
                    <tr>
                      {section.table.columns.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-foreground"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {section.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="align-top">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={
                              cellIndex === 0
                                ? "px-3 py-3 font-medium text-foreground"
                                : "px-3 py-3 text-muted-foreground"
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted-foreground sm:hidden">
                Таблицу можно прокрутить по горизонтали.
              </p>
              {section.note && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {section.note}
                </p>
              )}
            </section>
          );
        }

        if (section.type === "callout") {
          return (
            <section
              key={key}
              className="rounded-xl border border-[#f36f21]/25 bg-[#fff7f1] p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#c8560f]">
                  <Info className="h-4 w-4" />
                </span>
                <div>
                  {section.title && (
                    <h2 className="text-base font-semibold text-foreground">
                      {section.title}
                    </h2>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    {section.text}
                  </p>
                </div>
              </div>
            </section>
          );
        }

        return (
          <section
            key={key}
            className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
          >
            {section.title && <SectionHeading title={section.title} />}
            <SectionIntro text={section.intro} />
            <div className="mt-4 space-y-3">
              {section.lines.map((line, lineIndex) => (
                <p
                  key={lineIndex}
                  className="text-sm leading-relaxed text-foreground"
                >
                  {line}
                </p>
              ))}
              {section.result && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800">
                  {section.result}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
