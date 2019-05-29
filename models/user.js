const mongoose = require('mongoose');

//User
const UserSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	name:{
		type: String,
		required: true
	},
	faculty:{
		type:String,
		required:true
	},
	dep:{
		type:String,
		required:true
	},
	major:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	phone:{
		type:String
	},
	image:{
		type:String
	},
	favclub:{
		type:String
	},
	favprogram:{
		type:String
	},
	usertype:{
		type:String
	}
});

const User = module.exports = mongoose.model('User',UserSchema);