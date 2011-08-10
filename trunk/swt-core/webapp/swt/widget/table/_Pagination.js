dojo.provide("swt.widget.table._Pagination");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");

dojo.declare('swt.widget.table._Pagination', [dijit._Widget, dijit._Templated], {

	baseClass:"swtTablePagination",
	templateString: dojo.cache("swt", "widget/table/templates/_Pagination.html"),
	widgetsInTemplate: true,
	
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