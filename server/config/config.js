// ===========
// Puerto
// ===========
process.env.PORT = process.env.PORT || 3000;


// ===========
// Entorno (Heroku crea la variable de entorno)
// ===========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ===========
//Vencimiento token
// 60 s *60 min * 24 hrs * 30 dias
// ===========
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



// ===========
// Semilla
// ===========
process.env.SEED = process.env.SEED || 'semilla-para-desarrollo';

// ===========
// GOOGLE CLIENT_ID
// ===========
process.env.CLIENT_ID = process.env.CLIENT_ID || '325283884789-a47lusfdapv018pc29oskb05hfv69okh.apps.googleusercontent.com';



// ===========
// BD
// ===========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

//creo una nueva variable de ambiente
process.env.URL_DB = urlDB;
console.log(process.env.URL_DB);