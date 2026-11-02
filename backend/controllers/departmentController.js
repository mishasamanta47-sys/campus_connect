const departmentModel = require("../models/departmentModel");

const normalizeDepartment = (department = {}) => {
  const name = department.name ?? department.department_name ?? department.departmentName;
  const code = department.code ?? department.department_code ?? department.departmentCode;
  const description = department.description ?? null;

  return {
    ...department,
    id: department.id,
    name,
    code,
    description,
    department_name: name,
    department_code: code,
  };
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentModel.getAllDepartments();
    return res.status(200).json({
      success: true,
      departments: departments.map(normalizeDepartment),
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getDepartmentById = async (req, res) => {
  const departmentId = req.params.id;

  try {
    const department = await departmentModel.findDepartmentById(departmentId);

    if (!department || department.length === 0) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department: normalizeDepartment(department[0]) });
  } catch (error) {
    console.error("Error fetching department:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const createDepartment = async (req, res) => {
  const { department_name, department_code, name, code, description } = req.body;
  const departmentName = department_name ?? name;
  const departmentCode = department_code ?? code;

  if (!departmentName || !departmentCode) {
    return res.status(400).json({
      success: false,
      message: "Department name and department code are required.",
    });
  }

  try {
    const existing = await departmentModel.findDepartmentByName(departmentName);
    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Department with this name already exists.",
      });
    }

    const existingCode = await departmentModel.findDepartmentByCode(departmentCode);
    if (existingCode && existingCode.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Department with this code already exists.",
      });
    }

    const newDepartment = await departmentModel.createDepartment({
      name: departmentName,
      code: departmentCode,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department: {
        id: newDepartment.insertId,
        name: departmentName,
        code: departmentCode,
        description: description ?? null,
        department_name: departmentName,
        department_code: departmentCode,
      },
    });
  } catch (error) {
    console.error("Error creating department:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Department name or code already exists.",
      });
    }
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const updateDepartment = async (req, res) => {
  const departmentId = req.params.id;
  const { department_name, department_code, name, code, description } = req.body;
  const departmentName = department_name ?? name;
  const departmentCode = department_code ?? code;

  if (!departmentName || !departmentCode) {
    return res.status(400).json({
      success: false,
      message: "Department name and department code are required.",
    });
  }

  try {
    const result = await departmentModel.updateDepartment(departmentId, {
      name: departmentName,
      code: departmentCode,
      description,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department: {
        id: departmentId,
        name: departmentName,
        code: departmentCode,
        description: description ?? null,
        department_name: departmentName,
        department_code: departmentCode,
      },
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const result = await departmentModel.deleteDepartment(departmentId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
