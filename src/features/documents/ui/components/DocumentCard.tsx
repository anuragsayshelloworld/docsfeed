import { ArrowRight, Calendar, FileText, User } from 'lucide-react';
import { formatSavedDate } from '../../../../shared/lib/date';
import type { DocumentRecord } from '../../../../entities/documents/model/types';

interface DocumentCardProps {
  document: DocumentRecord;
  onOpen: (document: DocumentRecord) => void;
}

export function DocumentCard({ document, onOpen }: DocumentCardProps): JSX.Element {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(document)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpen(document);
      }}
      className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-700 bg-slate-900/75 p-5 shadow-lg shadow-black/25 transition-all duration-200 hover:border-cyan-400/40 hover:bg-slate-900"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/15 transition-colors group-hover:bg-cyan-500/25">
          <FileText className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
            {document.title}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {document.author}
            </span>
            <span className="hidden items-center gap-1 md:flex">
              <Calendar className="h-4 w-4" />
              {formatSavedDate(document.savedAt)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-300 transition-colors hover:bg-cyan-500/10 hover:text-cyan-200">
        <span className="text-sm font-medium">View</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}
