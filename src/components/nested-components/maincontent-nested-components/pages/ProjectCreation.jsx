import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../../../firebase";

export default function ProjectCreation() {
  const navigate = useNavigate();

  // State for form inputs
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [collaborators, setCollaborators] = useState("");

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert collaborators input (comma-separated) to array
    const collaboratorsArray = collaborators
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const res = await createProject({
      projectName,
      projectDescription,
      technologies,
      collaborators: collaboratorsArray,
    });

    if (res.success) {
      console.log("Project created with ID:", res.id);
      navigate("/"); // redirect after creation
    } else {
      alert("Error creating project!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full w-full flex justify-center items-center p-4 sm:p-6"
    >
      <div className="w-full max-w-full sm:max-w-lg md:max-w-2xl px-4 sm:px-8 md:px-16 py-6">
        <div className="rounded-2xl p-4 sm:p-6 space-y-4">
          {/* Project Name */}
          <div className="space-y-1">
            <label
              htmlFor="projectName"
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter your project name"
              className="w-full px-3 py-2 border border-gray-400 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-gray-700 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white text-sm sm:text-base"
              required
            />
          </div>

          {/* Project Description */}
          <div className="space-y-1">
            <label
              htmlFor="projectDescription"
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="projectDescription"
              rows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project, its goals, and key features..."
              className="w-full px-3 py-2 border border-gray-400 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-gray-700 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white resize-vertical text-sm sm:text-base"
              required
            />
          </div>

          {/* Add Collaborators */}
          <div className="space-y-1">
            <label
              htmlFor="collaborators"
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Add Collaborators (comma-separated emails)
            </label>
            <input
              id="collaborators"
              type="text"
              value={collaborators}
              onChange={(e) => setCollaborators(e.target.value)}
              placeholder="john@example.com, jane@example.com"
              className="w-full px-3 py-2 border border-gray-400 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-gray-700 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white text-sm sm:text-base"
            />
          </div>

          {/* Technologies Used */}
          <div className="space-y-1">
            <label
              htmlFor="technologies"
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Technologies Used
            </label>
            <input
              id="technologies"
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="React, Node.js, PostgreSQL, etc."
              className="w-full px-3 py-2 border border-gray-400 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-gray-700 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              onClick={() => navigate("/")}
              type="button"
              className="flex-1 px-4 py-2 text-gray-600 font-medium rounded-xl hover:bg-gray-100/50 transition-all duration-300 focus:ring-2 focus:ring-gray-400 focus:outline-none backdrop-blur-sm text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-all duration-300 focus:ring-2 focus:ring-gray-600 focus:outline-none transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Project
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
