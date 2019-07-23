var bodyParser   = require('body-parser'),
methodOverride   = require('method-override'),
mongoose         = require('mongoose'),
express          = require('express'),
app              = express();

mongoose.connect('mongodb://localhost/teachers', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var teacherSchema = new mongoose.Schema({
    name: String,
    subject: String,
    email: String,
    contact: Number
});

var Teacher = mongoose.model('Teacher', teacherSchema);

app.get('/', function(req, res){
    res.render('index');
});

// Add new teacher form
app.get('/new', function(req, res){
    res.render('new');
});

// Create new teacher
app.post('/view', function(req, res){
    Teacher.create({
        name    : req.body.name,
        subject     : req.body.subject,
        email   : req.body.email,
        contact : req.body.contact
    }, 
    function (err, teacher) {
        if (err){
            res.status(500).send('Oops! There was a problem adding a new Teacher!');
        }
        res.redirect('view');
    })
});

// view all teachers
app.get('/view', function(req, res){
    Teacher.find({}, function(err, allTeachers){
        if(err){
            res.status(500).send('Oops! There was a problem finding all Teachers!');
        }
        res.render('view', {teachers: allTeachers});
    });
});

// view one teacher
app.get('/view/:id', function(req, res){
    Teacher.findById(req.params.id, function(err, foundTeacher){
        if(err){
            res.status(500).send('Oops! There was a problem viewing the Teacher!');
        }else{
            res.render('show', {teacher: foundTeacher});
        }
    })
});

// edit route
app.get('/view/:id/edit', function(req, res){
    Teacher.findById(req.params.id, function(err, foundTeacher){
        if(err){
            res.status(500).send('Oops! There was problem editing the Teacher!')
        }else{
            res.render('edit', {teacher: foundTeacher});            
        }
    });
});

// update route
app.put('/view/:id', function(req, res){
    Teacher.findByIdAndUpdate(req.params.id, req.body, function(err, updatedTeacher){
        if(err){
            res.status(500).send('Oops! There was a problem updating a Teacher!');
        } else {
            res.redirect('/view/' + req.params.id);
        }
    })
});

// destroy route
app.delete('/view/:id', function(req, res){
    Teacher.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.status(500).send('Oops! There was a problem deleting the Teacher!');
        } else {
            res.redirect('/view');
        }
    })
});

app.listen(8000, process.env.IP, function(){
    console.log('SERVER HAS STARTED!');
});