const { supabase } = require('../config/supabase');

let MOCK_POLLS = [
  {
    id: 'poll-101',
    title: 'Preferred Mode for Upcoming Mid-Semester Exam',
    description: 'Please vote for your preferred examination format for CSE 5th & 6th Semesters.',
    options: ['Pen-Paper Descriptive', 'Online Computer-Based Test (CBT)', 'Hybrid Project Presentation'],
    created_by: 'admin-id-101',
    creator_name: 'Dr. Sarah Connor',
    start_date: '2026-09-10T00:00:00Z',
    end_date: '2026-09-30T23:59:59Z',
    is_active: true,
    is_anonymous: false,
    votes: [
      { student_id: 'student-id-303', option_index: 1 }
    ]
  },
  {
    id: 'poll-102',
    title: 'Annual Cultural Fest Topic / Theme 2026',
    description: 'Which theme would you like to see for the campus annual cultural fest TechFest 2026?',
    options: ['Cyberpunk & Futuristic AI', 'Retro 90s Nostalgia', 'Cosmic & Deep Space', 'Global Eco-Sustainability'],
    created_by: 'faculty-id-202',
    creator_name: 'Prof. Alan Turing',
    start_date: '2026-09-01T00:00:00Z',
    end_date: '2026-09-25T23:59:59Z',
    is_active: true,
    is_anonymous: true,
    votes: []
  }
];

async function getPolls(req, res) {
  try {
    const studentId = req.user.id;

    if (supabase) {
      const { data: polls, error } = await supabase
        .from('polls')
        .select('*, poll_votes(*)')
        .order('created_at', { ascending: false });

      if (!error && polls) {
        const formatted = polls.map(poll => {
          const votes = poll.poll_votes || [];
          const userVote = votes.find(v => v.student_id === studentId);
          const optionCounts = (poll.options || []).map((opt, idx) => ({
            option: opt,
            count: votes.filter(v => v.option_index === idx).length
          }));

          return {
            id: poll.id,
            title: poll.title,
            description: poll.description,
            options: poll.options,
            start_date: poll.start_date,
            end_date: poll.end_date,
            is_active: poll.is_active,
            is_anonymous: poll.is_anonymous,
            totalVotes: votes.length,
            optionCounts,
            hasVoted: !!userVote,
            userVotedOption: userVote ? userVote.option_index : null
          };
        });

        return res.json({ success: true, data: formatted, source: 'supabase' });
      }
    }

    const formattedMock = MOCK_POLLS.map(poll => {
      const votes = poll.votes || [];
      const userVote = votes.find(v => v.student_id === studentId);
      const optionCounts = poll.options.map((opt, idx) => ({
        option: opt,
        count: votes.filter(v => v.option_index === idx).length
      }));

      return {
        ...poll,
        totalVotes: votes.length,
        optionCounts,
        hasVoted: !!userVote,
        userVotedOption: userVote ? userVote.option_index : null
      };
    });

    return res.json({ success: true, data: formattedMock, source: 'mock' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch polls', error: error.message });
  }
}

async function createPoll(req, res) {
  try {
    const { title, description, options, end_date, is_anonymous = false } = req.body;

    if (!title || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Title and at least 2 options are required.' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('polls')
        .insert([
          {
            title,
            description: description || '',
            options,
            created_by: req.user.id,
            end_date: end_date || null,
            is_anonymous
          }
        ])
        .select();

      if (!error && data) {
        return res.status(201).json({ success: true, message: 'Poll created successfully', data: data[0], source: 'supabase' });
      }
    }

    const newPoll = {
      id: `poll-${Date.now()}`,
      title,
      description: description || '',
      options,
      created_by: req.user.id,
      creator_name: req.user.full_name || 'Admin',
      start_date: new Date().toISOString(),
      end_date: end_date || null,
      is_active: true,
      is_anonymous,
      votes: []
    };

    MOCK_POLLS.unshift(newPoll);
    return res.status(201).json({ success: true, message: 'Poll created successfully', data: newPoll, source: 'mock' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create poll', error: error.message });
  }
}

async function votePoll(req, res) {
  try {
    const { id } = req.params;
    const { option_index } = req.body;
    const studentId = req.user.id;

    if (option_index === undefined || option_index === null) {
      return res.status(400).json({ success: false, message: 'Option index is required' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('poll_votes')
        .insert([{ poll_id: id, student_id: studentId, option_index: parseInt(option_index) }])
        .select();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ success: false, message: 'You have already voted on this poll.' });
        }
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(201).json({ success: true, message: 'Vote submitted successfully', data: data[0] });
    }

    const targetPoll = MOCK_POLLS.find(p => p.id === id);
    if (!targetPoll) return res.status(404).json({ success: false, message: 'Poll not found' });

    const existingVote = targetPoll.votes.find(v => v.student_id === studentId);
    if (existingVote) {
      return res.status(400).json({ success: false, message: 'You have already voted on this poll.' });
    }

    targetPoll.votes.push({ student_id: studentId, option_index: parseInt(option_index) });
    return res.status(201).json({ success: true, message: 'Vote submitted successfully' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to vote', error: error.message });
  }
}

module.exports = {
  getPolls,
  createPoll,
  votePoll
};
