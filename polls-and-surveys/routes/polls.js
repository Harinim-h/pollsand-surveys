const express = require('express');
const Poll = require('../models/Poll');
const User = require('../models/User');
const router = express.Router();

// Create Poll
router.post('/', async (req, res) => {
  const { title, options } = req.body;
  try {
    const poll = new Poll({
      title,
      options: options.map(option => ({ option, votes: 0 })),
      creator: req.user.id,
    });
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Get All Polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Vote on a Poll
router.post('/:pollId/vote', async (req, res) => {
  const { pollId } = req.params;
  const { optionIndex } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
