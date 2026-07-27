export default function BackgroundAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-heroGradient" />

      <div
        className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full opacity-60 animate-floaty"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,240,255,0.55), rgba(0,240,255,0.15) 55%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      <div
        className="absolute top-[10%] right-[-8%] h-[620px] w-[620px] rounded-full opacity-70 animate-floaty"
        style={{
          background:
            "radial-gradient(closest-side, rgba(88,28,135,0.55), rgba(168,85,247,0.18) 50%, transparent 75%)",
          filter: "blur(22px)",
          animationDelay: "-3s",
        }}
      />

      <div
        className="absolute bottom-[-10%] left-[20%] h-[560px] w-[560px] rounded-full opacity-50 animate-floaty"
        style={{
          background:
            "radial-gradient(closest-side, rgba(14,165,233,0.55), rgba(59,130,246,0.18) 55%, transparent 75%)",
          filter: "blur(26px)",
          animationDelay: "-6s",
        }}
      />

      <div
        className="absolute left-1/2 top-[42%] h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 animate-pulseGlow"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,240,255,0.35), rgba(0,240,255,0.08) 45%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        }}
      />

      <div className="grain absolute inset-0" />

      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-56"
        style={{
          background:
            "linear-gradient(0deg, rgba(5,7,13,0.9) 0%, rgba(5,7,13,0) 100%)",
        }}
      />
    </div>
  );
}
