// src/components/admin/UsersAdmin.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { UserPlus, Trash2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

/**
 * ⚠️ Backend шаардлага:
 *  GET    /admin/users
 *  POST   /admin/users                → { email, password, displayName }
 *  DELETE /admin/users/:uid
 * (Firebase Admin SDK ашиглана.)
 */
export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast.error("Хэрэглэгчид татахад алдаа гарлаа");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/users", form);
      toast.success("Хэрэглэгч нэмэгдлээ");
      setForm({ email: "", password: "", displayName: "" });
      load();
    } catch (e) {
      toast.error("Нэмэхэд алдаа гарлаа");
      console.error(e);
    }
  };

  const remove = async (uid) => {
    if (!window.confirm("Энэ хэрэглэгчийг устгах уу?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${uid}`);
      toast.success("Устгагдлаа");
      load();
    } catch (e) {
      toast.error("Устгах үед алдаа гарлаа");
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Хэрэглэгч удирдах</h2>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Шинэчлэх
        </button>
      </div>

      <form
        onSubmit={addUser}
        className="grid md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded"
      >
        <input
          required
          type="email"
          placeholder="Имэйл"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          required
          type="password"
          placeholder="Нууц үг"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Нэр"
          value={form.displayName}
          onChange={(e) =>
            setForm({ ...form, displayName: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded px-4 py-2"
        >
          <UserPlus className="w-4 h-4" />
          Нэмэх
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u.uid}
            className="border rounded p-4 bg-white flex flex-col gap-1"
          >
            <div className="font-semibold line-clamp-1">
              {u.displayName || "No name"}
            </div>
            <div className="text-sm text-gray-600 line-clamp-1">
              {u.email}
            </div>
            <div className="text-xs text-gray-500">UID: {u.uid}</div>
            <button
              onClick={() => remove(u.uid)}
              className="mt-2 inline-flex items-center gap-2 text-red-600 hover:underline"
            >
              <Trash2 className="w-4 h-4" />
              Устгах
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
