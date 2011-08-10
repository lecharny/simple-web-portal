dojo.provide("swt.widget.table._Table");

dojo.require("dojo.i18n");
dojo.require("dojo.html");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._CssStateMixin");
dojo.require("dojox.string.Builder");
dojo.require("swt.widget.table._Pagination");
dojo.require("swt.widget.table.Toolbar");
dojo.require("swt.widget.table.ContextualToolbar");

//dojo.require("swt.widget.table._Layout");
//dojo.requireLocalization("dijit", "loading");
dojo.requireLocalization("swt", "swtnls");

dojo.declare('swt.widget.table._Table', [ dijit._Widget, dijit._Templated, dijit._CssStateMixin], {
	
	
	baseClass:"swtTable",
	templateString: dojo.cache("swt", "widget/table/templates/_Table.html"),
	widgetsInTemplate: true,
	rowsPerPage: 50,
	pages: 0,
	lazyLoad: true,
	autoWidth: false,
	height: 400,
	// column set for the table as specified in JSON.
	structure: null,
	// single, multiple.
	selectionMode: "single",

	// loadingMessage: String
	//  Message that shows while the grid is loading
	loadingMessage: "<span class='swtTableLoading'>${loadingState}</span>",

	// errorMessage: String
	//  Message that shows when the grid encounters an error loading
	errorMessage: "<span class='swtTableLoading'>${errorState}</span>",

	// noDataMessage: String
	//  Message that shows if the grid has no data - wrap it in a
	noDataMessage: "",
	
	editable: false,
	
	// store for the table, can be a dojo based store or a plain JSON data structure.
	store: null,
	
	// a layout that acts as outer container for the table.
	//layoutClass: "swt.widget.table._Layout",
		
	// pointer to layout widget instance.
	//layout: null,
	
	_paginationWidget: null,

	needPagination: true,
	// if set to false no toolbar is shown.
	needToolbar: true,
	
	toolbar: null,
	
	// if set to false no contextual toolbar is shown.
	needContextualToolbar: true,
	
	contextualToolbar: null,
	// table  title.
	
	tableTitle:"Table Title",
	// iconClass to be shown for the table.
	
	iconClass: "",
	
	constructor: function(arguments){
	},

	postMixInProperties: function(){
		this.inherited(arguments);
		var messages = dojo.i18n.getLocalization("swt", "swtnls", this.lang);
		this.loadingMessage = dojo.string.substitute(this.loadingMessage, messages);
		this.errorMessage = dojo.string.substitute(this.errorMessage, messages);
		// may not need this.
		if(this.srcNodeRef && this.srcNodeRef.style.height){
			this.height = this.srcNodeRef.style.height;
		}
	},

	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postCreate: function(){
		this.inherited(arguments);
		this._createLayout();
		//this._createTable();
	},
	
	startup: function(){
		this.inherited(arguments);
		//this.layout.startup();
		this._setStructure(this.structure);

	},
	
	_createTable: function(){
		
		
	},
	
	_setStructure: function(structure){
		// summary: create the column set for the table.
		var _self = this;
		var s = structure;
		var sb = new dojox.string.Builder();
		var st = "";//"<th>${column.label}</th>";
		//console.log("strucure::" + dojo.toJson(this.structure)); dojo.string.substitute(this.loadingMessage, messages);
		sb.append("<thead class='tableHeader'><tr>");
		dojo.forEach(structure.columns, function(column, idx, arr){
			st = "<th>${label}</th>";
			//console.log(column.label);
			st = dojo.string.substitute(st, column);
			sb.append(st);
		});
		sb.append("</thead></tr>");
		//console.log(sb);
		dojo.html.set(this.tableNode, sb.toString());
		//dojo.place(sb, this.tableNode, "first")
		
		this._structureChanged();
	},
	
	_structureChanged: function(){
		// called when columnset is changed.
		
	},
	
	_createLayout: function(){
		if(this.needPagination){
			this.setPagination();
		}
		if(this.needToolbar){
			this.setToolbar();
		}
		if(this.needContextualToolbar){
			this.setContextualToolbar();
		}
	},
	setPagination: function(/*widget*/pagination){
		// summary: adds pagination
		// pagination: a widget of type swt.widget.table._Pagination
		if(!pagination){
			this._paginationWidget = new swt.widget.table._Pagination({}, this.paginationAP);
			this._paginationWidget.startup();
		} else {
			this.paginationAP.appendChild(pagination.domNode);
		}
	},
	setContextualToolbar: function(/*widget*/toolbar){
		// summary : adds contextual toolbar
		// toolbar : should be an instance of swt.widget.table.ContextualToolbar or dijit.Toolbar.
		if(!toolbar){
			this.toolbar = new swt.widget.table.Toolbar({"class":"dijitInline"}, this.toolbarAP);
			this.toolbar.startup();
		} else {
			this.toolbarAP.appendChild(toolbar);
		}
	},
	setToolbar: function(/*widget*/toolbar){
		// summary : adds toolbar.
		// toolbar : should be an instance of swt.widget.table.Toolbar or dijit.Toolbar.
		if(!toolbar){
			this.contextualToolbar = new swt.widget.table.ContextualToolbar({}, this.contextualToolbarAP);
			this.contextualToolbar.startup();
		} else {
			this.toolbarAP.appendChild(toolbar);
		}
	}
	
});
