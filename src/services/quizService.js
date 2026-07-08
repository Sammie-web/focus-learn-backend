import quizRepository from '../repositories/quizRepository.js';
import moduleRepository from '../repositories/moduleRepository.js';
import { TEST_TYPES } from '../config/constants.js';
import { isDelayedWindowOpen } from '../utils/dateHelpers.js';

class QuizService {
  async getQuestions(moduleId, quizType, includeAnswers = false) {
    const module = await moduleRepository.findById(moduleId);
    if (!module) {
      throw Object.assign(new Error('Module not found'), { statusCode: 404 });
    }

    const questions = quizType
      ? await quizRepository.findQuestionsByModuleIdAndType(moduleId, quizType)
      : await quizRepository.findQuestionsByModuleId(moduleId);

    if (includeAnswers) {
      return questions;
    }

    return questions.map(({ correctAnswerIndex, explanation, ...question }) => question);
  }

  async submitQuiz(payload, userId) {
    const { moduleId, answers, testType = TEST_TYPES.IMMEDIATE, timeSpent = 0 } = payload;
    const module = await moduleRepository.findById(moduleId);
    if (!module) {
      throw Object.assign(new Error('Module not found'), { statusCode: 404 });
    }

    const existing = await quizRepository.findResultByUserAndModule(userId, moduleId, testType);
    if (existing) {
      throw Object.assign(new Error('Duplicate submission detected'), { statusCode: 409 });
    }

    const questions = await quizRepository.findQuestionsByModuleId(moduleId);
    let score = 0;
    const normalizedAnswers = answers.map((answer, index) => {
      const question = questions[index];
      const selectedIndex = typeof answer === 'number' ? answer : answer.selectedIndex;
      if (question && selectedIndex === question.correctAnswerIndex) {
        score += 1;
      }
      return {
        questionNumber: question?.questionNumber || index + 1,
        selectedIndex,
      };
    });

    const percentage = Number(((score / questions.length) * 100).toFixed(2));
    const result = await quizRepository.createResult({
      userId,
      moduleId,
      testType,
      score,
      percentage,
      answersSubmitted: normalizedAnswers,
      timeSpent,
      completedAt: new Date(),
      groupAssignment: null,
    });

    return result;
  }

  async getEligibility(moduleId, userId) {
    const existing = await quizRepository.findResultByUserAndModule(userId, moduleId, TEST_TYPES.IMMEDIATE);
    if (!existing) {
      return {
        eligible: false,
        message: 'Delayed assessment unavailable.',
      };
    }

    const eligible = isDelayedWindowOpen(existing.completedAt);
    return {
      eligible,
      message: eligible ? 'Delayed assessment available.' : 'Delayed assessment unavailable.',
    };
  }

  async submitNasaSurvey(payload, userId) {
    const { moduleId, mentalDemand, physicalDemand, temporalDemand, performance, effort, frustration } = payload;
    const existing = await quizRepository.findNasaSubmissionByUserAndModule(userId, moduleId);
    if (existing) {
      throw Object.assign(new Error('Duplicate NASA-TLX submission detected'), { statusCode: 409 });
    }

    const compositeScore = Number(((mentalDemand + physicalDemand + temporalDemand + performance + effort + frustration) / 6).toFixed(2));
    return quizRepository.createNasaSubmission({
      userId,
      moduleId,
      mentalDemand,
      physicalDemand,
      temporalDemand,
      performance,
      effort,
      frustration,
      compositeScore,
      submittedAt: new Date(),
      groupAssignment: null,
    });
  }
}

export default new QuizService();
