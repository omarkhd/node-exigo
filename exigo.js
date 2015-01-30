'use strict';
var foam = require('foam');
var hogan = require('hogan');
var heredoc = require('heredoc');

var AUTH_TEMPLATE = hogan.compile(heredoc(function() {/*
	<ApiAuthentication xmlns="{{ namespace }}">
		<LoginName>{{ username }}</LoginName>
		<Password>{{ password }}</Password>
		<Company>{{ company }}</Company>
	</ApiAuthentication>
*/}));


var ExigoError = function(message) {
	if(message && typeof message === 'object' && message['Fault'])
		message = message['Fault']['faultstring'];

	this.name = 'ExigoError';
	this.message = '[EXIGO] ' + message || 'Unknown error';
};

ExigoError.prototype = Object.create(Error.prototype);
ExigoError.prototype.constructor = ExigoError;


var ExigoClient = function(auth) {
	if(!auth || typeof auth !== 'object')
		throw new ExigoError('Authentication object is required');

	this.namespace = 'http://api.exigo.com/';
	this.uri = 'http://api.exigo.com/3.0/ExigoApi.asmx';

	this.options = {
		namespace: this.namespace,
		header: AUTH_TEMPLATE.render({
			namespace: this.namespace,
			username: auth['username'],
			password: auth['password'],
			company: auth['company']
		})
	};
};

ExigoClient.prototype = {
	call: function(method, parameters, continuation) {
		if(!continuation || continuation.constructor !== Function)
			continuation = function() {};

		var operation = method + 'Request';
		var action = this.namespace + method;
		var message = parameters ? parameters : {};

		foam(this.uri, operation, action, message, this.options, function(error, result) {
			if(error) return continuation(error);

			if(result['Fault'])
				return continuation(new ExigoError(result));

			return continuation(null, result[method + 'Result'] || result[method + 'Response'] || result);
		});
	}
};


module.exports.ExigoClient = ExigoClient;
module.exports.ExigoError = ExigoError;