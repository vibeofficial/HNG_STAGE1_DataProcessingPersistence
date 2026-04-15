import profileModel from "../model/profile.js";
import axios from "axios";
import { v7 as uuidv7 } from "uuid";


export const createProfile = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name"
      });
    };

    const existing = await profileModel.findOne({ name: name.toLowerCase() });

    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: existing
      });
    };

    const [genderRes, ageRes, nationRes] = await Promise.all([
      axios.get(`https://api.genderize.io?name=${name}`),
      axios.get(`https://api.agify.io?name=${name}`),
      axios.get(`https://api.nationalize.io?name=${name}`)
    ]);

    if (!genderRes.data.gender || genderRes.data.count === 0) {
      return res.status(502).json({
        status: "error",
        message: "Genderize returned an invalid response"
      });
    };

    if (!ageRes.data.age) {
      return res.status(502).json({
        status: "error",
        message: "Agify returned an invalid response"
      });
    };

    if (!nationRes.data.country.length) {
      return res.status(502).json({
        status: "error",
        message: "Nationalize returned an invalid response"
      });
    };

    const age = ageRes.data.age;

    let age_group;
    if (age <= 12) age_group = "child";
    else if (age <= 19) age_group = "teenager";
    else if (age <= 59) age_group = "adult";
    else age_group = "senior";

    const country = nationRes.data.country.sort(
      (a, b) => b.probability - a.probability
    )[0];

    const profile = await profileModel.create({
      id: uuidv7(),
      name: name.toLowerCase(),
      gender: genderRes.data.gender,
      gender_probability: genderRes.data.probability,
      sample_size: genderRes.data.count,
      age,
      age_group,
      country_id: country.country_id,
      country_probability: country.probability,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      status: "success",
      data: profile
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};


export const getProfile = async (req, res) => {
  try {
    const profile = await profileModel.findOne({ id: req.params.id });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    };

    return res.json({
      status: "success",
      data: profile
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};


export const getAllProfiles = async (req, res) => {
  try {
    const { gender, country_id, age_group } = req.query;

    const filter = {};

    if (gender) filter.gender = gender.toLowerCase();
    if (country_id) filter.country_id = country_id.toUpperCase();
    if (age_group) filter.age_group = age_group.toLowerCase();

    const profiles = await profileModel.find(filter);

    return res.json({
      status: "success",
      count: profiles.length,
      data: profiles.map(data => ({
        id: data.id,
        name: data.name,
        gender: data.gender,
        age: data.age,
        age_group: data.age_group,
        country_id: data.country_id
      }))
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    const profile = await profileModel.findOneAndDelete({ id: req.params.id });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    };

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};