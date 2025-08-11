export function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-in-out"
    >
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_80%_20%,#4A5B7C,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_20%_40%,#6B4E3D,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_60%_60%,#3B2F4A,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_30%_70%,#4A3B2F,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_70%_80%,#2F2B3B,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(30%_30%_at_90%_70%,#1A1B2E,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </div>
  );
}
