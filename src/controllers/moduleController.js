import moduleRepository from '../repositories/moduleRepository.js';
import { sendError, sendSuccess } from '../utils/responseFormatter.js';
import { buildModulePayload } from '../utils/adminPayloads.js';

export const getAllModules = async (req, res, next) => {
  try {
    const modules = await moduleRepository.list();
    return sendSuccess(res, 'Modules fetched', modules);
  } catch (error) {
    next(error);
  }
};

export const getModuleById = async (req, res, next) => {
  try {
    const module = await moduleRepository.findById(req.params.id);
    if (!module) {
      return sendError(res, 'Module not found', [], 404);
    }
    return sendSuccess(res, 'Module fetched', module);
  } catch (error) {
    next(error);
  }
};

export const createModule = async (req, res, next) => {
  try {
    const payload = buildModulePayload({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      sectionInputs: req.body.sections || req.body.sectionInputs || [],
    });

    const module = await moduleRepository.create({ ...payload, createdBy: req.user._id });
    return sendSuccess(res, 'Module created', module, 201);
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const module = await moduleRepository.updateById(req.params.id, req.body);
    if (!module) {
      return sendError(res, 'Module not found', [], 404);
    }
    return sendSuccess(res, 'Module updated', module);
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const module = await moduleRepository.deleteById(req.params.id);
    if (!module) {
      return sendError(res, 'Module not found', [], 404);
    }
    return sendSuccess(res, 'Module deleted', {});
  } catch (error) {
    next(error);
  }
};
