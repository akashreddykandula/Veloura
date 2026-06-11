import Newsletter from '../models/Newsletter.js';

export async function subscribe(req, res) {
  const subscription = await Newsletter.findOneAndUpdate(
    { email: req.body.email },
    { email: req.body.email, source: req.body.source || 'website', isActive: true },
    { upsert: true, new: true, runValidators: true }
  );
  res.status(201).json(subscription);
}

export async function subscribers(req, res) {
  res.json(await Newsletter.find({}).sort({ createdAt: -1 }));
}
