dojo.provide("swt.widget.table._Pagination");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");

dojo.declare('swt.widget.table._Pagination', [dijit._Widget, dijit._Templated], {

	baseClass:"swtTablePagination",
	templateString: dojo.cache("swt", "widget/table/templates/_Pagination.html"),
	widgetsInTemplate: true,
	// reference to table to do pagination for.
	table: null,
	/////////////////////
	// NLS Labels START//
	/////////////////////
	pgnof : "pgnof",
	pgnRowsPerPage :"pgnRowsPerPage",
	pgnGotoPage :"pgnGotoPage",
	pgnPrivious :"pgnPrivious",
	pgnNext : "pgnNext",
	pgnHitEnter : "pgnHitEnter",
	/////////////////////
	// NLS Labels END////
	/////////////////////
	
	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
		var _m = this.table.messages;
		this.pgnof = (_m[this.pgnof])?_m[this.pgnof]:"of";
		this.pgnRowsPerPage = (_m[this.pgnRowsPerPage])?_m[this.pgnRowsPerPage]:"Rows/page";
		this.pgnGotoPage = (_m[this.pgnGotoPage])?_m[this.pgnGotoPage]:"Go to page";
		this.pgnPrivious = (_m[this.pgnPrivious])?_m[this.pgnPrivious]:"Privious";
		this.pgnNext = (_m[this.pgnNext])?_m[this.pgnNext]:"Next";
		this.pgnHitEnter = (_m[this.pgnHitEnter])?_m[this.pgnHitEnter]:"Hit enter to load";
	},
	
	postCreate: function(){
		this.inherited(arguments);
	},
	
	priviousPage: function(evt){
		this.table.priviousPage(evt);
	},
	nextPage: function(evt){
		this.table.nextPage(evt);
	},
	_onKeyPressRowsPerPage: function(evt){
		if (evt.keyCode == dojo.keys.ENTER) {
			this.table.rowsPerPage = parseInt(this.rowsPerPageAP.get("value"));
			//console.log("Fired _onKeyPressRowsPerPage--> Rows per page::" + this.rowsPerPageAP.get("value"));
			dojo.stopEvent(evt);
		}
	},
	_onKeyPressGotoPage: function(evt){
		if (evt.keyCode == dojo.keys.ENTER) {
			this.table.showPage = parseInt(this.gotoPageAP.get("value"));
			//console.log("Fired _onKeyPressGotoPage--> go to page::" + this.gotoPageAP.get("value"));
			this.table._xxx();
			dojo.stopEvent(evt);
		}
	}
	
});