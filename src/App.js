// 📁 src/App.jsx  (frontend)
import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage, lazyload, placeholder, responsive } from "@cloudinary/react";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";

// ENV-ээс cloud name авъя (та REACT_APP_CLOUDINARY_CLOUD_NAME тохируулсан)
const cld = new Cloudinary({
  cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "djam1etvx" },
});

export default function App() {
  // ⚠️ ЭНД public_id оруулна: жишээ нь upload-ын хариунд ирсэн "barrister/your_image_123"
  const PUBLIC_ID = "barrister/your_image_123";

  const img = cld
    .image(PUBLIC_ID)
    .resize(fill().width(500).height(500).gravity(autoGravity()))
    .delivery(format("auto"))
    .delivery(quality("auto"));

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <AdvancedImage
        cldImg={img}
        alt="banner"
        plugins={[lazyload(), responsive(), placeholder({ mode: "blur" })]}
        style={{ width: "100%", height: "auto", borderRadius: 12 }}
      />
    </div>
  );
}
    