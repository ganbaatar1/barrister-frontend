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
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });

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

  useEffect(() => { load(); }, []);

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
    if (!confirm("Устгах уу?")) return;
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
        <button onClick={load} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">
          <RefreshCw className="w-4 h-4" /> Шинэчлэх
        </button>
      </div>

      <form onSubmit={addUser} className="grid md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded">
        <input required type="email" placeholder="Имэйл" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="border px-3 py-2 rounded"/>
        <input required type="password" placeholder="Нууц үг" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} className="border px-3 py-2 rounded"/>
        <input type="text" placeholder="Нэр" value={form.displayName} onChange={(e)=>setForm({...form, displayName: e.target.value})} className="border px-3 py-
