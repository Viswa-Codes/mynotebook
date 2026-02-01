import User from '../models/User';

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (userId: string) => {
  return await User.findById(userId).select('-password');
};

export const createNewUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const user = new User(userData);
  return await user.save();
};
