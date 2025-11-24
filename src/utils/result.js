module.exports.send = function (res, result) {
  if (!result.ok) {
    return res.status(result.status || 400).json({ error: result.message });
  }

  return res.status(result.status || 200).json(result.data);
};
