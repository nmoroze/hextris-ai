function AI() {
	this.initialize = function(c) {
		var num_inputs = 4 * c.width * c.height; // set # inputs to dimensions of canvas * 4 for rgba triples
		var num_actions = 3; // can rotate left, right, or not move
		var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :) TODO: figure out what this means
		var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;
		
		// the value function network computes a value of taking any of the possible actions
		// given an input state. Here we specify one explicitly the hard way
		// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
		// to just insert simple relu hidden layers.
		// TODO: figure out what these mean a little more exactly
		var layer_defs = [];
		layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
		layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
		layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
		layer_defs.push({type:'regression', num_neurons:num_actions});
		
		// options for the Temporal Difference learner that trains the above net
		// by backpropping the temporal difference learning rule.
		var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};
		
		var opt = {};
		opt.temporal_window = temporal_window;
		opt.experience_size = 30000;
		opt.start_learn_threshold = 1000;
		opt.gamma = 0.7;
		opt.learning_steps_total = 200000;
		opt.learning_steps_burnin = 3000;
		opt.epsilon_min = 0.05;
		opt.epsilon_test_time = 0.05;
		opt.layer_defs = layer_defs;
		opt.tdtrainer_options = tdtrainer_options;
		
		this.brain = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo
	}; 
	
	this.train = function(c, reward) {

	};

	this.play = function(c) {
		var ctx = c.getContext("2d"); 
		var input = ctx.getImageData(0, 0, c.width, c.height).data; 

		var action = brain.forward(input); 
		return action; 
	}; 

	this.save = function() {
	    return JSON.stringify(this.brain.value_net.toJSON()); 
	}
	
	this.load = function(s) {
		this.brain.value_net.fromJSON(JSON.parse(s)); 
	}
}; 
