import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useTheme } from "../contexts/ThemeContext";

function Login() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);
      navigate("/admin");
    } catch (err) {
      console.error("❌ Нэвтрэх алдаа:", err);
      setError("Нэвтрэх мэдээлэл буруу байна.");
    }
  };

  // 🧩 Давтагддаг input class-ууд (өнгө/фокус)
  const inputCls =
    "w-full px-3 py-2 rounded-md border " +
    "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " +
    "dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-300 dark:border-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent";

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Нэвтрэх</h2>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}

        <label className="block text-sm font-medium">
          Имэйл
          <input
            type="email"
            autoComplete="username"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`${inputCls} mt-1`}
          />
        </label>

        <label className="block text-sm font-medium">
          Нууц үг
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${inputCls} mt-1`}
          />
        </label>

        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white w-full py-2 rounded-md font-semibold"
        >
          Нэвтрэх
        </button>
      </form>
    </div>
  );
}

export default Login;
