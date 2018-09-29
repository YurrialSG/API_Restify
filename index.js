const restify = require('restify')
const mongoose = require('mongoose')

mongoose.connect('mongodb://apiuser:teste2018@ds259802.mlab.com:59802/aps-api', {useNewUrlParser: true})
    .then(_=>{
        const server = restify.createServer({
            name: 'my-rest-api',
            version: '1.0.0',
            ignoreTrailingSlash: true
        })

        server.use(restify.plugins.bodyParser())
        
        const alunoSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            }
        })

        const Aluno = mongoose.model('Aluno', alunoSchema)
        
        server.get('/alunos', (req, resp, next)=>{
            Aluno.find().then(alunos=>{
                resp.json(alunos)
                return next()
            })
        })
        
        server.get('/alunos/:id', (req, resp, next)=>{
            Aluno.findById(req.params.id).then(aluno=>{
                if(aluno){
                    resp.json(aluno)
                }else{
                    resp.status(404)
                    resp.json({message: 'not found'})
                }
                return next()
            })
        })

        server.post('/alunos', (req, resp, next)=>{
            let aluno = new Aluno(req.body)
            aluno.save().then(aluno=>{
                resp.json(aluno)
            }).catch(error =>{
                resp.status(400)
                resp.json({message: error.message})
            })
        })

        server.put('/alunos/:id', (req, res, next) => {
            Aluno.findOne({ _id:req.params.id }, (err, aluno) => {
                for (let prop in req.body)
                    aluno[prop] = req.body[prop]
                aluno.save().then(aluno => {
                    res.send(aluno)
                    return next()
                });
            });
        });

        server.del('/alunos/:id', (req, res, next) => {
            Aluno.deleteOne({ _id: req.params.id }, err => {
                res.send({message: 'success'})
                return next()
            })
        })
        
        server.listen(3000, ()=>{
            console.log('api listening on 3000')
        })
    }).catch(console.error)