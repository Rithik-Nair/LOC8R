module.exports.home = function (req, res) {
  res.render('home', {
    title: 'Loc8R - Home',
    user: req.session ? req.session.user : null,
    error: req.flash ? req.flash('error') : null,
    success: req.flash ? req.flash('success') : null
  });
};

// Provide `index` alias for routes that expect `ctrlHome.index`
module.exports.index = module.exports.home;
