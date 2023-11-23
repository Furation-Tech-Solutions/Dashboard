const db = require("../model");
const permissionArray = require("../permissionArray.json");
// create Main Model
const Role = db.roles;

// get role
const getRole = async (req, res) => {
  try {
    let roles = await Role.findAll();
    // Convert permissions from string to array of objects
    roles = roles.map((role) => ({
      ...role.toJSON(),
      permissions: JSON.parse(role.permissions),
    }));
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", error });
  }
};

// get all permission code
const getAllpermission = (req, res) => {
  try {
    if (permissionArray) {
      res.status(200).send(permissionArray);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const addRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    // Check if the role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ error: "Role already exists." });
    }
    // Create the role with the provided name and permissions
    const newRole = await Role.create({
      name,
      permissions,
    });
    return res.status(201).send(newRole);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getRole,
  getAllpermission,
  addRole,
};
