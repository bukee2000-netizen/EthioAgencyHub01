import Link from 'next/link';
import { ArrowRight, CircleCheckBig } from 'lucide-react';

type ModulePageProps = {
  title: string;
  workflows: string[];
  actions: { label: string; href: string }[];
};

export function ModulePage({ title, workflows, actions }: ModulePageProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Operations module</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">{title}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              {action.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workflows.map((workflow) => (
          <article key={workflow} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <CircleCheckBig className="mb-4 h-6 w-6 text-brand-600" />
            <h3 className="font-semibold text-ink">{workflow}</h3>
            <p className="mt-2 text-sm text-slate-500">Ready for database-backed implementation with agency isolation, validation, and audit logging.</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">Open workflow <ArrowRight className="h-4 w-4" /></div>
          </article>
        ))}
      </section>
    </div>
  );
}
