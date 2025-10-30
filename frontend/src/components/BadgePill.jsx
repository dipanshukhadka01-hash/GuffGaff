export default function BadgePill({ label, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-secondary/40 bg-secondary/10 p-4 text-sm text-secondary">
      <p className="font-semibold">{label}</p>
      <p className="text-xs text-secondary/80">{description}</p>
    </div>
  );
}
