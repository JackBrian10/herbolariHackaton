const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const locationSchema = new mongoose.Schema({
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    }
})
const historySchema = new mongoose.Schema({
    _id:{type: Number},
        date: {
            type: Date,
        },
        location: locationSchema,
        name: {type: String,},
        image: {type: String},

})


const plants = mongoose.model("plants", historySchema)


// //Encriptacion de la password con hash+salt
// userSchema.pre('save', async function(next){
//     if (this.isModified('password')){
//         next();

//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password=await bcrypt.hash(this.password,salt); 
// });

// userSchema.methods.matchPassword=async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword,this.password);
// } 

// const User = mongoose.model('herbolari', userSchema);
// const Arbre = mongoose.model('arbre', arbreSchema)

module.exports = {plants};  