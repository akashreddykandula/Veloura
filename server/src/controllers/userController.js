import User from '../models/User.js';

export async function updateProfile(req, res) {
  const updates = (({ name, phone, avatar }) => ({ name, phone, avatar }))(req.body);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
  res.json(user);
}

export async function addAddress(req, res) {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach((address) => (address.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(user.addresses);
}

export async function updateAddress(req, res) {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  Object.assign(address, req.body);
  if (address.isDefault) user.addresses.forEach((item) => { if (String(item._id) !== String(address._id)) item.isDefault = false; });
  await user.save();
  res.json(user.addresses);
}

export async function deleteAddress(req, res) {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.addressId);
  await user.save();
  res.json(user.addresses);
}

export async function toggleWishlist(req, res) {
  const user = await User.findById(req.user._id);
  const id = req.params.productId;
  if (user.wishlist.some((item) => String(item) === id)) user.wishlist.pull(id);
  else user.wishlist.addToSet(id);
  await user.save();
  await user.populate('wishlist');
  res.json(user.wishlist);
}

export async function getWishlist(req, res) {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
}

export async function listCustomers(req, res) {
  res.json(await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 }).limit(200));
}
