import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  HelpCircle,
  Home,
  LogOut,
  MoreVertical,
  PanelLeft,
  Plus,
  Search,
  Settings,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  deleteDocumentById,
  getDocumentsByAuthor,
} from '../../entities/documents/api/documents-api';
import type { DocumentRecord } from '../../entities/documents/model/types';
import { useMobile } from '../../shared/hooks/useMobile';
import { clearAuthSession, getAuthSession } from '../../shared/lib/auth-storage';
import { queryKeys } from '../../shared/lib/query-keys';
import { LoaderSpinner } from '../../shared/ui/LoaderSpinner';
import { useUiStore } from '../../store/ui-store';

export function Sidebar(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const session = getAuthSession();
  const username = session?.username ?? '';

  const isMobile = useMobile(756);
  const [expanded, setExpanded] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<DocumentRecord | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sidebarSearch = useUiStore((store) => store.sidebarSearch);
  const setSidebarSearch = useUiStore((store) => store.setSidebarSearch);
  const startCreateDocument = useUiStore((store) => store.startCreateDocument);
  const startEditingDocument = useUiStore((store) => store.startEditingDocument);

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [isMobile]);

  const documentsQuery = useQuery({
    queryKey: queryKeys.documents(username),
    queryFn: () => getDocumentsByAuthor(username),
    enabled: Boolean(username),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocumentById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.documentsRoot });
      setDeleteCandidate(null);
      setActiveDropdown(null);
    },
  });

  const filteredDocuments = useMemo(() => {
    const documents = documentsQuery.data ?? [];

    if (!sidebarSearch.trim()) {
      return documents;
    }

    const normalized = sidebarSearch.toLowerCase();
    return documents.filter((document) => document.title.toLowerCase().includes(normalized));
  }, [documentsQuery.data, sidebarSearch]);

  const createDocument = (): void => {
    startCreateDocument();
    navigate('/editor');
  };

  const editDocument = (document: DocumentRecord): void => {
    startEditingDocument(document);
    navigate(`/editor/${document.id}`);
    setActiveDropdown(null);
  };

  const openDocument = (document: DocumentRecord): void => {
    navigate(`/viewer/${document.id}`, { state: { document } });
  };

  const logout = (): void => {
    clearAuthSession();
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={`flex h-full flex-col border-r border-slate-800 bg-slate-950/85 shadow-xl shadow-black/20 transition-[width] duration-300 ${
        expanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center px-5 py-4" title="Home">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-100 transition-colors hover:text-cyan-300"
          >
            <Home className="h-5 w-5" />
            <span
              className={`overflow-hidden text-lg font-semibold transition-all duration-300 ${
                expanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
              }`}
            >
              DocFeed
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="group m-2 flex h-10 items-center rounded-lg p-3 transition hover:bg-slate-800/70"
        >
          <PanelLeft className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-200" />
          <span
            className={`ml-2 whitespace-nowrap text-sm font-medium text-slate-400 transition-all duration-300 ${
              expanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'
            }`}
          >
            Collapse
          </span>
        </button>

        <button
          type="button"
          onClick={createDocument}
          className={`group m-2 flex h-10 items-center rounded-lg p-3 transition hover:bg-slate-800/70 ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
          title="Create document"
        >
          <Plus className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-200" />
          <span
            className={`ml-2 whitespace-nowrap text-sm font-medium text-slate-400 transition-all duration-300 ${
              expanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'
            }`}
          >
            Create new
          </span>
        </button>

        <div
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
            }
          }}
          className={`group m-2 flex h-10 cursor-pointer items-center rounded-lg p-3 transition hover:bg-slate-800/70 ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
          title="Search"
        >
          <Search className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-200" />
          <div
            className={`ml-2 flex-1 overflow-hidden transition-all duration-300 ${
              expanded ? 'opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <input
              type="text"
              value={sidebarSearch}
              onChange={(event) => setSidebarSearch(event.target.value)}
              placeholder="Search"
              className="w-full border-none bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div
          className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
            expanded ? 'opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-2 pt-4 text-xs font-semibold uppercase text-slate-500">
            My Documents
          </div>

          <div className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-2 pb-2 pr-1">
            {documentsQuery.isLoading ? (
              <LoaderSpinner />
            ) : (
              filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  onClick={() => openDocument(document)}
                  className="group relative flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800/80"
                >
                  <span className="truncate">{document.title}</span>

                  <div className="relative" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown((current) =>
                          current === document.id ? null : document.id,
                        )
                      }
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </button>

                    {activeDropdown === document.id ? (
                      <div className="absolute right-0 top-6 z-50 min-w-[140px] rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl shadow-black/30">
                        <button
                          type="button"
                          onClick={() => editDocument(document)}
                          className="w-full px-3 py-2 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteCandidate(document);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-rose-300 transition-colors hover:bg-slate-800"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="relative p-2">
        <button
          type="button"
          onClick={() => setShowUserMenu((current) => !current)}
          className={`flex w-full items-center rounded-lg p-2 transition hover:bg-slate-800/80 ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <img
            src={session?.image ?? '/avatar.png'}
            alt={session?.username ?? 'User'}
            className="h-10 w-10 rounded-full"
          />

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? 'ml-3 w-[140px] opacity-100' : 'ml-0 w-0 opacity-0'
            }`}
          >
            <div className="flex flex-col text-left">
              <span className="truncate text-sm font-semibold text-slate-200">{session?.username}</span>
              <span className="truncate text-xs text-slate-500">
                {session?.role === 1 ? 'Administrator' : 'Collaborator'}
              </span>
            </div>
          </div>
        </button>

        <div
          className={`absolute bottom-full z-50 rounded-lg border border-slate-700 bg-slate-900 shadow-xl shadow-black/30 transition-all duration-300 ${
            expanded ? 'left-0 right-0' : 'left-0 w-40'
          } ${
            showUserMenu
              ? 'visible translate-y-0 opacity-100'
              : 'invisible translate-y-4 opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-t-lg p-3 text-sm text-rose-300 transition-colors hover:bg-slate-800"
          >
            <LogOut size={16} />
            Logout
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 border-t border-slate-700 p-3 text-sm text-slate-300 transition-colors hover:bg-slate-800"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-b-lg border-t border-slate-700 p-3 text-sm text-slate-300 transition-colors hover:bg-slate-800"
          >
            <HelpCircle size={16} />
            Learn more
          </button>
        </div>
      </div>

      {deleteCandidate ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-2xl shadow-black/40">
            <h3 className="mb-2 text-lg font-semibold text-slate-100">Delete document</h3>
            <p className="mb-1 text-sm text-slate-400">This action cannot be undone.</p>
            <p className="mb-5 text-sm font-medium text-slate-300">{deleteCandidate.title}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="rounded px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteCandidate.id)}
                className="rounded bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-rose-300"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
