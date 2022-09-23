const bcrypt = require("bcryptjs");

const createAccount = async (req, res) => {
  try {
    const { username, name, password, email } = req.body;

    if (username && name && password && email) {
      const usernameOld = await Users.findOne({where: {username: username},});
      const emailOld = await Users.findOne({
        where: {
          email: email,
        },
      });
      // check username
      if (usernameOld) {
        res.status(406).json({
          msg: "Username was available",
        });
      } else {
        //check email
        if (emailOld) {
          return res.status(406).json({msg: "Email was available",});
        } else {
          //encode password by bcrypt
          let encryptedPassword = await bcrypt.hash(password, 10);
          await Users.create({
            username: username,
            name: name,
            password: encryptedPassword,
            email: email,
            status: 1,
          });
          //get id_user just created
          let user = await Users.findOne({ username: username });
          return res.status(201).json({ msg: "Created user!...",user });
        }
      }
    } else {
      return res.status(500).json({ msg: "You must enter all information!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

module.exports = {
  createAccount,
};
