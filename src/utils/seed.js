import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { USER_ROLES, USER_GROUPS } from '../config/constants.js';
import User from '../models/User.js';
import Module from '../models/Module.js';
import QuizQuestion from '../models/QuizQuestion.js';
import Result from '../models/Result.js';
import NasaTlx from '../models/NasaTlx.js';
import SessionLog from '../models/SessionLog.js';

const delayHours = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

const seed = async () => {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Module.deleteMany({}),
    QuizQuestion.deleteMany({}),
    Result.deleteMany({}),
    NasaTlx.deleteMany({}),
    SessionLog.deleteMany({}),
  ]);

  const admin = await User.create({
    fullName: 'Dr. Ada Rivera',
    email: 'admin@focuslearn.com',
    password: 'Admin123!',
    role: USER_ROLES.ADMIN,
    status: 'active',
  });

  const studentDocs = [];
  for (let index = 0; index < 10; index += 1) {
    const group = index < 5 ? USER_GROUPS.CONTROL : USER_GROUPS.EXPERIMENTAL;
    studentDocs.push({
      fullName: `Student ${index + 1}`,
      email: `student${index + 1}@focuslearn.com`,
      password: 'Student123!',
      age: 20 + index,
      gender: index % 2 === 0 ? 'Female' : 'Male',
      deviceType: index % 2 === 0 ? 'Mobile' : 'Desktop',
      role: USER_ROLES.STUDENT,
      group,
      status: 'active',
    });
  }

  const students = await User.insertMany(studentDocs);
  await User.create({
    fullName: 'Unassigned Learner',
    email: 'unassigned@focuslearn.com',
    password: 'Student123!',
    role: USER_ROLES.STUDENT,
    group: null,
    status: 'active',
  });

  const module = await Module.create({
    title: 'Photosynthesis',
    description: 'A minimalist lesson exploring how plants convert light into energy.',
    createdBy: admin._id,
    sections: [
      { title: 'What is Photosynthesis?', content: 'Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.' },
      { title: 'The Role of Chlorophyll', content: 'Chlorophyll absorbs light energy and powers the process.' },
      { title: 'Stages of the Process', content: 'Light-dependent reactions and the Calvin cycle work together.' },
      { title: 'Why It Matters', content: 'Photosynthesis supports ecosystems and oxygen production.' },
      { title: 'Research Reflection', content: 'Minimal interfaces can help learners focus on core concepts.' },
    ],
    isActive: true,
  });

  const questions = Array.from({ length: 10 }, (_, index) => ({
    moduleId: module._id,
    quizType: 'immediate',
    questionNumber: index + 1,
    questionText: `Biology question ${index + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswerIndex: (index + 1) % 4,
    explanation: 'This is a seeded explanation for the quiz item.',
  }));
  await QuizQuestion.insertMany(questions);

  const immediateCompletedAt = delayHours(48);
  const delayedCompletedAt = delayHours(60);

  for (const [index, student] of students.entries()) {
    const isControl = student.group === USER_GROUPS.CONTROL;
    const immediateScore = isControl ? 82 : 88;
    const delayedScore = isControl ? 58 : 76;
    const immediatePercentage = immediateScore;
    const delayedPercentage = delayedScore;
    await Result.create({
      userId: student._id,
      moduleId: module._id,
      testType: 'immediate',
      score: immediateScore,
      percentage: immediatePercentage,
      answersSubmitted: [{ q1: 'A' }],
      timeSpent: 320 + Math.floor(index / 2),
      completedAt: immediateCompletedAt,
      groupAssignment: student.group,
    });

    await Result.create({
      userId: student._id,
      moduleId: module._id,
      testType: 'delayed',
      score: delayedScore,
      percentage: delayedPercentage,
      answersSubmitted: [{ q1: 'A' }],
      timeSpent: 310 + Math.floor(index / 2),
      completedAt: delayedCompletedAt,
      groupAssignment: student.group,
    });

    const nasaScore = isControl ? 70 : 43;
    await NasaTlx.create({
      userId: student._id,
      moduleId: module._id,
      mentalDemand: 12,
      physicalDemand: 8,
      temporalDemand: 10,
      performance: 14,
      effort: 11,
      frustration: 15,
      compositeScore: nasaScore,
      submittedAt: delayedCompletedAt,
      groupAssignment: student.group,
    });

    const logCount = 8 + (student.email.length % 8);
    const logs = Array.from({ length: logCount }, (_, logIndex) => ({
      userId: student._id,
      moduleId: module._id,
      sessionId: `session-${student._id.toString()}-${logIndex}`,
      eventType: logIndex % 2 === 0 ? 'page_view' : 'quiz_submit',
      eventDetail: `Seeded event ${logIndex + 1}`,
      pageURL: '/lesson/photosynthesis',
      timestamp: new Date(Date.now() - logIndex * 15 * 60 * 1000),
      duration: 30 + logIndex,
    }));
    await SessionLog.insertMany(logs);
  }

  console.log('Seed data created successfully.');
  await disconnectDatabase();
};

seed().catch(async (error) => {
  console.error('Seeding failed:', error);
  await disconnectDatabase();
  process.exit(1);
});
