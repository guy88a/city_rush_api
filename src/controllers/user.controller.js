const UserService = require('../services/user.service');
const Result = require('../utils/result');

async function getMyUser(req, res) {
  const userId = req.user.id;

  const result = await UserService.getById(userId);
  return Result.send(res, result);
}

module.exports = {
  getMyUser
};