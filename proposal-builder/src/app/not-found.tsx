import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030A0E] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <Logo variant="dark" width={180} height={40} className="mx-auto" />
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white font-heading">404</h1>
          <h2 className="text-lg font-bold text-slate-200">Página no encontrada</h2>
          <p className="text-xs text-slate-400">
            La ruta o propuesta solicitada no existe o ha sido movida.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F7A8C] hover:bg-[#196270] text-white text-sm font-semibold rounded-xl transition-all"
        >
          Volver al Panel Principal
        </Link>
      </div>
    </div>
  );
}
