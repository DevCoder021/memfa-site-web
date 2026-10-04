import Image from "next/image";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="flex min-h-[62vh] flex-col items-center justify-center bg-white px-6 text-center"
    >
      <Image
        src="/assets/logo.png"
        alt=""
        width={72}
        height={72}
        className="mb-6 h-18 w-18 object-contain"
        priority
      />
      <LoaderCircle
        className="mb-4 h-6 w-6 animate-spin text-(--color-memfa-or)"
        aria-hidden="true"
      />
      <p className="font-serif text-xl font-semibold text-(--color-memfa-violet-deep)">
        Préparation de la page
      </p>
      <p className="mt-2 text-sm text-gray-500">Merci de patienter un instant.</p>
    </section>
  );
}