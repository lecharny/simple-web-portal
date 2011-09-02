dojo.provide("swt.widget.table.Filter");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.form.Select");
dojo.require("dijit.Menu");
dojo.require("dijit.form.TextBox");
dojo.require("dojo.data.ItemFileReadStore");

dojo.declare('swt.widget.table.Filter', [dijit._Widget, dijit._Templated], {
	baseClass:"swtTableFilter",
	templateString: dojo.cache("swt", "widget/table/templates/Filter.html"),
	widgetsInTemplate: true,
	// reference to table this filter is for.
	table: null,
	
	/////////////////////
	// NLS Labels START//
	/////////////////////
	filter: "filter",
	close:"Close",
	/////////////////////
	// NLS Labels END////
	/////////////////////

	columnStore: null,
	
	_csJson: null,
	
	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
		var _m = this.table.messages;
		this.filter = (_m[this.filter])?_m[this.filter]:"Filter";
		this.close = (_m[this.close])?_m[this.close]:"Close";
	},
	
	postCreate: function(){
		this.inherited(arguments);
		this.initialize();
		this._render();
	},
	initialize: function(){
//		for(var i=0; i<this.table.structure.columns.length; i++){
//			var item = this.table.structure.columns[i];
//			console.log(item.label +"-"+ item.attr);
//		}
		this._csJson = {};
		this._csJson.identifier = "attr";
		this._csJson.label = "label";
		this._csJson.items = this.table.structure.columns.slice(2);
		//var columnStore = new dojo.store.Memory({data:csJson.items, idProperty: csJson.identifier});
		var xx = '{identifier:"abbreviation",label: "name",items: [{name:"Alabama", label:"Alabama",abbreviation:"AL"},{name:"Alaska", label:"Alaska",abbreviation:"AK"},{name:"Wyoming", label:"Wyoming",abbreviation:"WY"}]}';
		var xxObj = dojo.fromJson(xx);
		//this.columnStore = new dojo.data.ItemFileReadStore({data:this._csJson});
		this.columnStore = new dojo.data.ItemFileReadStore({data:xxObj});
	},
	_render: function(){
		var _fi = new swt.widget.table.FilterItem({columnStore: this.columnStore});
		this.filterTableBodyAP.appendChild(_fi.domNode);
	},
	filterTable: function(evt){
		this.table.showFilter();
	}
	
});


dojo.require("dijit.form.ComboBox");
dojo.declare('swt.widget.table.FilterItem', [dijit._Widget, dijit._Templated], {
	baseClass:"swtTableFilterItem",
	templateString: dojo.cache("swt", "widget/table/templates/FilterItem.html"),
	widgetsInTemplate: true,
	
	/////////////////////
	// NLS Labels START//
	/////////////////////
	filter: "filter",
	close:"Close",
	/////////////////////
	// NLS Labels END////
	/////////////////////
	
	columnStore: null,
	
	operatorStore: null,
	
	_columnCB: null,

	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
		//var _m = this.table.messages;
		//this.filter = (_m[this.filter])?_m[this.filter]:"Filter";
		//this.close = (_m[this.close])?_m[this.close]:"Close";
	},
	
	postCreate: function(){
		this.inherited(arguments);
		this._render();
	},
	_render: function(){
//		  this._columnCB = new dijit.form.Select({
//	            name: "label",
//	            value: "attr",
//	            store: this.columnStore,
//	            searchAttr: "label"
//	      });
		  this._columnCB = new dijit.form.ComboBox({
	            name: "state",
	            value: "Alabama",
	            store: this.columnStore,
	            searchAttr: "name",
	            style:"width:75px;"
	        });
		  this.columnAP.appendChild(this._columnCB.domNode);
	},
	removeCondition: function(evt){
		console.log("removeCondition");
	}
	
});