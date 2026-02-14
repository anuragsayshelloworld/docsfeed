interface DocumentsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function DocumentsSearchBar({ value, onChange }: DocumentsSearchBarProps): JSX.Element {
  return (
    <div className="border-b border-slate-800 bg-slate-950/70 p-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-lg items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 shadow-lg shadow-black/20">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search your documentation"
          className="w-full bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
