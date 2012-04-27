
if(!dojo.instrumentation){
	dojo.instrumentation = {};
}

dojo.instrumentation.niu = {};
dojo.instrumentation.niu.inUse = [];
dojo.instrumentation.niu.notInUse = [];

dojo.instrumentation.loadedWithRequire = [];

dojo.instrumentation.calculateDojoUse = function (){
	var lm = dojo._loadedModules;
	var widgets = dijit.registry._hash;
	var _iu = dojo.instrumentation.niu.inUse;
	var _niu = dojo.instrumentation.niu.notInUse; 
	for(var propertyName in lm) {
		for(var _w in widgets){
			var _o = widgets[_w];
			var _c = _o.declaredClass;
			if(propertyName == _c){
				_iu.push(); 
				console.log("In use id -->" + _w + " class is -->" + _c);
			} else {
				_niu[_c] = _c;
			}
		}
	}
	
};

//patch the dojo require here
dojo._oldRequire = dojo.require;

dojo.require = function(/*String*/moduleName, /*Boolean?*/omitModuleCheck){
	dojo.instrumentation.loadedWithRequire.push(moduleName);
	//console.log("xxx-" + moduleName);
	return dojo._oldRequire(moduleName, omitModuleCheck);
};

dojo.instrumentation.logDojoUse = function(prittyPrint){
	if(prittyPrint){
		dojo.toJson(dojo.instrumentation.niu, true);
	} else {
		for(var propertyName in dojo.instrumentation.niu) {
			console.log("Not In use-->" + propertyName);
		};
	}
};

dojo.instrumentation.logLoadedWithRequire = function logLoadedWithRequire(){
	for(var i=0; i<dojo.instrumentation.loadedWithRequire; i++) {
		console.log( i + ". " + dojo.instrumentation.loadedWithRequire[i]);
	};
};