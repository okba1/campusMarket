var Product            = require('../app/models/product');
module.exports = function(app, passport){
  app.get("/", function(req, res){
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
  });

  app.get('/signup', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.get('/profile', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {
          user : req.user // get the user out of session and pass to template
      });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));


  app.get('/addproduct', function(req, res){
    res.render('addproduct.ejs');
  });

  app.post('/addproduct', function(req, res){
    var newProduct = new Product();
    newProduct.title = req.body.title;
    newProduct.description = req.body.description;
    newProduct.userId = req.user.id;
    newProduct.toSell = req.body.toSell;
    console.log("id " + req.user.id);
    newProduct.save(function(err) {
      if (err)
          throw err;
      res.render("index.ejs");
    });
    res.render("index.ejs");
  });
  app.get("/getproducts", function(req, res){
    process.nextTick(function() {
      Product.find({},function(err, items){
        if(err)
          throw err;
        console.log(items[0]);
        res.render('products-list.ejs', {products : items});
      });
    });
  });

  app.get("/myproducts", function(req, res){
    process.nextTick(function() {
      Product.find({userId:req.user.id},function(err, items){
        if(err)
          throw err;
        console.log(items[0]);
        res.render('products-list.ejs', {products : items});
      });
    });
  });


  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



}