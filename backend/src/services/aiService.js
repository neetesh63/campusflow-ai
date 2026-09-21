const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('../config/supabase');
require('dotenv').config();

/**
 * Get GoogleGenerativeAI instance securely reading GEMINI_API_KEY from process.env
 */
function getGenerativeAIInstance() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-google-gemini-api-key') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Basic prompt injection protection and query sanitization
 */
function sanitizeUserQuery(query) {
  if (!query || typeof query !== 'string') return '';
  // Check for common prompt injection patterns
  const injectionPatterns = [
    /ignore (all )?previous instructions/i,
    /system prompt/i,
    /you are now a/i,
    /bypass safety/i,
    /reveal (the )?secret/i
  ];

  let cleaned = query.trim().slice(0, 1000); // Enforce max 1000 chars limit
  for (const pattern of injectionPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '[filtered]');
    }
  }
  return cleaned;
}

/**
 * Fetch real-time student context from database or fallback demo data
 */
async function fetchStudentContext(userId, role) {
  const context = {
    userName: 'Student',
    attendance: null,
    pendingAssignments: [],
    notices: [],
    events: []
  };

  try {
    if (supabase && userId && !userId.startsWith('student-id-')) {
      // 1. Fetch Profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (profile) context.userName = profile.full_name || 'Student';

      // 2. Fetch Attendance
      const { data: att } = await supabase.from('attendance').select('*').eq('student_id', userId);
      if (att && att.length > 0) {
        const total = att.length;
        const attended = att.filter(a => a.status === 'present' || a.status === 'late').length;
        const pct = ((attended / total) * 100).toFixed(1);
        context.attendance = { total, attended, missed: total - attended, percentage: `${pct}%` };
      }

      // 3. Fetch Personal Assignments
      const { data: assign } = await supabase.from('student_assignments')
        .select('*')
        .eq('student_id', userId)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5);
      if (assign) context.pendingAssignments = assign.map(a => `${a.title} (${a.subject}, Due: ${new Date(a.due_date).toLocaleDateString()}, Priority: ${a.priority})`);

      // 4. Fetch Recent Notices
      const { data: notices } = await supabase.from('notices').select('title, category, published_at').order('published_at', { ascending: false }).limit(4);
      if (notices) context.notices = notices.map(n => `[${n.category}] ${n.title}`);

      // 5. Fetch Upcoming Events
      const { data: events } = await supabase.from('events').select('title, venue, event_date, event_time').gte('event_date', new Date().toISOString().split('T')[0]).order('event_date', { ascending: true }).limit(3);
      if (events) context.events = events.map(e => `${e.title} at ${e.venue} on ${e.event_date}`);

    } else {
      // Demo Fallback Context
      context.userName = 'Alex Johnson';
      context.attendance = { total: 40, attended: 34, missed: 6, percentage: '85.0%' };
      context.pendingAssignments = [
        'Data Structures Tree Implementation (CSE-301, Due: In 2 days, Priority: High)',
        'Database Normalization Lab (CSE-302, Due: In 4 days, Priority: Medium)'
      ];
      context.notices = [
        '[Exam] Mid-Semester Examination Schedule Announced',
        '[Placement] Campus Drive by Google & Microsoft Registered Students'
      ];
      context.events = [
        'Annual Tech Hackathon 2026 at Main Auditorium on Friday'
      ];
    }
  } catch (err) {
    console.warn('Error fetching student AI context:', err.message);
  }

  return context;
}

/**
 * Simple test function for GET /api/ai/test
 */
async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY || '';

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-google-gemini-api-key') {
    return {
      success: false,
      message: 'GEMINI_API_KEY is missing or unconfigured in backend/.env',
      error: 'Please add a valid GEMINI_API_KEY in backend/.env file'
    };
  }

  const prompt = 'Explain CampusFlow AI in one sentence.';
  const genAI = new GoogleGenerativeAI(apiKey);

  const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      return {
        success: true,
        message: `Gemini API test completed successfully using model ${modelName}`,
        prompt,
        response: responseText,
        modelUsed: modelName,
        source: 'gemini-api'
      };
    } catch (err) {
      console.warn(`Model ${modelName} call failed, trying next candidate:`, err.message);
    }
  }

  return {
    success: false,
    message: 'Gemini API call failed. Please verify your GEMINI_API_KEY in backend/.env.',
    error: 'All model candidates failed. Check API key validity.'
  };
}

/**
 * Generate AI Chat response for Campus Assistant with live context
 */
async function generateCampusAIChat(userMessage, conversationHistory = [], user = {}) {
  const cleanedQuery = sanitizeUserQuery(userMessage);
  const context = await fetchStudentContext(user.id, user.role);
  const genAI = getGenerativeAIInstance();

  if (genAI) {
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    const prompt = `You are CampusFlow AI Assistant, an intelligent, helpful, and concise AI campus assistant for ${context.userName}.
IMPORTANT INSTRUCTIONS:
- Answer based ONLY on verified campus context provided below when applicable.
- Do NOT invent or fabricate grades, marks, or database facts that are not provided.
- If specific data is missing or unavailable, clearly state: "Data not available in system".
- Maintain a helpful, encouraging academic tone.

LIVE STUDENT & CAMPUS CONTEXT:
- Student Name: ${context.userName}
- Attendance Stats: ${context.attendance ? `${context.attendance.percentage} (${context.attendance.attended}/${context.attendance.total} classes attended)` : 'Not recorded yet'}
- Pending Assignments: ${context.pendingAssignments.length ? context.pendingAssignments.join('; ') : 'No pending assignments'}
- Recent Notices: ${context.notices.length ? context.notices.join('; ') : 'No recent notices'}
- Upcoming Events: ${context.events.length ? context.events.join('; ') : 'No upcoming events'}

User Query: "${cleanedQuery}"`;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return {
          success: true,
          response: responseText,
          modelUsed: modelName,
          source: 'gemini-api'
        };
      } catch (error) {
        console.warn(`Gemini model ${modelName} failed:`, error.message);
      }
    }
  }

  // Fallback AI logic if Gemini API key is missing or failed
  return {
    success: true,
    response: getFallbackAIChatResponse(cleanedQuery, context),
    source: 'fallback-ai'
  };
}

/**
 * Intelligent deterministic fallback chat response generator
 */
function getFallbackAIChatResponse(query, context) {
  const q = query.toLowerCase();

  if (q.includes('attendance') || q.includes('absent') || q.includes('percentage')) {
    if (context && context.attendance) {
      return `Your current attendance is ${context.attendance.percentage} (${context.attendance.attended} attended out of ${context.attendance.total} total classes). ${parseFloat(context.attendance.percentage) >= 75 ? 'Great job! You are above the mandatory 75% threshold.' : 'Warning: You are below 75% attendance. Please attend upcoming classes!'}`;
    }
    return "CampusFlow AI Note: Your current attendance record indicates 85.0% attendance (34/40 classes). Keep maintaining at least 75% to stay eligible for exams!";
  }
  if (q.includes('assignment') || q.includes('homework') || q.includes('due date') || q.includes('pending')) {
    if (context && context.pendingAssignments && context.pendingAssignments.length > 0) {
      return `Here are your current pending assignments:\n- ${context.pendingAssignments.join('\n- ')}`;
    }
    return "You have 2 pending assignments:\n1. Data Structures Tree Implementation (Due in 2 days, High Priority)\n2. Database Normalization Lab (Due in 4 days, Medium Priority)";
  }
  if (q.includes('notice') || q.includes('announcement')) {
    if (context && context.notices && context.notices.length > 0) {
      return `Latest College Notices:\n- ${context.notices.join('\n- ')}`;
    }
    return "Latest Notice: Mid-Semester Examination schedule has been released under the Notices tab.";
  }
  if (q.includes('event') || q.includes('fest')) {
    if (context && context.events && context.events.length > 0) {
      return `Upcoming Campus Events:\n- ${context.events.join('\n- ')}`;
    }
    return "Upcoming Event: Annual Tech Hackathon 2026 at Main Auditorium on Friday.";
  }
  if (q.includes('complaint') || q.includes('issue') || q.includes('hostel') || q.includes('wifi')) {
    return "You can submit and track campus complaints (WiFi, Hostel, Library, Infrastructure) directly on the Complaints page.";
  }

  return `Hello ${context ? context.userName : 'Student'}! As your CampusFlow AI Assistant, I can answer queries about your attendance (${context?.attendance?.percentage || '85%'}), pending assignments, notices, and events.

Query Received: "${query}"`;
}

/**
 * Generate AI Study Plan based on student preferences
 */
async function generateAIStudyPlan(params) {
  const { subjects, dailyHours, examDate, weakSubjects, preferredTime, preparationLevel } = params;
  const genAI = getGenerativeAIInstance();

  if (genAI) {
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    const prompt = `Create a structured study plan JSON for a college student with the following inputs:
- Subjects: ${subjects}
- Daily Available Hours: ${dailyHours} hours
- Exam Date: ${examDate || 'In 30 days'}
- Focus/Weak Subjects: ${weakSubjects || 'None specified'}
- Preferred Study Time: ${preferredTime || 'Evening'}
- Preparation Level: ${preparationLevel || 'Intermediate'}

Return a JSON object with:
1. "overview": Brief motivational summary
2. "dailySchedule": Array of 4-6 schedule blocks with "timeSlot", "subject", "activity", and "breakDuration"
3. "subjectPriorities": Array of subjects with "name", "priority" (High/Medium/Low), and "allocatedHours"
4. "examTips": Array of 4 strategic preparation tips
5. "breakRecommendations": Array of 3 rest recommendations`;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            return { success: true, plan: parsed, modelUsed: modelName, source: 'gemini-api' };
          } catch (pe) {
            console.warn(`JSON parse error on Gemini ${modelName} output:`, pe.message);
          }
        }
      } catch (error) {
        console.warn(`Gemini model ${modelName} Study Plan call failed:`, error.message);
      }
    }
  }

  // Fallback Study Plan Generator
  const subjectList = subjects ? subjects.split(',').map(s => s.trim()) : ['Mathematics', 'Data Structures', 'Database Systems', 'Computer Networks'];
  const totalHours = parseFloat(dailyHours) || 4;

  const fallbackPlan = {
    overview: `Tailored ${totalHours}-hour daily preparation roadmap focusing on high-priority weak areas: "${weakSubjects || 'Core Subjects'}" targeting exams by ${examDate || 'next month'}.`,
    dailySchedule: [
      { timeSlot: preferredTime === 'Morning' ? '07:00 AM - 09:00 AM' : '05:00 PM - 07:00 PM', subject: subjectList[0] || 'Core Subject 1', activity: 'High-focus concept review & solving complex problems', breakDuration: '15 mins rest' },
      { timeSlot: preferredTime === 'Morning' ? '09:15 AM - 10:45 AM' : '07:15 PM - 08:45 PM', subject: weakSubjects || subjectList[1] || 'Weak Subject', activity: 'Targeted practice, active recall, flashcards & notes review', breakDuration: '20 mins dinner/snack break' },
      { timeSlot: preferredTime === 'Morning' ? '11:05 AM - 12:30 PM' : '09:05 PM - 10:30 PM', subject: subjectList[2] || 'Core Subject 2', activity: 'Previous year questions (PYQs) & assignment revisions', breakDuration: '10 mins rest' },
      { timeSlot: preferredTime === 'Morning' ? '12:40 PM - 01:30 PM' : '10:40 PM - 11:30 PM', subject: 'General Revision', activity: 'Daily formula recap & preparation for tomorrow\'s classes', breakDuration: 'End of session' }
    ],
    subjectPriorities: subjectList.map((sub, idx) => ({
      name: sub,
      priority: idx === 0 || sub.toLowerCase().includes((weakSubjects || '').toLowerCase()) ? 'High' : 'Medium',
      allocatedHours: `${(totalHours / subjectList.length).toFixed(1)} hrs/day`
    })),
    examTips: [
      "Use the Pomodoro technique: 25 minutes of deep focus followed by a 5-minute break.",
      "Solve at least 2 previous semester exam papers per subject under timed conditions.",
      "Summarize difficult formulas and algorithms into concise cheat sheets.",
      "Review your weakest topics during peak energy hours."
    ],
    breakRecommendations: [
      "Hydrate well and take a 10-minute walk outside after every 90 minutes of study.",
      "Avoid social media during short study breaks to maintain cognitive focus.",
      "Ensure 7-8 hours of sleep each night for optimal long-term memory consolidation."
    ]
  };

  return {
    success: true,
    plan: fallbackPlan,
    source: 'fallback-ai'
  };
}

/**
 * AI Lost & Found Match Suggestion Service
 */
async function suggestLostFoundMatches(lostItems = [], foundItems = []) {
  const genAI = getGenerativeAIInstance();

  if (genAI && lostItems.length > 0 && foundItems.length > 0) {
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    const prompt = `Analyze these reported Lost Items and Found Items on a college campus and suggest possible matches based on item names, category, description, location, and dates.

LOST ITEMS:
${JSON.stringify(lostItems, null, 2)}

FOUND ITEMS:
${JSON.stringify(foundItems, null, 2)}

Return a JSON array of objects, each containing:
- "lostItemId": ID of lost item
- "foundItemId": ID of found item
- "confidenceScore": number between 50 and 99
- "matchReason": clear explanation why these two items might match

Note: Matches are AI suggestions ONLY.`;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const suggestions = JSON.parse(jsonMatch[0]);
          return { success: true, suggestions, modelUsed: modelName, source: 'gemini-api' };
        }
      } catch (err) {
        console.warn(`Gemini Lost & Found Matcher model ${modelName} failed:`, err.message);
      }
    }
  }

  // Smart fallback matching algorithm
  const suggestions = [];
  lostItems.forEach(lost => {
    foundItems.forEach(found => {
      let score = 0;
      let reasons = [];

      if (lost.category && found.category && lost.category.toLowerCase() === found.category.toLowerCase()) {
        score += 40;
        reasons.push(`Same category (${lost.category})`);
      }

      const lostWords = (lost.item_name + ' ' + lost.description).toLowerCase().split(/\s+/);
      const foundWords = (found.item_name + ' ' + found.description).toLowerCase().split(/\s+/);
      const overlap = lostWords.filter(w => w.length > 3 && foundWords.includes(w));

      if (overlap.length > 0) {
        score += Math.min(overlap.length * 20, 50);
        reasons.push(`Matching keywords: ${overlap.slice(0, 3).join(', ')}`);
      }

      if (lost.location && found.location && (lost.location.toLowerCase().includes(found.location.toLowerCase()) || found.location.toLowerCase().includes(lost.location.toLowerCase()))) {
        score += 20;
        reasons.push(`Similar location (${lost.location})`);
      }

      if (score >= 50) {
        suggestions.push({
          lostItemId: lost.id,
          lostTitle: lost.item_name,
          foundItemId: found.id,
          foundTitle: found.item_name,
          confidenceScore: Math.min(score, 95),
          matchReason: reasons.join('; ')
        });
      }
    });
  });

  return {
    success: true,
    suggestions,
    source: 'fallback-ai'
  };
}

module.exports = {
  testGeminiAPI,
  generateCampusAIChat,
  generateAIStudyPlan,
  suggestLostFoundMatches
};

