export const isTrustee = (req, res, next) => {
  if (req.user?.role !== 'Trustee') {
    return res.status(403).json({ message: 'Access denied: Trustees only' });
  }
  next();
};

export const isVolunteer = (req, res, next) => {
  if (!['Volunteer', 'Trustee'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Access denied: Volunteers only' });
  }
  next();
};
