interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleInput({ value, onChange }: TitleInputProps): JSX.Element {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Document Title</p>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Build notes, design spec, runbook..."
        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-2xl font-bold text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
      />
    </div>
  );
}
