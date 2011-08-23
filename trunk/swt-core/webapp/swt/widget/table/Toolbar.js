dojo.provide("swt.widget.table.Toolbar");

dojo.require("dijit.Toolbar");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.Menu");
dojo.require("dijit.CheckedMenuItem");

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
		this._render();
	},
	
	refreshTable: function(evt){
		this.table.refresh(evt);
	},
	_render: function(){
		var _menu = new dijit.Menu({label:"Structure Menu", showLabel:false});
		var structure = this.table.structure;
		dojo.forEach(structure.columns, function(column, idx, arr){
			if(column.isSelector || column.isRowCounter){
				// no need to hide these.
			} else {
				_menu.addChild(new dijit.CheckedMenuItem({label:column.label}));
			}
		});
		_menu.startup();
		dojo.place(_menu.domNode, this.settingsContentAP.domNode, "first");
		this.connect(_menu, "onClick", dojo.hitch(this, "_onMenuClick"));
	},
	_onMenuClick: function(evt){
		console.log("clicked on menu.");
	},
	_ok: function(evt){
		console.log("clicked on ok.");
		
	},
	_cancel: function(evt){
		console.log("clicked on cancel.");
		
	}

	
});