dojo.provide("swt.widget.table.ContextualToolbar");

dojo.require("dijit.Toolbar");

dojo.declare('swt.widget.table.ContextualToolbar', [dijit.Toolbar], {

	baseClass:"swtTableContextualToolbar",
	templateString: dojo.cache("swt", "widget/table/templates/ContextualToolbar.html"),
	widgetsInTemplate: true,
	/////////////////////
	// NLS Labels START//
	/////////////////////
	labelEdit: "Edit",
	labelDelete: "Delete",
	labelAddRow:"Add Row",
	labelClearSelection:"Clear Selections",
	/////////////////////
	// NLS Labels END////
	/////////////////////
	// reference to table this toolbar is for.
	table: null,
	
	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
	},
	
	postCreate: function(){
		this.inherited(arguments);
	},
	
	edit: function(evt){
		this.table.edit();
	},
	deleteRow: function(evt){
		this.table.deleteRow();
	},
	addRow: function(evt){
		this.table.addRow();
	},
	clearSelection: function(evt){
		this.table.clearSelection();
	}
	
});