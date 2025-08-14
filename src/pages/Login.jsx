import { useState } from "react";
import {UserLogin} from "../firebase";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isLoggingIn: false,
    showPassword: false,
    error: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    const { username, password } = formData;

    setFormData((prev) => ({ ...prev, isLoggingIn: true }));

    const usernameTrimmed = username.trim();
    const passwordTrimmed = password.trim();

    const isValid = validateCredentials(usernameTrimmed, passwordTrimmed);

    if (!isValid.valid) {
      setFormData((prev) => ({
        ...prev,
        error: isValid.message,
        isLoggingIn: false,
      }));
      return;
    } else {
      const response = await UserLogin(usernameTrimmed);
      console.log(response);
      setFormData((prev) => ({ ...prev, isLoggingIn: false }));
    }
  }

  function validateCredentials(username, password) {
    if (!username || !password) {
      return { valid: false, message: "Username and password are required" };
    }

    if (username.length < 5 || username.length > 20) {
      return { valid: false, message: "Username must be 5–20 characters long" };
    }

    if (password.length < 6) {
      return {
        valid: false,
        message: "Password must be at least 6 characters",
      };
    }

    return { valid: true, message: "" };
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <div className="px-6 pt-6 pb-6 border border-gray-400 rounded-lg shadow-sm bg-white">
          <div className="text-center mb-5">
            <h1 className="text-lg font-semibold text-gray-900 mb-1">Login</h1>
            <p className="text-gray-500 text-xs">Access your account</p>
          </div>

          {/* Smooth error transition */}
          <div
            aria-live="polite"
            className={`transition-all duration-500 ease-in-out overflow-hidden mb-4 ${
              formData.error ? "max-h-20 opacity-100" : "max-h-0 opacity-0 mb-0"
            }`}
          >
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <p className="text-red-700 text-xs text-center">
                {formData.error}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                minLength={5}
                maxLength={20}
                autoComplete="username"
                value={formData.username}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: event.target.value,
                    error: "",
                  }))
                }
                type="text"
                placeholder="Username"
                disabled={formData.isLoggingIn}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-gray-50 text-gray-950 text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                minLength={6}
                autoComplete="current-password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                    error: "",
                  }))
                }
                type={formData.showPassword ? "text" : "password"}
                placeholder="Password"
                disabled={formData.isLoggingIn}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-gray-50 text-gray-950 text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="showPassword"
                checked={formData.showPassword}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                disabled={formData.isLoggingIn}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">
                Show password
              </label>
            </div>

            <button
              type="submit"
              disabled={formData.isLoggingIn}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 mt-6"
            >
              {formData.isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
