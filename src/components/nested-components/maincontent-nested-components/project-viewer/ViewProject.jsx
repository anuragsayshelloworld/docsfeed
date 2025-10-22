import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import { fetchProjectById } from "../../../../firebase"; // (disabled for UI-only)

export default function ViewProject() {
  const [project, setProject] = useState(null);
  const { id } = useParams();

  const mock = useMemo(
    () => ({
      id: id || "demo-1",
      name: "DocsFeed Revamp",
      description:
        "Reorganize documentation ingestion, tagging, and search UX. Improve responsiveness, dark contrast, and mobile experience.",
      people: [
        { id: "p1", name: "Bimochan Shrestha", role: "Owner" },
        { id: "p2", name: "Anurag Acharya", role: "Engineer" },
        { id: "p3", name: "Bijaya Shrestha", role: "Design" },
      ],
      tasks: [
        {
          id: "t1",
          title: "Set up content pipeline",
          status: "In Progress",
          assignee: "Anurag Acharya",
          due: "2025-11-05",
        },
        {
          id: "t2",
          title: "Mobile nav polish",
          status: "Todo",
          assignee: "Bimochan Shrestha",
        },
        { id: "t3", title: "Improve empty states", status: "Todo" },
        {
          id: "t4",
          title: "Search result chips",
          status: "Done",
          assignee: "Bijaya Shrestha",
          due: "2025-10-10",
        },
      ],
    }),
    [id]
  );

  useEffect(() => {
    const timer = setTimeout(() => setProject(mock), 400);
    return () => clearTimeout(timer);
  }, [mock]);

  const isLoading = !project;

  const Initials = ({ name }) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-900 text-xs font-bold">
        {initials}
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const map = {
      Todo: "bg-gray-200 text-gray-900",
      "In Progress": "bg-gray-300 text-gray-900",
      Done: "bg-gray-900 text-gray-100",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${map[status]}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
        {status}
      </span>
    );
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/projects" className="hover:underline">
            Projects
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">
            {project?.name || "Loading…"}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-200">
            Edit Project
          </button>
          <button className="rounded-xl bg-gray-900 px-3 py-2 text-sm text-gray-100 hover:opacity-90">
            New Task
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-7 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {project.name}
            </h1>
            <p className="mt-2 max-w-3xl text-sm sm:text-base text-gray-600">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <span className="rounded-full bg-gray-200 px-2 py-1">
                Project • #{project.id}
              </span>
              <span className="rounded-full bg-gray-200 px-2 py-1">
                Updated just now
              </span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-5">
            <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
            <div className="flex gap-2 text-sm">
              {["All", "Todo", "In Progress", "Done"].map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full px-3 py-1 border ${
                    tab === "All"
                      ? "bg-gray-900 text-gray-100 border-gray-900"
                      : "bg-white text-gray-900 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <ul className="divide-y divide-gray-200">
            {(project?.tasks || new Array(4).fill(null)).map((t, idx) => (
              <li key={t ? t.id : idx} className="p-4 sm:p-5">
                {t ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="truncate text-sm sm:text-base font-medium text-gray-900">
                          {t.title}
                        </h3>
                        <StatusBadge status={t.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        {t.assignee && (
                          <span className="inline-flex items-center gap-2">
                            <Initials name={t.assignee} />
                            <span className="truncate">{t.assignee}</span>
                          </span>
                        )}
                        {t.due && (
                          <span className="rounded-full bg-gray-200 px-2 py-1">
                            Due {new Date(t.due).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 self-start sm:self-auto">
                      <button className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-200">
                        View
                      </button>
                      <button className="rounded-xl bg-gray-900 px-3 py-2 text-sm text-gray-100 hover:opacity-90">
                        Quick Action
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-medium text-gray-900">People</h2>
            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {project.people.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Initials name={p.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {p.name}
                        </p>
                        <p className="truncate text-xs text-gray-600">
                          {p.role}
                        </p>
                      </div>
                    </div>
                    <button className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 hover:bg-gray-200">
                      Message
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Assign Task
            </h2>
            <form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Write a concise title…"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  readOnly
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  Assignee
                </label>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  disabled
                >
                  <option>Select a person</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                    disabled
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-700">
                    Due date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                    readOnly
                  />
                </div>
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-gray-900 px-3 py-2 text-sm text-gray-100 hover:opacity-90"
              >
                Assign (disabled)
              </button>
            </form>
          </section>
        </aside>
      </div>
    </main>
  );
}
