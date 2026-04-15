import { Schema, model } from "mongoose";

const profileSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true, lowercase: true },
  gender: { type: String, lowercase: true },
  gender_probability: Number,
  sample_size: Number,
  age: Number,
  age_group: { type: String, lowercase: true },
  country_id: { type: String, uppercase: true },
  country_probability: Number,
  created_at: { type: Date, default: Date.now }
});

const profileModel = model("Profiles", profileSchema);

export default profileModel;