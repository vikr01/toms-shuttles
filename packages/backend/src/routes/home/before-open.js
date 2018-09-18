export default function(req, res, next) {
  console.log('the user is accessing the home url');

  return next();
}
