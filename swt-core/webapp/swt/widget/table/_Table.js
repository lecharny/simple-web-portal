dojo.provide("swt.widget.table._Table");

dojo.require("dojo.i18n");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("swt.widget.table._Layout");

dojo.requireLocalization("dijit", "loading");

dojo.declare('swt.widget.table._Table', [ dijit._Widget, dijit._Templated], {
	
	
	baseClass:"swtTable",
	templateString: dojo.cache("swt", "widget/table/templates/_Table.html"),
	rowsPerPage: 50,
	pages: 0,
	lazyLoad: true,
	autoWidth: false,
	height: 400,
	// column set for the table as specified in JSON.
	columnSet: null,
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
	_layoutClass: "swt.widget.table._Layout",
	
	toolbar: swt.widget.table.Toolbar,
	
	contextualToolbar: swt.widget.table.ContextualToolbar,
	
	constructor: function(arguments){
		var xx = "";
	},
	
	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postMixInProperties: function(){
		this.inherited(arguments);
		var messages = dojo.i18n.getLocalization("dijit", "loading", this.lang);
		this.loadingMessage = dojo.string.substitute(this.loadingMessage, messages);
		this.errorMessage = dojo.string.substitute(this.errorMessage, messages);
		// may not need this.
		if(this.srcNodeRef && this.srcNodeRef.style.height){
			this.height = this.srcNodeRef.style.height;
		}
	},
	
	postCreate: function(){
		this.inherited(arguments);
	}

	
});
