import { FolderPlus, Plus, FolderOpen, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Projects({ expanded }) {
  const [nested, showNested] = useState(false);

  return (
    <>
      <div
        onClick={() => showNested(!nested)}
        className={`hidden md:flex items-center p-3 m-2 h-10 hover:bg-gray-200 transition rounded-lg group cursor-pointer 
        ${expanded ? "justify-start" : "justify-center"}`}
        title="Projects"
        aria-label="Projects"
      >
        <FolderPlus
          className="text-gray-500 group-hover:text-black"
          size={20}
        />
        <span
          className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-300 whitespace-nowrap 
          ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
        >
          Projects
        </span>
      </div>

      {nested && (
        <div className="flex flex-col ml-4 space-y-1 animate-slideIn">
          <CreateProject expanded={expanded} />
          <MyProjects expanded={expanded} />
        </div>
      )}

      <style>{`
  @keyframes slideIn {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 200px;
    }
  }

  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`}</style>
    </>
  );
}

function CreateProject({ expanded }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/create")}
      className={`flex items-center p-2 h-8 hover:bg-gray-200 transition rounded-lg group cursor-pointer 
      ${!expanded && "hidden"}`}
    >
      <Plus className="text-gray-500 group-hover:text-black" size={16} />
      <span
        className={`ml-2 text-xs font-medium text-gray-600 transition-all duration-300 whitespace-nowrap`}
      >
        Create Project
      </span>
    </div>
  );
}

function MyProjects({ expanded }) {
  const [showProjects, setShowProjects] = useState(false);

  const dummyProjects = [
    { id: 1, name: "E-commerce App" },
    { id: 2, name: "Portfolio Site" },
    { id: 3, name: "Task Manager" },
  ];

  return (
    <>
      <div
        onClick={() => setShowProjects(!showProjects)}
        className={`flex items-center p-2 h-8 hover:bg-gray-200 transition rounded-lg group cursor-pointer 
        ${!expanded && "hidden"}`}
      >
        <FolderOpen
          className="text-gray-500 group-hover:text-black"
          size={16}
        />
        <span
          className={`ml-2 text-xs font-medium text-gray-600 transition-all duration-300 whitespace-nowrap 
          ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
        >
          My Projects
        </span>
      </div>

      {showProjects && (
        <div className="flex flex-col ml-4 space-y-1 animate-slideIn">
          {dummyProjects.map((project) => (
            <div
              key={project.id}
              className={`flex items-center p-2 h-7 transition rounded-md group cursor-pointer 
              hover:bg-gray-100 hover:shadow-sm ${!expanded && "hidden"}`}
            >
              <FileText
                size={14}
                className="text-gray-400 group-hover:text-blue-500 transition"
              />
              <span
                className={`ml-2 text-xs text-gray-600 transition-all duration-300 whitespace-nowrap 
                group-hover:text-black ${
                  expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {project.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
