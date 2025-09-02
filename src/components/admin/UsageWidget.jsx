import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const MB = 1024 * 1024;
const GB = 1024 * MB;

const fmtBytes = (n) => {
  if (n == null) return "—";
  if (n >= GB) return (n / GB).toFixed(2) + " GB";
  if (n >= MB) return (n / MB).toFixed(2) + " MB";
  return n + " B";
};
const pct = (used, limit) => {
  if (!limit || limit <= 0) return null;
  return Math.min(100, Math.max(0, Math.round((used / limit) * 100)));
};

export default function UsageWidget() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  // Atlas free limit-г тохируулж болдог: REACT_APP_ATLAS_FREE_LIMIT_MB (default: 512MB)
  const atlasFreeLimitMB = Number(process.env.REACT_APP_ATLAS_FREE_LIMIT_MB || 512);
  const atlasFreeLimitBytes = atlasFreeLimitMB * MB;

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/status/usage");
        setData(res.data);
        setErr(null);
      } catch (e) {
        setErr(e?.response?.data?.error || e.message || "Failed to load usage");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const atlas = data?.atlas;
  const cld = data?.cloudinary;

  const atlasUsedBytes = useMemo(() => {
    // storageSizeBytes нь физик эзлэхүүн, dataSizeBytes нь өгөгдлийн хэмжээ
    // Энд “илүү болгоомжтой” гэж storageSize-г харуулъя
    const used = Number(atlas?.storageSizeBytes || atlas?.dataSizeBytes || 0);
    return used;
  }, [atlas]);

  const atlasPct = pct(atlasUsedBytes, atlasFreeLimitBytes);

  // Cloudinary storage
  const cldUsage = Number(
    cld?.storage?.usage_bytes ??
      cld?.raw?.storage?.usage?.bytes ??
      cld?.raw?.storage?.usage ??
      0
  );
  const cldLimit = cld?.storage?.limit_bytes ??
                   cld?.raw?.storage?.limit?.bytes ??
                   cld?.raw?.storage?.limit ?? null;
  const cldPct = pct(cldUsage, cldLimit);

  const warnAtlas = atlasPct != null && atlasPct >= 80;
  const warnCld = cldPct != null && cldPct >= 80;

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Серверийн хэрэглээ (Atlas & Cloudinary)</h3>
          {loading && <span className="text-xs text-gray-500">Ачаалж байна…</span>}
        </div>

        {err && (
          <div className="text-red-600 text-sm mb-3">⚠️ {err}</div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Atlas card */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="font-medium">MongoDB Atlas</div>
              <div className="text-xs text-gray-500">
                DB: {atlas?.db || "—"}
              </div>
            </div>

            <div className="mt-2 text-sm">
              <div>Collections: <b>{atlas?.collections ?? "—"}</b></div>
              <div>Documents: <b>{atlas?.objects ?? "—"}</b></div>
              <div>Data Size: <b>{fmtBytes(atlas?.dataSizeBytes)}</b></div>
              <div>Storage Size: <b>{fmtBytes(atlas?.storageSizeBytes)}</b></div>
              <div>Index Size: <b>{fmtBytes(atlas?.indexSizeBytes)}</b></div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Free tier limit (config): {atlasFreeLimitMB} MB</span>
                <span>{atlasPct != null ? `${atlasPct}%` : "—"}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded mt-1 overflow-hidden">
                <div
                  className={`h-full ${warnAtlas ? "bg-red-500" : "bg-green-500"}`}
                  style={{
                    width: `${atlasPct != null ? atlasPct : 0}%`,
                  }}
                />
              </div>
            </div>

            {warnAtlas && (
              <div className="mt-3 text-xs text-red-600">
                ⚠️ Atlas free багтаамж дөхөж байна! Хуучирсан эсвэл хэрэггүй бичлэгүүдийг устгахыг зөвлөе.
              </div>
            )}
          </div>

          {/* Cloudinary card */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <div className="font-medium">Cloudinary</div>

            <div className="mt-2 text-sm">
              <div>Storage: <b>{fmtBytes(cldUsage)}</b>{cldLimit ? <> / <b>{fmtBytes(cldLimit)}</b></> : null}</div>
              {/* Хэрэв credits, bandwidth зэрэг ирсэн бол түүнүүдийг бас харуулъя */}
              {cld?.credits?.usage != null && (
                <div>Credits Used: <b>{cld.credits.usage}</b>{cld.credits.limit != null ? <> / <b>{cld.credits.limit}</b></> : null}</div>
              )}
              {cld?.bandwidth?.usage_bytes != null && (
                <div>Bandwidth: <b>{fmtBytes(cld.bandwidth.usage_bytes)}</b>{cld.bandwidth.limit_bytes ? <> / <b>{fmtBytes(cld.bandwidth.limit_bytes)}</b></> : null}</div>
              )}
              {cld?.requests?.usage != null && (
                <div>Requests: <b>{cld.requests.usage}</b>{cld.requests.limit != null ? <> / <b>{cld.requests.limit}</b></> : null}</div>
              )}
              {cld?.transformations?.usage != null && (
                <div>Transformations: <b>{cld.transformations.usage}</b>{cld.transformations.limit != null ? <> / <b>{cld.transformations.limit}</b></> : null}</div>
              )}
            </div>

            {cldLimit && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Storage limit</span>
                  <span>{cldPct != null ? `${cldPct}%` : "—"}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded mt-1 overflow-hidden">
                  <div
                    className={`h-full ${warnCld ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${cldPct != null ? cldPct : 0}%` }}
                  />
                </div>
              </div>
            )}

            {warnCld && (
              <div className="mt-3 text-xs text-red-600">
                ⚠️ Cloudinary storage/credits дөхөж байна! Хэрэггүй зургуудыг устгахыг зөвлөе.
              </div>
            )}
          </div>
        </div>

        {/* Тусламж/сануулга: хурдан цэвэрлэх товчлуурууд */}
        {(warnAtlas || warnCld) && (
          <div className="mt-4 text-sm bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-3">
            <div className="font-medium mb-1">Цэвэрлэгээний зөвлөмж:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Нүүрийн слайдерт хуучирсан зургуудыг <b>Нүүр хуудас</b> табаас устгах</li>
              <li>Хуучин <b>Мэдээ</b>/<b>Сэтгэгдэл</b>-ийн зураг, хавсралтуудыг цэгцлэх</li>
              <li>Дахин хэрэглэхгүй болон тест зорилгоор үүсгэсэн бичлэгүүдийг устгах</li>
            </ul>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href="#/admin" onClick={(e) => e.preventDefault()} className="hidden" />
              <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('button:has(> span[data-tab="home"])')?.click(); }} className="px-3 py-1 rounded bg-white border text-sm">Нүүр хуудас</a>
              <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('button:has(> span[data-tab="news"])')?.click(); }} className="px-3 py-1 rounded bg-white border text-sm">Мэдээ</a>
              <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('button:has(> span[data-tab="testimonials"])')?.click(); }} className="px-3 py-1 rounded bg-white border text-sm">Сэтгэгдэл</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
