// 📁 src/components/CloudinaryImg.jsx
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { AdvancedImage, responsive, lazyload, placeholder } from "@cloudinary/react";

const cld = new Cloudinary({
  cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "djam1etvx" },
});

export default function CloudinaryImg({ publicId, w = 800, h = 450, alt = "" }) {
  if (!publicId) return null;
  const img = cld
    .image(publicId)
    .resize(fill().width(w).height(h).gravity(autoGravity()))
    .delivery(format("auto"))
    .delivery(quality("auto"));

  return (
    <AdvancedImage
      cldImg={img}
      alt={alt}
      plugins={[lazyload(), responsive(), placeholder({ mode: "blur" })]}
      style={{ width: "100%", height: "auto", borderRadius: 12 }}
    />
  );
}
