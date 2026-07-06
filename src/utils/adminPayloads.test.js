import test from 'node:test';
import assert from 'node:assert/strict';
import { buildModulePayload, normalizeQuizQuestions } from './adminPayloads.js';

test('buildModulePayload converts form sections into stored lesson notes', () => {
  const payload = buildModulePayload({
    title: 'Intro to Algorithms',
    description: 'A short overview',
    status: 'active',
    sectionInputs: [
      { title: 'What is an algorithm?', content: 'An algorithm is a step-by-step plan.' },
      { title: '', content: 'A second lesson note.' },
    ],
  });

  assert.equal(payload.title, 'Intro to Algorithms');
  assert.equal(payload.description, 'A short overview');
  assert.equal(payload.isActive, true);
  assert.deepEqual(payload.sections, [
    { title: 'What is an algorithm?', content: 'An algorithm is a step-by-step plan.' },
    { title: 'Section 2', content: 'A second lesson note.' },
  ]);
});

test('normalizeQuizQuestions trims values and assigns sequential numbers', () => {
  const questions = normalizeQuizQuestions([
    {
      questionText: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswerIndex: 1,
      explanation: 'Basic arithmetic',
    },
  ]);

  assert.equal(questions[0].questionNumber, 1);
  assert.equal(questions[0].questionText, 'What is 2 + 2?');
  assert.deepEqual(questions[0].options, ['3', '4', '5', '6']);
  assert.equal(questions[0].correctAnswerIndex, 1);
});
