import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../firebase";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isLoggingIn: false,
    showPassword: false,
    error: "",
  });

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const { username, password } = formData;

    setFormData((prev) => ({ ...prev, isLoggingIn: true, error: "" }));

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
    }

    try {
      const response = await UserLogin(usernameTrimmed, passwordTrimmed);

      if (response.success) {
        // Save ONE unified object in localStorage
        const authObject = {
          userId: response.user.id,
          role: response.user.role,
          timestamp: Date.now(),
        };

        localStorage.setItem("auth", JSON.stringify(authObject));

        setFormData((prev) => ({ ...prev, isLoggingIn: false }));
        navigate("/", { replace: true });
      } else {
        setFormData((prev) => ({
          ...prev,
          error: response.message || "Invalid credentials",
          isLoggingIn: false,
        }));
      }
    } catch {
      setFormData((prev) => ({
        ...prev,
        error: "Network error. Please try again.",
        isLoggingIn: false,
      }));
    }
  }

  function validateCredentials(username, password) {
    if (!username || !password) {
      return { valid: false, message: "Username and password are required" };
    }
    if (username.length < 3 || username.length > 20) {
      return { valid: false, message: "Username must be 3-20 characters" };
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

          {/* Error message */}
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
            <input
              id="username"
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
              className="w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-gray-50 text-sm"
            />

            <input
              id="password"
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
              className="w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-gray-50 text-sm"
            />

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
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">
                Show password
              </label>
            </div>

            <button
              type="submit"
              disabled={formData.isLoggingIn}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg"
            >
              {formData.isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
