import User from '../models/User.js';

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email }).lean();
  }

  async findById(id) {
    return User.findById(id).lean();
  }

  async create(data) {
    const user = await User.create(data);
    return user.toObject();
  }

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async list({ role, group, status } = {}) {
    const filter = {};
    if (role) filter.role = role;
    if (group) filter.group = group;
    if (status) filter.status = status;
    return User.find(filter).sort({ createdAt: -1 }).lean();
  }
}

export default new UserRepository();
