dojo.provide("swt.widget.table.Toolbar");

dojo.require("dijit.Toolbar");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DropDownButton");

dojo.declare('swt.widget.table.Toolbar', [dijit.Toolbar], {

	baseClass:"swtTableToolbar",
	templateString: dojo.cache("swt", "widget/table/templates/Toolbar.html"),
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