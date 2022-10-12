/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const getTasks = async (req, res) => {
  try {
    let listTasks = await Tasks.find();
    res.status(200).json({ data: listTasks, msg: "Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  getTasks,
};
