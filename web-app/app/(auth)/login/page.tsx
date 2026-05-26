import { Globe2 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Globe2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">{siteConfig.name}</h1>
            <p className="text-sm text-slate-500">Secure agency login</p>
          </div>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
