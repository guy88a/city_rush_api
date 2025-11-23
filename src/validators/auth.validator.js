module.exports.validateRegister = function (data) {
  const { username, email, password } = data;

  if (!username) return { ok: false, message: 'Username is required' };
  if (!email) return { ok: false, message: 'Email is required' };
  if (!password) return { ok: false, message: 'Password is required' };

  return { ok: true };
};

module.exports.validateLogin = function (data) {
  const { username, email, password } = data;

  if (!password) return { ok: false, message: 'Password is required' };
  if (!username && !email) return { ok: false, message: 'Username or email is required' };

  return { ok: true };
};