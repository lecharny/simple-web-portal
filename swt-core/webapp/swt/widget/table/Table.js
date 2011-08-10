dojo.provide("swt.widget.table.Table");

dojo.require("swt.widget.table._Table");

dojo.declare('swt.widget.table.Table', [swt.widget.table._Table], {
	
	// store for the table, can be a dojo based store or a plain JSON data structure.
	store: null,

	query: null,
	
	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
	},
	
	postCreate: function(){
		this.inherited(arguments);
	}
	
});