const express = require('express'),
  path = require('path'),
  mongo = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser');

const app = express();

mongo.Promise = global.Promise;
mongo.connect('mongodb://localhost:27017/assignmentDB2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('Sikerült csatlakozni az adatbázishoz.')
  },
  error => {
    console.log('Hiba történt: ' + error)
  }
)

const Schema = mongo.Schema;

const gameRoute = express.Router();
let Game = new Schema({
  name: {
    type: String
  },
  gameID: {
    type: String,
    unique: true
  },
  author: {
    type: String
  },
  company: {
    type: String
  },
  releaseDate: {
    type: Date
  },
  instruction: {
    type: String
  },
  serieNumber: {
    type: Number
  },
  amount: {
    type: Number
  }
}, {
  collection: 'game'
});

var gameModel = mongo.model('game', Game, 'game');

gameModel.ensureIndexes((err) => {
  if (err) console.error(err);
});

gameRoute.route('/createGame').post((req, res, next) => {
  gameModel.create(req.body, (error, data) => {
    if (error) {
      if (error.code === 11000) {
        res.status(400).send({ message: 'Game id have to be unique' });
      } else {
        next(error);
      }
    } else {
      res.json(data);
    }
  });
});

gameRoute.route('/checkGameID/:code').get((req, res) => {
  const code = req.params.code;
  gameModel.findOne({ gameID: code }, (error, data) => {
    if (error) {
      res.status(400).send({ exists: false });
    } else {
      res.json({ exists: true });
    }
  });
});

gameRoute.route('/createGame').get((req, res) => {
  gameModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

gameRoute.route('/deleteGame/:id')
  .delete((req, res) => {
    const id = req.params.id;
    gameModel.findByIdAndDelete(id, (error, result) => {
      if (error) {
        res.status(500).send({ message: 'Error when deleting game' });
      } else if (!result) {
        res.status(404).send({ message: 'Game not found' });
      } else {
        res.status(200).send({ message: 'Game deleted successfully' });
      }
    });
  });

  gameRoute.route('/updateGame/:id').put((req, res, next) => {
    const id = req.params.id;
    gameModel.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
  });

const userRoute = express.Router();
let User = new Schema({
  uname: {
    type: String
  },
  password: {
    type: String
  }
}, {
  collection: 'users'
})

var userModel = mongo.model('users', User, 'users');

userRoute.route('/addUser').post((req, res, next) => {
  userModel.create(req.body, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      res.json(data)
    }
  })
});

userRoute.route('/getallUser').get((req, res) => {
  userModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

userRoute.route('/getUser/:id').get((req, res) => {
  userModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/assignment')));
app.use('/', express.static(path.join(__dirname, 'dist/assignment')));

app.use('', userRoute)
app.use('', gameRoute)

app.listen(8080);
console.log('8080 porton elindult az adatbázisszerver.');
