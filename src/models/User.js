import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES, USER_GROUPS, USER_STATUSES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    age: { type: Number, min: 16 },
    gender: { type: String },
    deviceType: { type: String },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.STUDENT },
    group: { type: String, enum: [USER_GROUPS.CONTROL, USER_GROUPS.EXPERIMENTAL, null], default: null },
    status: { type: String, enum: Object.values(USER_STATUSES), default: USER_STATUSES.ACTIVE },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
