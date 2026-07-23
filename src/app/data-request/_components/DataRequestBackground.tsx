export function DataRequestBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-background"
    >
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 50% 9%, rgba(26, 34, 64, 0.06), transparent 23%)",
            "radial-gradient(circle at 12% 35%, rgba(55, 84, 155, 0.055), transparent 25%)",
            "radial-gradient(circle at 88% 68%, rgba(55, 84, 155, 0.045), transparent 27%)",
            "linear-gradient(to bottom, #f7f8fa 0%, #f4f6fa 48%, #f7f8fa 100%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 50% 9%, rgba(40, 56, 98, 0.46), transparent 24%)",
            "radial-gradient(circle at 10% 36%, rgba(34, 49, 84, 0.28), transparent 26%)",
            "radial-gradient(circle at 90% 68%, rgba(31, 47, 82, 0.24), transparent 28%)",
            "linear-gradient(to bottom, #0a0f1e 0%, #0b1121 50%, #0a0f1e 100%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.16] dark:opacity-[0.055]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)",
        }}
      />
    </div>
  );
}
