import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import defaultImg from "../../assets/default-profile.png";

const API_BASE = "/lawyers";

function LawyersAdmin() {
  const [lawyers, setLawyers] = useState([]);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    specialization: "",
    languages: "",
    academicDegree: "",
    experience: "",
    startDate: "",
    status: "ажиллаж байгаа",
    profilePhoto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setLawyers(res.data);
    } catch (err) {
      toast.error("Хуульчдын мэдээллийг татаж чадсангүй");
    }
  };

  const resetForm = () => {
    setFormData({
      lastName: "",
      firstName: "",
      specialization: "",
      languages: "",
      academicDegree: "",
      experience: "",
      startDate: "",
      status: "ажиллаж байгаа",
      profilePhoto: null,
    });
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      const file = files[0];
      setFormData({ ...formData, profilePhoto: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("lastName", formData.lastName);
      payload.append("firstName", formData.firstName);
      payload.append(
        "specialization",
        JSON.stringify(formData.specialization.split(",").map((s) => s.trim()))
      );
      payload.append(
        "languages",
        JSON.stringify(formData.languages.split(",").map((l) => l.trim()))
      );
      payload.append("academicDegree", formData.academicDegree);
      payload.append("experience", formData.experience);
      payload.append("startDate", formData.startDate);
      payload.append("status", formData.status);
      if (formData.profilePhoto) {
        payload.append("profilePhoto", formData.profilePhoto);
      }

      if (editingId) {
        await axiosInstance.put(`${API_BASE}/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Амжилттай засварлалаа");
      } else {
        await axiosInstance.post(API_BASE, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Амжилттай нэмэгдлээ");
      }

      fetchLawyers();
      resetForm();
    } catch (err) {
      toast.error(`Хадгалах үед алдаа гарлаа: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleEdit = (lawyer) => {
    setFormData({
      lastName: lawyer.lastName,
      firstName: lawyer.firstName,
      specialization: lawyer.specialization.join(", "),
      languages: lawyer.languages.join(", "),
      academicDegree: lawyer.academicDegree,
      experience: lawyer.experience,
      startDate: lawyer.startDate.split("T")[0],
      status: lawyer.status,
      profilePhoto: null,
    });
    setPreviewImage(
      lawyer.profilePhoto ? `http://localhost:5050${lawyer.profilePhoto}` : null
    );
    setEditingId(lawyer._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Устгах уу?")) return;
    try {
      await axiosInstance.delete(`${API_BASE}/${id}`);
      toast.success("Амжилттай устгалаа");
      fetchLawyers();
    } catch (err) {
      toast.error("Устгах үед алдаа гарлаа");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Хуульчийн мэдээлэл {editingId ? "(Засаж байна)" : ""}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Овог" required />
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Нэр" required />
        <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Мэргэшил (таслалаар)" />
        <input name="languages" value={formData.languages} onChange={handleChange} placeholder="Хэл (таслалаар)" />
        <input name="academicDegree" value={formData.academicDegree} onChange={handleChange} placeholder="Боловсролын зэрэг" />
        <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Туршлага" />
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="ажиллаж байгаа">Ажиллаж байгаа</option>
          <option value="амарч байгаа">Амарч байгаа</option>
          <option value="ажлаас гарсан">Ажлаас гарсан</option>
        </select>
        <input type="file" name="profilePhoto" accept="image/*" onChange={handleChange} />
        <img
          src={previewImage || defaultImg}
          alt="preview"
          className="w-24 h-24 object-cover rounded-full"
        />
        <div className="col-span-full flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Хадгалах</button>
          <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded">Цэвэрлэх</button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mt-6 mb-2">Бүртгэлтэй хуульчид:</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {lawyers.map((l) => (
          <div key={l._id} className="border p-4 rounded shadow">
            <img
              src={l.profilePhoto ? `http://localhost:5050${l.profilePhoto}` : defaultImg}
              alt="Профайл"
              className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
            />
            <p className="font-semibold">{l.lastName} {l.firstName}</p>
            <p>{l.academicDegree}</p>
            <p className="text-sm text-gray-500">{new Date(l.startDate).getFullYear()} оноос хойш</p>
            <div className="mt-2 flex justify-between">
              <button onClick={() => handleEdit(l)} className="text-blue-600">Засах</button>
              <button onClick={() => handleDelete(l._id)} className="text-red-600">Устгах</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LawyersAdmin;
