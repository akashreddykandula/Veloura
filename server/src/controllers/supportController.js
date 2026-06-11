import SupportTicket from '../models/SupportTicket.js';

export async function createTicket(req, res) {
  const ticket = await SupportTicket.create({ ...req.body, user: req.user?._id });
  res.status(201).json(ticket);
}

export async function listTickets(req, res) {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  res.json(await SupportTicket.find(filter).sort({ createdAt: -1 }));
}

export async function replyTicket(req, res) {
  const ticket = await SupportTicket.findById(req.params.id);
  ticket.replies.push({ author: req.user.name, message: req.body.message });
  if (req.body.status) ticket.status = req.body.status;
  await ticket.save();
  res.json(ticket);
}
