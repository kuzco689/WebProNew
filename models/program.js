let mongoose = require('mongoose');

// Program Schema
let programSchema = mongoose.Schema({
	university:{
		type: String,
    	required: true
	},
	country:{
		type: String,
    	required: true
	},
	body:{
		type: String,
    	required: true
	},
	appdeadline:{
		type: String,
    	required: true
	},
	file:{
		type: String
	},
	levelofstudy:{
		type: String,
    	required: true
	}
});

let Program = module.exports = mongoose.model('Program', programSchema);
