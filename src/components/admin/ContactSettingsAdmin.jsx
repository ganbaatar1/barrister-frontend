import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  getContactSettings,
  updateContactSettings,
} from "../../api/contactSettings";

function ContactSettingsAdmin() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    phone: "",
    email: "",
    mapUrl: "",
    socialLinks: [],
  });

  const [newSocial, setNewSocial] = useState({ name: "", url: "" });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await getContactSettings();
      const data = res.data || {};
      setForm({
        phone: data.phone || "",
        email: data.email || "",
        mapUrl: data.mapUrl || "",
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
      });
    } catch {
      toast.error(t("admin.contact_settings.error_loading_settings"));
    }
  }, [t]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (index, field, value) => {
    const updated = [...form.socialLinks];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, socialLinks: updated }));
  };

  const addSocialLink = () => {
    if (newSocial.name.trim() && newSocial.url.trim()) {
      setForm((prev) => ({
        ...prev,
        socialLinks: [...prev.socialLinks, newSocial],
      }));
      setNewSocial({ name: "", url: "" });
    } else {
      toast.error(t("admin.contact_settings.social_link_required"));
    }
  };

  const removeSocialLink = (index) => {
    const updated = form.socialLinks.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, socialLinks: updated }));
  };

  const handleSubmit = async () => {
    try {
      await updateContactSettings(form);
      toast.success(t("admin.contact_settings.updated"));
    } catch {
      toast.error(t("admin.contact_settings.error_saving_settings"));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow space-y-6">
      <h2 className="text-xl font-bold">{t("admin.contact_settings.title")}</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder={t("admin.contact_settings.phone")}
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="email"
          placeholder={t("admin.contact_settings.email")}
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder={t("admin.contact_settings.map_url")}
          value={form.mapUrl}
          onChange={(e) => handleChange("mapUrl", e.target.value)}
          className="p-2 border rounded w-full"
        />

        <div>
          <h3 className="font-semibold">{t("admin.contact_settings.social_links")}</h3>

          <div className="space-y-2">
            {(form.socialLinks || []).map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleSocialChange(index, "name", e.target.value)}
                  placeholder={t("admin.contact_settings.platform")}
                  className="p-2 border rounded w-1/3"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                  placeholder={t("admin.contact_settings.link")}
                  className="p-2 border rounded flex-1"
                />
                <button
                  onClick={() => removeSocialLink(index)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  {t("admin.remove")}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newSocial.name}
              onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
              placeholder={t("admin.contact_settings.platform")}
              className="p-2 border rounded w-1/3"
            />
            <input
              type="text"
              value={newSocial.url}
              onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
              placeholder={t("admin.contact_settings.link")}
              className="p-2 border rounded flex-1"
            />
            <button
              onClick={addSocialLink}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {t("admin.add")}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {t("admin.save")}
        </button>
      </div>
    </div>
  );
}

export default ContactSettingsAdmin;
