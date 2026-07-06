export const buildModulePayload = ({ title, description, status, sectionInputs = [] }) => {
  const sections = (sectionInputs || [])
    .filter((section) => section?.content?.trim())
    .map((section, index) => ({
      title: section?.title?.trim() || `Section ${index + 1}`,
      content: section.content.trim(),
    }));

  return {
    title: title?.trim(),
    description: description?.trim(),
    sections,
    isActive: status === 'active',
  };
};

export const normalizeQuizQuestions = (questions = []) =>
  questions
    .filter((question) => question?.questionText?.trim())
    .map((question, index) => ({
      questionNumber: index + 1,
      questionText: question.questionText.trim(),
      options: (question.options || []).map((option) => option?.trim()).filter(Boolean),
      correctAnswerIndex: Number(question.correctAnswerIndex ?? 0),
      explanation: question.explanation?.trim() || '',
    }));
