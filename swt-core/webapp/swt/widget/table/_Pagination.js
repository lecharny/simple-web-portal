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
	_countsTemplate: "<span>${startRow}</span><span>-</span><span>${endRow}</span><span class='pgnOf'>${pgnof}</span><span>${totalRows}</span>",
	
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
	startup: function(){
		this.inherited(arguments);
		this.reset();
	},
	priviousPage: function(evt){
		this.table.resetTableView(null, (this.table.showPage-1));
		this.reset();
	},
	nextPage: function(evt){
		this.table.resetTableView(null, (this.table.showPage+1));
		this.reset();
	},
	_onKeyPressRowsPerPage: function(evt){
		if (evt.keyCode == dojo.keys.ENTER) {
			this.table.rowsPerPage = parseInt(this.rowsPerPageAP.get("value"));
			//console.log("Fired _onKeyPressRowsPerPage--> Rows per page::" + this.rowsPerPageAP.get("value"));
			this.table.resetTableView(parseInt(this.rowsPerPageAP.get("value")), parseInt(this.gotoPageAP.get("value")));
			this.reset();
			dojo.stopEvent(evt);
		}
	},
	_onKeyPressGotoPage: function(evt){
		if (evt.keyCode == dojo.keys.ENTER) {
			this.table.showPage = parseInt(this.gotoPageAP.get("value"));
			//console.log("Fired _onKeyPressGotoPage--> go to page::" + this.gotoPageAP.get("value"));
			this.table.resetTableView(parseInt(this.rowsPerPageAP.get("value")), parseInt(this.gotoPageAP.get("value")));
			this.reset();
			dojo.stopEvent(evt);
		}
	},
	
	reset: function(){
		this.resetActions();
		this.updatesCounts();
	},
	resetActions: function(){
		// summary: resets the pagination actions.
		
		// if showPage==1 disable the privious button.
		if(this.table.showPage<=1){
			this.priviousAP.set("disabled", true);
		} else {
			this.priviousAP.set("disabled", false);
		}
		// if showPage==1 disable the privious button.		
		if(this.table.showPage==this.table._pages){
			this.nextAP.set("disabled", true);
		} else {
			this.nextAP.set("disabled", false);
		}
	},
	updatesCounts: function(/*Object*/ counts){
		// summary: updates the counts.
		// counts: an Object {startRow: 1, endRow:20,totalRows: 200}
		var _c = counts;
		var _t = this.table;
		if(!_c){
			_c = {};
			_c.startRow = ((_t.showPage-1)*_t.rowsPerPage)+1;
			_c.endRow = _t.showPage*_t.rowsPerPage;
			_c.totalRows = _t.store.data.length;
			if(_c.endRow > _c.totalRows){
				_c.endRow = _c.totalRows
			}
		}
		dojo.mixin(_c, {pgnof: this.pgnof});
		var _s = this._countsTemplate;
		_s = dojo.string.substitute(_s, _c);
		this.countsAP.innerHTML = _s;
		
		this.rowsPerPageAP.set("value", _t.rowsPerPage);
		this.gotoPageAP.set("value", _t.showPage);
	}
	
});
