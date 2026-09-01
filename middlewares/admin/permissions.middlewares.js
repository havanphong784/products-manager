module.exports.permissions = (permissionName) => {
  return (req, res, next) => {
    if (res.locals.role && res.locals.role.permissions.includes(permissionName)) {
      next();
    } else {
      res.status(403).send("403 Forbidden");
    }
  }
}