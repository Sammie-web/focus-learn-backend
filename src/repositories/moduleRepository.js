import Module from '../models/Module.js';

class ModuleRepository {
  async list() {
    return Module.find().sort({ createdAt: -1 }).lean();
  }

  async findById(id) {
    return Module.findById(id).lean();
  }

  async create(data) {
    const module = await Module.create(data);
    return module.toObject();
  }

  async updateById(id, data) {
    return Module.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteById(id) {
    return Module.findByIdAndDelete(id).lean();
  }
}

export default new ModuleRepository();
