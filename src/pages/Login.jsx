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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔐 Firebase access token-г авах
      const token = await user.getIdToken();

      // 💾 Token-г localStorage-д хадгалах
      localStorage.setItem("accessToken", token);

      navigate("/admin");
    } catch (err) {
      console.error("❌ Нэвтрэх алдаа:", err);
      setError("Нэвтрэх мэдээлэл буруу байна.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-sm w-full space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Нэвтрэх</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Имэйл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border rounded w-full"
        />
        <button
          type="submit"
          className="bg-yellow-600 text-white w-full py-2 rounded hover:bg-yellow-700"
        >
          Нэвтрэх
        </button>
      </form>
    </div>
  );
}

export default Login;
