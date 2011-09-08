dojo.provide("swt.widget.table.Toolbar");

dojo.require("dijit.Toolbar");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Button");
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
	filter: "filter",
	refresh : "refresh",
	settings :"settings",
	close:"Close",
	/////////////////////
	// NLS Labels END////
	/////////////////////

	_menu: null,
	
	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
		var _m = this.table.messages;
		this.filter = (_m[this.filter])?_m[this.filter]:"Filter";
		this.refresh = (_m[this.refresh])?_m[this.refresh]:"Refresh";
		this.settings = (_m[this.settings])?_m[this.settings]:"Settings";
		this.close = (_m[this.close])?_m[this.close]:"Close";
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
		var _self = this;
		this._menu = new dijit.Menu({label:"Structure Menu", showLabel:false});
		var structure = this.table.structure;
		dojo.forEach(structure.columns, function(column, idx, arr){
			if(column.isSelector || column.isRowCounter){
				// no need to hide these.
			} else {
				var _args = {label:column.label, onClick: dojo.hitch(_self, "_onMenuClick"), _columnIndex: idx};
				if(column.hidden){
					_args.checked = false;
				} else {
					_args.checked = true;
				}
				_self._menu.addChild(new dijit.CheckedMenuItem(_args));
			}
		});
		//_menu.startup();
		dojo.place(this._menu.domNode, this.settingsContentAP.domNode, "first");
		//this.connect(this._menu, "onClick", dojo.hitch(this, "_onMenuClick"));
		var _okButton = new dijit.form.Button({label:this.close, onClick: dojo.hitch(this, "_close")});
		dojo.place(_okButton.domNode, this.actionsAP, "last");
	},
	_onMenuClick: function(evt){
		var _mi = dijit.byNode(evt.currentTarget);
		if(_mi._columnIndex){
			if(_mi.get("checked")){
				this.table.showColumn(this._menu.getIndexOfChild(_mi));
			} else {
				this.table.hideColumn(this._menu.getIndexOfChild(_mi));
			}
			//console.log("Clicked on menu item-->" + this.table.structure.columns[_mi._columnIndex].label + " INDEX " + this._menu.getIndexOfChild(_mi));
		}
	},
	_ok: function(evt){
		console.log("clicked on ok.");
		
	},
	_close: function(evt){
		this.settingsAP.closeDropDown();
	},
	filterTable: function(evt){
		this.table.showFilter(evt);
	},
	clearFilter: function(evt){
		this.table.clearFilter(evt);
	}
	
});