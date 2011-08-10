dojo.provide("swt.widget.table.ContextualToolbar");

dojo.require("dijit.Toolbar");

dojo.declare('swt.widget.table.ContextualToolbar', [dijit.Toolbar], {

	baseClass:"swtTableContextualToolbar",
	templateString: dojo.cache("swt", "widget/table/templates/ContextualToolbar.html"),
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