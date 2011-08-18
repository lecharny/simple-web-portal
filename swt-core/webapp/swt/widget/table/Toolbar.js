dojo.provide("swt.widget.table.Toolbar");

dojo.require("dijit.Toolbar");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DropDownButton");

dojo.declare('swt.widget.table.Toolbar', [dijit.Toolbar], {

	baseClass:"swtTableToolbar",
	templateString: dojo.cache("swt", "widget/table/templates/Toolbar.html"),
	widgetsInTemplate: true,
	// reference to table this tool-bar is for.
	table: null,
	
	/////////////////////
	// NLS Labels START//
	/////////////////////
	refresh : "refresh",
	settings :"settings",
	/////////////////////
	// NLS Labels END////
	/////////////////////

	
	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
		var _m = this.table.messages;
		this.refresh = (_m[this.refresh])?_m[this.refresh]:"Refresh";
		this.settings = (_m[this.settings])?_m[this.settings]:"Settings";
	},
	
	postCreate: function(){
		this.inherited(arguments);
		//this.connect(this.refreshAP, "onClick", dojo.hitch(this, "refreshTable"));
	},
	
	refreshTable: function(evt){
		this.table.refresh(evt);
	}
	
});