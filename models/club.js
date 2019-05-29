let mongoose = require('mongoose');

let programSchema = mongoose.Schema({
	title:{
		type: String,
    	required: true
	},
	date:{
		type: String,
    	required: true
	},
	body:{
		type: String,
    	required: true
	}
});

let Club = module.exports = mongoose.model('Club', clubSchema);
