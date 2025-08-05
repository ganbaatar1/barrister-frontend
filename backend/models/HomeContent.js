const HomeImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String }, // тайлбар
});

const HomeContentSchema = new mongoose.Schema({
  about: { type: String, required: true },
  mission: { type: String, required: true },
  vision: { type: String, required: true },
  principles: { type: String },
  services: { type: String },
  images: [HomeImageSchema], // 🆕 олон зураг хадгалах
});

module.exports = mongoose.model("HomeContent", HomeContentSchema);
