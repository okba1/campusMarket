var Product            = require('../app/models/product');
var User               = require('../app/models/user');
var nodemailer         = require('nodemailer');
var transporter = nodemailer.createTransport();





module.exports = function(app, passport){

  app.post("/sendMail", function(req, res){
    process.nextTick(function() {
      User.findOne({_id:req.body.ownerId}, function(err, item){
        if (err)
          throw err;
        var to = item.local.email;
      });
    });
    console.log(req.user.local.email);
    var mailOptions = {
      from: "khenissiokba@yahoo.fr",
      to: "khenissiokba@gmail.com",
      subject: "Campus Market",
      text: "Je suis intéressé par votre velo",
      html: '<b>Bonjour</b>'
    };
    transporter.sendMail(mailOptions, function(error, info){
     if(error){
        return console.log(error);
     }
     console.log('Message sent: ' + info.response);
     res.render("index.ejs", {connected:true});
  });

  transporter.close();
  });

  app.get("/", function(req, res){
    var connected = false;
    if(req.user){
      connected = true;
    }
    res.render('index.ejs', {connected : connected});
  });

  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('index.ejs', {message: req.flash('loginMessage') }); 
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
      res.render("index.ejs", {connected : true});
    });
  });
  app.get("/offers", function(req, res){
    process.nextTick(function() {
      Product.find({toSell:true},function(err, items){
        if(err)
          throw err;
        console.log(req.user);
        res.render('offers.ejs', {offers : items, user:req.user});
      });
    });
  });

  app.get("/demand", function(req, res){
    process.nextTick(function() {
      Product.find({toSell:false},function(err, items){
        if(err)
          throw err;
       
        res.render('demand.ejs', {demand : items, user:req.user});
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

  app.get("/showEmail", function(req, res){
     process.nextTick(function() {
      User.findOne({_id:req.query.ownerId}, function(err, item){
        if (err)
          throw err;
        console.log(item.local.email);
        res.contentType('application/json');
        res.send({ email: item.local.email, id:item._id});
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