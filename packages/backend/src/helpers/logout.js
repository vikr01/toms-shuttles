// @flow
import User from '../entity/User';

const logout = async ({ connection, username }): boolean => {
  let user;
  try {
    user = await connection.getRepository(User).findOne({ username });
  } catch (err) {
    throw new Error('Server error. Please try again later.');
  }
  if (user) {
    user.loggedIn = 0;
    console.log(user);
    try {
      await connection.getRepository(User).save(user);
      return true;
    } catch (err) {
      throw new Error('Server error. Please try again later.');
    }
  }
  return false;
};

export default logout;
