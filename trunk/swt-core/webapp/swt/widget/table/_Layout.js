dojo.provide("swt.widget.table._Layout");

dojo.require("swt.widget.table._Layout");
dojo.require("dijit._CssStateMixin");
dojo.require("swt.widget.table._Pagination");
dojo.require("swt.widget.table.Toolbar");
dojo.require("swt.widget.table.ContextualToolbar");

dojo.declare('swt.widget.table._Layout', [ dijit._Widget, dijit._Templated, dijit._CssStateMixin ], {
	
	baseClass:"swtTableLayout",
	templateString: dojo.cache("swt", "widget/table/templates/_Layout.html"),
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
	// the table instance hosted by this layout.
	table: null,
	
	postCreate: function(){
		this.inherited(arguments);
	}, 
	
	startup: function(){
		this.inherited(arguments);
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