dojo.provide("swt.widget.table.Filter");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.ComboBox");
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
	
	_filterTypes: {
		"boolean":"boolean",
		"string":"string",
		"number":"number",
		"datetime":"datetime" 
	},
	// operation available for for various filter types.
	// filterType	operations key
	// boolean		boolean
	// number		number
	// datetime		number
	// string		string
	_operations : {
		"boolean" : {
			"true" : true,
			"false" : false
		},
		"number" : {
			"equal" : "equal",
			"not-equal" : "not-equal",
			"greater-then" : "greater-then",
			"greater-then-euqal-to" : "greater-then-euqal-to",
			"less-then" : "less-then",
			"less-then-equal-to" : "greater-then"
		},
		"string" : {
			"contains" : "contains",
			"does-not-contain" : "does-not-contain",
			"starts-with" : "starts-with",
			"ends-with" : "ends-with",
			"empty" : "empty",
			"not-empty" : "not-empty",
			"equal" : "equal",
			"not-equal" : "not-equal",
			"greater-then" : "greater-then",
			"greater-then-euqal-to" : "greater-then-euqal-to",
			"less-then" : "less-then",
			"less-then-equal-to" : "greater-then"
		}
	},
	
	_operationsMarkup: {},
	
	_ddBoolean:"",
	
	_ddString:"",
	
	_ddNumber:"",
	
	_conditionCounter:1,
	
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
		//var xx = '{identifier:"abbreviation",label: "name",items: [{name:"Alabama", label:"Alabama",abbreviation:"AL"},{name:"Alaska", label:"Alaska",abbreviation:"AK"},{name:"Wyoming", label:"Wyoming",abbreviation:"WY"}]}';
		//var xxObj = dojo.fromJson(xx);
		//this.columnStore = new dojo.data.ItemFileReadStore({data:this._csJson});
		//this.columnStore = new dojo.data.ItemFileReadStore({data:xxObj});
		
		this._createOperationDropdowns();
	},
	_render: function(){
//		var _fi = new swt.widget.table.FilterItem({columnStore: this._csJson});
//		this.filterTableBodyAP.appendChild(_fi.domNode);
	},
	addCondition: function(evt){
		var _fi = new swt.widget.table.FilterItem({columnStore: this._csJson, "_filter" : this, "counter": this._conditionCounter++});
		this.filterTableBodyAP.appendChild(_fi.domNode);
		this.connect(_fi,"destroy", dojo.hitch(this, "_resetConditionIndexes"));
	},
	filterTable: function(evt){
		this.table.showFilter();
	},
	
	getOperations: function(/*string*/ filterType){
		// summary: determines the filter mark-up from filter type.
		var _r;
		switch(filterType) {
		case this._filterTypes.boolean:
		  _r = this._operationsMarkup.boolean;
		  break;
		case this._filterTypes.number || this._filterTypes.datetime:
		  _r = this._operationsMarkup.number;
		  break;
		default:
		  _r = this._operationsMarkup.string;
		}
		
		return _r;
	},
	_createOperationDropdowns: function(){
		// summary: creates the markup for drop downs needed for operations.
		var _m = this.table.messages;
		var sb = new dojox.string.Builder();
		sb.append('<select class="operationSelect" dojoType="dijit.form.ComboBox">');
		for (var key in this._operations.boolean) {
			sb.append("<option value='" + key +"'>"+ _m[this._operations.boolean[key]] +"</option>");
		}
		sb.append("</select>");
		this._operationsMarkup.boolean = sb.toString();
		
		sb = new dojox.string.Builder();
		sb.append('<select class="operationSelect" dojoType="dijit.form.ComboBox">');
		for (var key in this._operations.number) {
			sb.append("<option value='" + key +"'>"+ _m[this._operations.number[key]] +"</option>");
		}
		sb.append("</select>");
		this._operationsMarkup.number = sb.toString();

		sb = new dojox.string.Builder();
		sb.append('<select class="operationSelect" dojoType="dijit.form.ComboBox">');
		for (var key in this._operations.string) {
			sb.append("<option value='" + key +"'>"+ _m[this._operations.string[key]] +"</option>");
		}
		sb.append("</select>");
		this._operationsMarkup.string = sb.toString();
	},
	_resetConditionIndexes: function(){
		dojo.forEach(this.filterTableBodyAP.rows, function(row, idx, arr){
			row.cells[0].innerHTML=(idx+1);
		});
		this._conditionCounter = this.filterTableBodyAP.rows.length+1;
		console.log("RESET CONDITION INDEXES");
	},
	cancel: function(evt){
		// summary: cancels the filer.
		console.log("Cancel Filter!");
	},
	_onFilter: function(evt){
		console.log("Invoke Filter!");
		var _r = {};
		_r.conjunction = "";
		var _fi, _expObj;
		var _exp = [];
		dojo.forEach(this.filterTableBodyAP.rows, function(row, idx, arr){
			_expObj = {};
			_fi = dijit.byNode(row);
			if(_fi){
				var si = parseInt(dojo.attr(_fi._columnDropdown.item || _fi._columnDropdown.store.fetchSelectedItem(), "select-index"));
				var  _c = _fi.columnStore.items[si];
				_expObj.op = _fi._operationDropdown.value;
				_expObj.attr = _c.attr;
				_expObj.filterType = _c.filterType || "strings";
				_expObj.value = _fi.valueAP.value;
				_exp.push(_expObj);
				//console.log("onFilter::" + dojo.toJson(_c));
			}
		});
		_r.expressions = _exp;
		this.onFilter(_r);
		
	},
	onFilter: function(/*Object*/ filter){
		// summary: callback for getting filter details.
	}
	
	
});


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

	_filter: null,
	
	_columnDropdown:"",
	
	_operationDropdown:null,
	
	counter: 1,
	
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
//		  this._columnCB = new dijit.form.ComboBox({
//	            name: "state",
//	            value: "Alabama",
//	            store: this.columnStore,
//	            searchAttr: "name",
//	            style:"width:75px;"
//	      });	
//		this.columnAP.appendChild(this._columnCB.domNode);
		var sb = new dojox.string.Builder();
		var st = "";//"<th>${column.label}</th>";
		sb.append('<select class="columnSelect" dojoType="dijit.form.ComboBox" name="columns">');
		var item;
		for(var i=0; i<this.columnStore.items.length; i++){
			item = this.columnStore.items[i];
			st = "<option value='" + item.attr +"' select-index='"+ i +"'>"+ item.label +"</option>";
			sb.append(st);
		}
		sb.append("</select>");
		//console.log(sb.toString());
		dojo.html.set(this.columnAP, sb.toString());
		dojo.parser.parse(this.columnAP);

		this._columnDropdown = dijit.findWidgets(this.columnAP)[0];
		this.connect(this._columnDropdown,"onChange", dojo.hitch(this, "onChangeColumn"));
		this.onChangeColumn();
		//var xx = _w.get("value");
		//var xxx = _w.store.fetchSelectedItem();
		//var zz = "";
		//dojo.html.set(this.operatorAP, this._filter.getOperations(item.filterType));
		
	},
	removeCondition: function(evt){
		console.log("removeCondition");
		if(this._columnDropdown && this._columnDropdown.destroy){
			this._columnDropdown.destroy();
		}
		this.destroyOperations();
		this.destroy();
	},
	onChangeColumn: function(item){
		this.destroyOperations();
		var si = parseInt(dojo.attr(this._columnDropdown.item||this._columnDropdown.store.fetchSelectedItem(), "select-index"));
		var  _c = this.columnStore.items[si];
		dojo.html.set(this.operatorAP, this._filter.getOperations(_c.filterType));
		dojo.parser.parse(this.operatorAP);
		this._operationDropdown = dijit.findWidgets(this.operatorAP)[0];
		console.log("onChangeColumn::" + this._filter.getOperations(_c.filterType));
	},
	destroyOperations: function(){
		var _w = dijit.findWidgets(this.operatorAP)[0];
		if(this._operationDropdown && this._operationDropdown.destroy){
			this._operationDropdown.destroy();
		}
	}
});