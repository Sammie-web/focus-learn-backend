const baseUrl = 'http://localhost:5001';
const adminCredentials = { email: 'admin@focuslearn.com', password: 'Admin123!' };
const userEmail = `testuser+${Date.now()}@focuslearn.com`;
const userPassword = 'Student123!';

const api = async (path, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const run = async () => {
  console.log('Checking health endpoint...');
  const health = await api('/health');
  assert(health.status === 200 && health.data?.success, 'Health endpoint failed');
  console.log('Health OK');

  console.log('Registering test student...');
  const register = await api('/api/auth/register', 'POST', {
    fullName: 'Test User',
    email: userEmail,
    password: userPassword,
  });
  assert(register.status === 201 && register.data?.data?.accessToken, 'Register failed');
  console.log('Register OK');

  console.log('Logging in test student...');
  const login = await api('/api/auth/login', 'POST', {
    email: userEmail,
    password: userPassword,
  });
  assert(login.status === 200 && login.data?.data?.accessToken, 'Student login failed');
  const studentToken = login.data.data.accessToken;
  console.log('Student login OK');

  console.log('Fetching modules...');
  const modules = await api('/api/modules', 'GET', null, studentToken);
  assert(modules.status === 200 && Array.isArray(modules.data?.data), 'Fetching modules failed');
  const moduleId = modules.data.data[0]?._id;
  assert(moduleId, 'No module returned');
  console.log(`Modules OK (${modules.data.data.length} module(s))`);

  console.log('Fetching module questions...');
  const questions = await api(`/api/quiz/${moduleId}`, 'GET', null, studentToken);
  assert(questions.status === 200 && Array.isArray(questions.data?.data), 'Fetching questions failed');
  const questionSample = questions.data.data[0];
  assert(questionSample && !('correctAnswerIndex' in questionSample), 'Question exposed correct answer index');
  console.log('Quiz questions OK');

  console.log('Submitting immediate quiz...');
  const answerPayload = {
    moduleId,
    testType: 'immediate',
    timeSpent: 120,
    answers: questions.data.data.map((q) => 0),
  };
  const submitQuiz = await api('/api/quiz/submit', 'POST', answerPayload, studentToken);
  assert(submitQuiz.status === 201 && submitQuiz.data?.data?.percentage >= 0, 'Quiz submission failed');
  console.log('Quiz submission OK');

  console.log('Checking delayed eligibility...');
  const eligibility = await api(`/api/quiz/${moduleId}/eligibility`, 'GET', null, studentToken);
  assert(eligibility.status === 200 && typeof eligibility.data?.data?.eligible === 'boolean', 'Eligibility check failed');
  console.log(`Delayed eligibility status: ${eligibility.data.data.eligible}`);

  console.log('Submitting NASA-TLX survey...');
  const nasa = await api('/api/nasa-tlx', 'POST', {
    moduleId,
    mentalDemand: 8,
    physicalDemand: 4,
    temporalDemand: 5,
    performance: 7,
    effort: 6,
    frustration: 3,
  }, studentToken);
  assert(nasa.status === 201 && nasa.data?.data?.compositeScore === 5.5, 'NASA-TLX submission failed');
  console.log('NASA-TLX OK');

  console.log('Fetching immediate result...');
  const immediateResult = await api(`/api/results/immediate/${moduleId}`, 'GET', null, studentToken);
  assert(immediateResult.status === 200 && immediateResult.data?.data?.testType === 'immediate', 'Immediate result retrieval failed');
  console.log('Immediate result OK');

  console.log('Bulk logging event test...');
  const logs = await api('/api/logs', 'POST', [
    { sessionId: 'session-test-1', eventType: 'page_view', eventDetail: 'Test view', pageURL: '/test', timestamp: new Date().toISOString(), duration: 12 },
  ], studentToken);
  console.log('Bulk logs response', JSON.stringify(logs, null, 2));
  assert(logs.status === 201 && Array.isArray(logs.data?.data), 'Bulk logging failed');
  console.log('Bulk logging OK');

  console.log('Admin login...');
  const adminLogin = await api('/api/auth/admin/login', 'POST', adminCredentials);
  assert(adminLogin.status === 200 && adminLogin.data?.data?.accessToken, 'Admin login failed');
  const adminToken = adminLogin.data.data.accessToken;
  console.log('Admin login OK');

  console.log('Fetching admin dashboard...');
  const dashboard = await api('/api/admin/dashboard', 'GET', null, adminToken);
  assert(dashboard.status === 200 && dashboard.data?.data?.userCount >= 1, 'Admin dashboard failed');
  console.log('Admin dashboard OK');

  console.log('Fetching participants...');
  const participants = await api('/api/admin/participants', 'GET', null, adminToken);
  assert(participants.status === 200 && Array.isArray(participants.data?.data), 'Admin participants failed');
  console.log(`Admin participants OK (${participants.data.data.length} students)`);

  console.log('Fetching analytics...');
  const analytics = await api('/api/admin/analytics', 'GET', null, adminToken);
  assert(analytics.status === 200 && typeof analytics.data?.data?.averageNasaScore === 'number', 'Admin analytics failed');
  console.log('Admin analytics OK');

  console.log('Fetching admin results...');
  const adminResults = await api('/api/admin/results', 'GET', null, adminToken);
  assert(adminResults.status === 200 && Array.isArray(adminResults.data?.data), 'Admin results failed');
  console.log('Admin results OK');

  console.log('Fetching CSV export...');
  const exportCsv = await fetch(`${baseUrl}/api/admin/export`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(exportCsv.status === 200, 'CSV export failed');
  const csvText = await exportCsv.text();
  assert(csvText.includes('id,user,email,module,testType,score,percentage,completedAt'), 'CSV export content invalid');
  console.log('CSV export OK');

  console.log('\nAll backend tests passed successfully.');
};

run().catch((error) => {
  console.error('Backend test failed:', error.message);
  process.exit(1);
});
