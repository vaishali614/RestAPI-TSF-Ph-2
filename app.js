var bodyParser   = require('body-parser'),
methodOverride   = require('method-override'),
mongoose         = require('mongoose'),
express          = require('express'),
app              = express();

mongoose.connect('mongodb://localhost/students', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    contact: Number
});

var Student = mongoose.model('Student', studentSchema);

app.get('/', function(req, res){
    res.render('index');
});

// Add new student form
app.get('/new', function(req, res){
    res.render('new');
});

// Create new student
app.post('/view', function(req, res){
    Student.create({
        name    : req.body.name,
        age     : req.body.age,
        email   : req.body.email,
        contact : req.body.contact
    }, 
    function (err, student) {
        if (err){
            res.status(500).send('Oops! There was a problem adding a new student!');
        }
        res.redirect('view');
    })
});

// view all students
app.get('/view', function(req, res){
    Student.find({}, function(err, allStudents){
        if(err){
            res.status(500).send('Oops! There was a problem finding all students!');
        }
        res.render('view', {students: allStudents});
    });
});

// view one student
app.get('/view/:id', function(req, res){
    Student.findById(req.params.id, function(err, foundStudent){
        if(err){
            res.redirect('/view');
        }else{
            res.render('show', {student: foundStudent});
        }
    })
});

// edit route
app.get('/view/:id/edit', function(req, res){
    Student.findById(req.params.id, function(err, foundStudent){
        if(err){
            res.redirect('/view');
        }else{
            res.render('edit', {student: foundStudent});            
        }
    });
});

// update route
app.put('/view/:id', function(req, res){
    Student.findByIdAndUpdate(req.params.id, req.body, function(err, updatedStudent){
        if(err){
            res.redirect('/view');
        } else {
            res.redirect('/view/' + req.params.id);
        }
    })
});

// destroy route
app.delete('/view/:id', function(req, res){
    Student.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/view');
        } else {
            res.redirect('/view');
        }
    })
});

app.listen(8000, process.env.IP, function(){
    console.log('SERVER HAS STARTED!');
});