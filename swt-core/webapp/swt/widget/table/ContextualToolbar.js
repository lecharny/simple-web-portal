dojo.provide("swt.widget.table.ContextualToolbar");

dojo.require("dijit.Toolbar");

dojo.declare('swt.widget.table.ContextualToolbar', [dijit.Toolbar], {

	baseClass:"swtTableContextualToolbar",
	templateString: dojo.cache("swt", "widget/table/templates/ContextualToolbar.html"),
	widgetsInTemplate: true,
	/////////////////////
	// NLS Labels START//
	/////////////////////
	edit: "edit",
	_delete: "delete",
	addRow:"addRow",
	clearSelection:"clearSelection",
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
		var _m = this.table.messages;
		this.edit = (_m[this.edit])?_m[this.edit]:"Edit";
		this._delete = (_m[this._delete])?_m[this._delete]:"Delete";
		this.addRow = (_m[this.addRow])?_m[this.addRow]:"Add Row";
		this.clearSelection = (_m[this.clearSelection])?_m[this.clearSelection]:"Clear Selection";
	},
	
	postCreate: function(){
		this.inherited(arguments);
	},
	
	_edit: function(evt){
		this.table.edit();
	},
	_deleteRow: function(evt){
		this.table.deleteRow();
	},
	_addRow: function(evt){
		this.table.addRow();
	},
	_clearSelection: function(evt){
		this.table.clearSelection();
	}
	
});