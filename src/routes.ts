module.exports = function (app) {
    
    
    app.get('/models.js', function (req, res) {
        res.sendfile(__dirname + '/public/models.js');
    });
    
    app.get('/controller.js', function (req, res) {
        res.sendfile(__dirname + '/public/controller.js');
    });
    
    app.get('/interaction.js', function (req, res) {
        res.sendfile(__dirname + '/public/interaction.js');
    });
    
    app.get('/view.js', function (req, res) {
        res.sendfile(__dirname + '/public/view.js');
    });
    
    
    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/public/index.html');
    });
};