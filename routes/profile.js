import { createProfile, deleteProfile, getAllProfiles, getProfile } from "../controller/profile.js";

import express from "express";
const router = express.Router();

router.get('/profiles', createProfile);
router.get('/profiles', getAllProfiles);
router.get('/profiles/:id', getProfile);
router.delete('/profiles/:id', deleteProfile);

export default router;