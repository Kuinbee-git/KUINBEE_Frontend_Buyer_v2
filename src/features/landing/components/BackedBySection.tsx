import Image from "next/image";

const partners = [
  {
    name: "Google Cloud",
    lightSrc: "/Logo-Google-Cloud-500x313.png",
    darkSrc: "/Logo-Google-Cloud-500x313.png",
    width: 120,
    height: 40,
    className: "",
  },
  {
    name: "Amazon Web Services",
    lightSrc: "/aws-light.png",
    darkSrc: "/aws.png",
    width: 72,
    height: 40,
    className: "",
  },
  {
    name: "NVIDIA Inception",
    lightSrc: "/nvidia-inception-program-badge-rgb-for-screen.png",
    darkSrc: "/nvidia-inception-program-badge-rgb-for-screen.png",
    width: 110,
    height: 44,
    className: "",
  },
  {
    name: "ElevenLabs",
    lightSrc: "https://eleven-public-cdn.elevenlabs.io/payloadcms/pwsc4vchsqt-ElevenLabsGrants.webp",
    darkSrc: "https://eleven-public-cdn.elevenlabs.io/payloadcms/cy7rxce8uki-IIElevenLabsGrants%201.webp",
    width: 160,
    height: 40,
    className: "",
  },
];

export function BackedBySection() {
  return (
    <section className="relative py-12 md:py-16 border-y border-primary/8 dark:border-white/8">
      <div className="absolute inset-0 bg-primary/[0.015] dark:bg-white/[0.015]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Label */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50 dark:text-white/40 whitespace-nowrap">
              Backed By
            </span>
          </div>

          {/* Logos */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-10 gap-y-6">
            {partners.map((p) => (
              <div key={p.name} className="flex items-center">
                <Image
                  src={p.lightSrc}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  className={`block dark:hidden object-contain opacity-70 hover:opacity-100 transition-opacity duration-200 ${p.className}`}
                  style={{ height: `${p.height}px`, width: "auto" }}
                />
                <Image
                  src={p.darkSrc}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  className={`hidden dark:block object-contain opacity-60 hover:opacity-90 transition-opacity duration-200 ${p.className}`}
                  style={{ height: `${p.height}px`, width: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
