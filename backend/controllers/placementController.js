const placementModel = require("../models/Placement");

const allowedUploadRoles = ["admin", "faculty", "teacher"];

const normalizeText = (value, fallback = "") => {
  if (value === undefined || value === null) return fallback;
  const cleanValue = String(value).trim();
  return cleanValue || fallback;
};

const getPlacements = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    if (req.user.role === "student") {
      const placements = await placementModel.getPlacementsForDepartment(req.user.department || "");
      return res.status(200).json({ success: true, placements });
    }

    const placements = await placementModel.getAllPlacements();
    return res.status(200).json({ success: true, placements });
  } catch (error) {
    console.error("Get placements error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch placements." });
  }
};

const getStudentPlacements = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const placements = await placementModel.getPlacementsForDepartment(req.user.department || "");
    return res.status(200).json({ success: true, placements });
  } catch (error) {
    console.error("Get student placements error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch placements." });
  }
};

const createPlacement = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    if (!allowedUploadRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only admin and faculty can upload placements." });
    }

    const company = normalizeText(req.body.company, "");
    const position = normalizeText(req.body.position, "");
    const jobType = normalizeText(req.body.job_type || req.body.type || "Full Time");
    const location = normalizeText(req.body.location, "");
    const salary = normalizeText(req.body.salary, "");
    const deadline = normalizeText(req.body.deadline, "");
    const eligibility = normalizeText(req.body.eligibility, "");
    const description = normalizeText(req.body.description, "");
    const department = normalizeText(req.body.department, "All");
    const departmentId = req.body.department_id ? Number(req.body.department_id) : null;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!company || !position) {
      return res.status(400).json({ success: false, message: "Company and position are required." });
    }

    const targetDepartment =
      req.user.role === "faculty" || req.user.role === "teacher"
        ? normalizeText(req.user.department, "")
        : department;

    if ((req.user.role === "faculty" || req.user.role === "teacher") && !targetDepartment) {
      return res.status(400).json({ success: false, message: "Your department is missing from your profile." });
    }

    const result = await placementModel.createPlacement({
      company,
      position,
      job_type: jobType,
      location,
      salary,
      deadline: deadline || null,
      eligibility,
      description,
      department: targetDepartment || "All",
      department_id: departmentId,
      file_url: fileUrl,
      created_by: req.user.id,
      created_by_role: req.user.role,
    });

    const placement = await placementModel.getPlacementById(result.insertId);

    return res.status(201).json({
      success: true,
      message: "Placement uploaded successfully.",
      placement,
    });
  } catch (error) {
    console.error("Create placement error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload placement." });
  }
};

const deletePlacement = async (req, res) => {
  try {
    const placement = await placementModel.getPlacementById(req.params.id);

    if (!placement) {
      return res.status(404).json({ success: false, message: "Placement not found." });
    }

    const isOwner = Number(placement.created_by) === Number(req.user.id);
    const canDelete = req.user.role === "admin" || isOwner;

    if (!canDelete) {
      return res.status(403).json({ success: false, message: "You are not allowed to delete this placement." });
    }

    await placementModel.deletePlacementById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Placement deleted successfully.",
    });
  } catch (error) {
    console.error("Delete placement error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete placement." });
  }
};

module.exports = {
  getPlacements,
  getStudentPlacements,
  createPlacement,
  deletePlacement,
};
