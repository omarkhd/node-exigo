# node-exigo

----
## what is node-exigo?

> node-exigo is an easy-to-use Exigo API client ([http://api.exigo.com/3.0/](http://api.exigo.com/3.0/))

----
## install
	npm install exigo --save

----
## usage

	var ExigoClient = require('exigo').ExigoClient;
	
	var exigo = new ExigoClient({
		username: 'myloginname',
		password: 'mypassword',
		company: 'mycompany'
	});
	
	var parameters =  {
		'SomeExigoMethodOption': 'somevalue'
	};
	
	exigo.call('GetItems', parameters, function(error, items) {
		if(error) throw new Error(error);
		
		items.forEach(function(item) {
			console.log(item);
		});
	});

Note: if you encounter some error like ```Error: Could not locate the bindings file. Tried:```, and a long stacktrace, this is not a ```node-exigo``` error, it comes from the ```libxmljs``` library that comes with ```node-foam```, some information about that issue is in:

* [https://github.com/polotek/libxmljs/issues/253](https://github.com/polotek/libxmljs/issues/253)
* [https://github.com/TooTallNate/node-gyp/issues/543](https://github.com/TooTallNate/node-gyp/issues/543)

A workaround to this issue is:

* in the node_modules directory, navigate to the ```libxmljs``` module
* edit the file binding.gyp and delete the lines where the ```product_extension``` and ```type``` options are
* rebuild the module with ```node-gyp rebuild```

----
## thanks
* [foam](https://lodash.com)