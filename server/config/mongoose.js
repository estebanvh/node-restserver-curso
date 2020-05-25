const mongoose = require('mongoose');


//collection.ensureIndex is deprecated
//Mongoose usa internamente la funcion ensureIndex.
//se debe forzar a utilizar useCreateIndex
mongoose.set('useCreateIndex', true);


// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` 
//option set to false are deprecated.
mongoose.set('useFindAndModify', false);

module.exports = mongoose