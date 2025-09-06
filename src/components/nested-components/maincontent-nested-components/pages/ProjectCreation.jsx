import { useNavigate } from "react-router-dom";

export default function ProjectCreation() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-full sm:max-w-lg md:max-w-2xl px-4 sm:px-8 md:px-16 py-6">
        <div className="rounded-2xl p-4 sm:p-6">
          <div className="space-y-4">
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
                placeholder="Describe your project, its goals, and key features..."
                rows={3}
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
                Add Collaborators
              </label>
              <div className="relative">
                <input
                  id="collaborators"
                  type="search"
                  placeholder="Search for team members by name or email"
                  className="w-full pl-8 pr-3 py-2 border border-gray-400 rounded-xl focus:ring-2 focus:ring-gray-600 focus:border-gray-700 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white text-sm sm:text-base"
                />
                <svg
                  className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
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
      </div>
    </div>
  );
}
