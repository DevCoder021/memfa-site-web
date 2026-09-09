import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass, Home, Mail } from "lucide-react";

const stars = [
	{ left: "8%", top: "18%", size: "3px", delay: "0s", duration: "4.2s" },
	{ left: "18%", top: "64%", size: "2px", delay: "1.4s", duration: "5.3s" },
	{ left: "27%", top: "28%", size: "2px", delay: "2.1s", duration: "3.8s" },
	{ left: "38%", top: "12%", size: "3px", delay: "0.8s", duration: "5.8s" },
	{ left: "48%", top: "76%", size: "2px", delay: "2.8s", duration: "4.8s" },
	{ left: "57%", top: "22%", size: "2px", delay: "1.1s", duration: "3.9s" },
	{ left: "67%", top: "53%", size: "3px", delay: "0.4s", duration: "5.1s" },
	{ left: "79%", top: "16%", size: "2px", delay: "2.4s", duration: "4.5s" },
	{ left: "89%", top: "69%", size: "3px", delay: "1.8s", duration: "5.6s" },
	{ left: "94%", top: "34%", size: "2px", delay: "3s", duration: "4.1s" },
];

export default function NotFound() {
	return (
		<main className="not-found-page relative flex min-h-screen flex-col overflow-hidden bg-[#180b2b] text-[#f8f5ef]">
			<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
				<div className="not-found-glow absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#6b3fa0]/45 blur-[110px]" />
				<div className="not-found-glow not-found-glow-delay absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[#c9971f]/15 blur-[120px]" />
				{stars.map((star, index) => (
					<span
						key={index}
						className="not-found-star absolute rounded-full bg-[#f0cf7a]"
						style={{
							left: star.left,
							top: star.top,
							width: star.size,
							height: star.size,
							animationDelay: star.delay,
							animationDuration: star.duration,
						}}
					/>
				))}
			</div>

			<header className="relative z-10 flex items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
				<Link href="/" className="flex items-center gap-3 text-[#f8f5ef]" aria-label="Retour à l'accueil">
					<Image src="/assets/logo-icon-256.png" alt="" width={38} height={38} className="h-9 w-9 object-contain" />
					<span className="font-display text-xl tracking-wide">MEMFA</span>
				</Link>
				<Link
					href="/don"
					className="rounded-full bg-[#e3b23c] px-4 py-2.5 text-xs font-bold text-[#180b2b] transition-transform hover:-translate-y-0.5 sm:px-5"
				>
					Don en ligne
				</Link>
			</header>

			<section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-12 text-center sm:pt-6">
				<div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0cf7a]">
					<span className="h-px w-8 bg-[#f0cf7a]/70" />
					Page introuvable
					<span className="h-px w-8 bg-[#f0cf7a]/70" />
				</div>

				<div className="not-found-number font-display select-none text-[clamp(8rem,25vw,17rem)] leading-[0.78] font-medium tracking-[-0.06em] text-transparent">
					4<span>0</span>4
				</div>
				<Compass className="not-found-compass mt-5 h-10 w-10 text-[#e3b23c]" strokeWidth={1.3} aria-hidden="true" />

				<h1 className="mt-7 max-w-2xl font-display text-3xl font-medium text-[#f8f5ef] sm:text-5xl">
					Ce chemin n&apos;existe pas
				</h1>
				<p className="mt-5 max-w-md text-sm leading-7 text-[#f8f5ef]/65 sm:text-base">
					La page que vous cherchez a été déplacée ou n&apos;a jamais existé. Retrouvons ensemble le bon chemin.
				</p>

				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-full bg-[#e3b23c] px-6 py-3.5 text-sm font-bold text-[#180b2b] transition-all hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(227,178,60,0.25)]"
					>
						<Home className="h-4 w-4" aria-hidden="true" />
						Retour à l&apos;accueil
					</Link>
					<Link
						href="/#contact"
						className="inline-flex items-center gap-2 rounded-full border border-[#f8f5ef]/25 px-6 py-3.5 text-sm font-medium text-[#f8f5ef] transition-colors hover:border-[#f0cf7a] hover:bg-[#f8f5ef]/5"
					>
						<Mail className="h-4 w-4" aria-hidden="true" />
						Nous contacter
					</Link>
				</div>

				<p className="mt-10 max-w-sm font-display text-sm italic text-[#f0cf7a]/80">
					« Vous brillez comme des luminaires dans le monde. » — Philippiens 2:15
				</p>
			</section>

			<footer className="relative z-10 border-t border-[#f8f5ef]/10 px-6 py-5 text-center text-[11px] tracking-wide text-[#f8f5ef]/45 sm:px-10 lg:px-16">
				<div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-between">
					<span>© 2026 MEMFA — Foi et Action</span>
					<Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#f0cf7a]">
						<ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
						Revenir au site
					</Link>
				</div>
			</footer>
		</main>
	);
}
