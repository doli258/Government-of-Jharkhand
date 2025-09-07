const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://127.0.0.1:27017/sih", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmins() {
  try {
    const admins = [
      { username: "sanitation_admin", password: "sanitation123", department: "Sanitation" },
      { username: "roads_admin", password: "roads123", department: "Roads" },
      { username: "electricity_admin", password: "electricity123", department: "Electricity" },
      { username: "water_admin", password: "water123", department: "Water" },
    ];

    for (const adminData of admins) {
      const existing = await Admin.findOne({ username: adminData.username });
      if (existing) {
        console.log(`⚠️ Admin already exists: ${adminData.username}`);
        continue;
      }

      const admin = new Admin(adminData);
      await admin.save();
      console.log(`✅ Created admin: ${admin.username} (${admin.department})`);
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("Error creating admins:", err);
    mongoose.disconnect();
  }
}

createAdmins();
