// ===========
// Puerto
// ===========
process.env.PORT = process.env.PORT || 3000;


// ===========
// Entorno (Heroku crea la variable de entorno)
// ===========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

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