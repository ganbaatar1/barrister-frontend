import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import useDecodedTexts from "../utils/useDecodedText";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";
const STATIC_URL =
  process.env.REACT_APP_STATIC_URL; 
function Lawyers() {
  const [rawLawyers, setRawLawyers] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/lawyers`)
      .then((res) => {
        console.log("✅ Хуульчдын API хариу:", res.data);
        setRawLawyers(res.data || []);
      })
      .catch((err) => console.error("❌ Хуульчид татахад алдаа:", err));
  }, []);

  const lawyers = useDecodedTexts(rawLawyers);
//const lawyers = rawLawyers; // түр хасав
  return (
    <>
      <Helmet>
        <title>Хуульчид | Barrister.mn</title>
        <meta
          name="description"
          content="Монголын хуульчдын мэдээлэл, мэргэшил, хэлний чадвар болон ажлын туршлагыг үзнэ үү."
        />
        <meta
          name="keywords"
          content="хуульч, өмгөөлөгч, law, barrister.mn, хууль зүйн үйлчилгээ"
        />
        <link rel="canonical" href="https://barrister.mn/lawyers" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Хуульчид</h1>

        {lawyers.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Хуульчид олдсонгүй.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lawyers.map((l) => (
              <div
                key={l._id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow-md flex flex-col sm:flex-row items-center"
              >
                <img
                  src={
                    l.profilePhoto
                      ? l.profilePhoto.startsWith("http")
                        ? l.profilePhoto
                        : `${STATIC_URL}${l.profilePhoto}`
                      : "/default-profile.png"
                  }
                  alt={`${l.firstName || ""} ${l.lastName || ""}`}
                  className="w-32 h-40 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
                />
                <div className="flex-1 space-y-1">
                  <h2 className="text-xl font-semibold">
                    {l.lastName || ""} {l.firstName || ""}
                  </h2>
                  <p className="text-sm text-gray-500">{l.academicDegree || "—"}</p>
                  <p>
                    <strong>Мэргэшил:</strong>{" "}
                    {Array.isArray(l.specialization) && l.specialization.length
                      ? l.specialization.join(", ")
                      : "—"}
                  </p>
                  <p>
                    <strong>Хэлний чадвар:</strong>{" "}
                    {Array.isArray(l.languages) && l.languages.length
                      ? l.languages.join(", ")
                      : "—"}
                  </p>
                  <p>
                    <strong>Туршлага:</strong> {l.experience || "—"}
                  </p>
                  <p>
                    <strong>Статус:</strong> {l.status || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Lawyers;
