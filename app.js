var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var methodOverride = require('method-override')
var expressSanitizer = require('express-sanitizer')

app = express();

mongoose.connect('mongodb://ahmed:blue1234@ds143245.mlab.com:43245/ahmedblog');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static('puplic'));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
// Mongoose Model and Schema
var Schema = mongoose.Schema; 

var blogSchema = new Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}

});

var Blog = mongoose.model('Blog', blogSchema);


// Blog.create({
// 	title:'test blog',
// 	image: 'https://unsplash.com/photos/6Khbjy2v-GE',
// 	body:'Hello this the a test blog post'
// })

// RESTFUL ROUTES

// INDEX ROUTES
app.get('/', function(req, res){
	res.redirect('/blogs');
})

// HOME ROUTES
app.get('/blogs', function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log('ERROR!');
		} else {
			res.render('index', {blogs: blogs});
		}
	});	
});

//NEW ROUTE

app.get('/blogs/new', function(req,res){
	res.render('new');
})

//CREATE ROUTE

app.post('/blogs', function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.send('new');
		} else {
			res.redirect('/blogs');
		}
	});
});

// SHOW ROUTE
app.get('/blogs/:id',function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect('/blogs');
		} else {
			res.render('show', {blog: foundBlog});
		}
	});
});

// EDIT ROUTE 
app.get('/blogs/:id/edit', function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect('/blogs');
		}else{
			res.render('edit', {blog: foundBlog});
		}
	});	
});

// UPDATE ROUTE
app.put('/blogs/:id', function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
		if(err){
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

// DELETE ROUTE 
app.delete('/blogs/:id', function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
}); 

app.listen(8080, function () {
	console.log('Server is Running')
})