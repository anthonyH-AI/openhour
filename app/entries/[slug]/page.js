import Link from "next/link";
import { marked } from "marked";
import { getAllEntries, getEntry } from "../../../lib/entries";
import { formatDate } from "../../../lib/format-date";

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.slug }));
}

export default function EntryPage({ params }) {
  const entry = getEntry(params.slug);
  const html = marked.parse(entry.content);

  return (
    <>
      <p className="back">
        <Link href="/">&larr; all entries</Link>
      </p>
      <article>
        <p className="entry-meta">
          {formatDate(entry.date)}
          <span className="entry-type"> · {entry.type}</span>
        </p>
        <h1>{entry.title}</h1>
        <div
          className="entry-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </>
  );
}
