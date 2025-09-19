const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config();

async function fixNextDose() {
  try {

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    const users = await User.find();
    for (const user of users) {
      let updated = false;

      user.progresses.forEach((p) => {
        if (!p.nextDoseAt) {
          p.nextDoseAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // set default
          updated = true;
        }
      });

      if (updated) {
        await user.save();
        console.log(`✅ Fixed user ${user.userId}`);
      }
    }

    console.log("🎉 All users checked and fixed.");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error fixing nextDose:", err);
    mongoose.disconnect();
  }
}

fixNextDose();
