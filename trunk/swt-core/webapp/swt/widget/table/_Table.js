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
	_sizeCache: null,

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
	
	_paginationTop: null,
	
	_paginationBottom: null,

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
	// holds the css classes used in the table.
	
	_css: {
		"layout":"swtTableLayout",
		"title": "tableTitle",
		"ctxtba": "ctxTooolbarArea",
		"container": "containerNode",
		"table": "tableNode",
		"bottom":"bottomArea",
		"thead":"tableHeader",
		"tbody":"tableBody",
		"odd":"oddRow",
		"even":"evenRow"
	},
	
	constructor: function(arguments){
	},

	postMixInProperties: function(){
		this.startTime = new Date();
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
		this._computeSize();
		this._setStructure(this.structure);
		this.render();
	},
	
	startup: function(){
		this.inherited(arguments);
		//this.layout.startup();
		this.resize();
	},
	
	render: function(){
		this.setMessage("Rendering table...");
		this.tbody = dojo.create("tbody", {"class": this._css.tbody});
		dojo.place(this.tbody, this.tableNode, "last");
		//var sb = new dojox.string.Builder();
		//sb.append("<tbody class='tableBody'>");
		var _self = this;
		if(this.store && this.store.data){
			dojo.forEach(this.store.data, function(row, idx, arr){
				try{
					var rb = new dojox.string.Builder();
					var _rcls = (idx%2==0) ? _self._css.even : _self._css.odd; 
					rb.append("<tr class='"+_rcls +"'>");
					//rb.append("<tr>");
					dojo.forEach(structure.columns, function(column, idxIn, arr){
						//var _r = "<td>${" + column.attr + "}</td>";
						rb.append("<td>${" + column.attr + "}</td>");
					});
					rb.append("</tr>");
					var _r = rb.toString();
					_r = dojo.string.substitute(_r, row);
					dojo.place(_r, _self.tbody, "last");
					//console.log("Arow::(" + idx + ")::" + _r);
				} catch(error){
					console.error("Failed adding row ::" + row.InstanceId);
				}
			});
			
		}
		console.log("render(ts)-->"+ (new Date().getTime() - this.startTime));
		this.setMessage("Rendered table in " + (new Date().getTime() - this.startTime) + "ms", 4000);
	},
	
	_setStructure: function(structure){
		// summary: create the column set for the table.
		this.setMessage("Creating structure...");
		var _self = this;
		var s = structure;
		var sb = new dojox.string.Builder();
		var st = "";//"<th>${column.label}</th>";
		//console.log("strucure::" + dojo.toJson(this.structure)); dojo.string.substitute(this.loadingMessage, messages);
		sb.append("<thead class='");sb.append(this._css.thead);sb.append("'><tr>");
		//sb.append("<thead class='tableHeader'><tr>");
		dojo.forEach(structure.columns, function(column, idx, arr){
			//console.log(column.label);
			st = "<th>${label}</th>";
			st = dojo.string.substitute(st, column);
			sb.append(st);
		});
		sb.append("</thead></tr>");
		//console.log(sb);
		dojo.html.set(this.tableNode, sb.toString());
		//dojo.place(sb, this.tableNode, "first")
		
		this._structureChanged();
		console.log("_setStructure(ts)-->"+ (new Date().getTime() - this.startTime));
	},
	
	_structureChanged: function(){
		// called when columnset is changed.
		
	},
	
	_createLayout: function(){
		this.setMessage("Creating layout...");
		if(this.needPagination){
			this.setPagination();
		}
		if(this.needToolbar){
			this.setToolbar();
		}
		if(this.needContextualToolbar){
			this.setContextualToolbar();
		}
		console.log("_createLayout(ts)-->"+ (new Date().getTime() - this.startTime));
	},
	setPagination: function(/*widget*/pagination, /*String*/location){
		// summary: adds pagination
		// pagination: a widget of type swt.widget.table._Pagination
		// location: String (top, bottom or both)
		if(!pagination){
			if(!this.structure.pagination || this.structure.pagination=="bottom"){
				this._paginationBottom = new swt.widget.table._Pagination({"class":"paginationBottom dijitInline"}, this.paginationBottom);
				this._paginationBottom.startup();
			} 
			if(this.structure.pagination=="top"){
				this._paginationTop = new swt.widget.table._Pagination({"class":"paginationTop dijitInline"}, this.paginationTop);
				this._paginationTop.startup();
			}
			if(this.structure.pagination=="both"){
				this._paginationBottom = new swt.widget.table._Pagination({"class":"paginationBottom dijitInline"}, this.paginationBottom);
				this._paginationBottom.startup();
				this._paginationTop = new swt.widget.table._Pagination({"class":"paginationTop dijitInline"}, this.paginationTop);
				this._paginationTop.startup();
			}
		} else {
			this.pagination.appendChild(pagination.domNode);
		}
	},
	setToolbar: function(/*widget*/toolbar){
		// summary : adds contextual toolbar
		// toolbar : should be an instance of swt.widget.table.ContextualToolbar or dijit.Toolbar.
		if(!toolbar){
			this.toolbar = new swt.widget.table.Toolbar({"class":"dijitInline"}, this.toolbar);
			this.toolbar.startup();
		} else {
			this.toolbar.appendChild(toolbar);
		}
	},
	setContextualToolbar: function(/*widget*/toolbar){
		// summary : adds toolbar.
		// toolbar : should be an instance of swt.widget.table.Toolbar or dijit.Toolbar.
		if(!toolbar){
			this.contextualToolbar = new swt.widget.table.ContextualToolbar({"class":"dijitInline"}, this.contextualToolbar);
			this.contextualToolbar.startup();
		} else {
			this.contextualToolbar.appendChild(toolbar);
		}
	},
	_computeSize: function(){
		this._sizeCache = {};
		this._sizeCache.titleArea = dojo.position(this.titleArea);
		this._sizeCache.ctxToolbarArea = dojo.position(this.ctxToolbarArea);
		this._sizeCache.paginationArea = dojo.position(this.paginationArea);
		this._sizeCache.domNode = dojo.position(this.domNode);
		var correction = {};
		try{
			correction.h = Math.round(this._sizeCache.titleArea.h + this._sizeCache.ctxToolbarArea.h + this._sizeCache.paginationArea.h);			
		} catch (e) {
			correction.h = 27*3;
		}
		this._sizeCache.correction = correction;
		console.log("_computeSize(ts)-->"+ (new Date().getTime() - this.startTime));
	},
	
	setMessage: function(/*String*/ message, /*int*/cleanAfter){
		// summary: set a message in the message area.
		// message: String a message
		// cleanAfter: int Time in ms after which remove the message.
		if(dojo.isString(message)){
			this.messageArea.innerHTML = message;			
		} else {
			this.messageArea.innerHTML = message.toString();
		}
		if(cleanAfter || !isNaN(cleanAfter)){
			setTimeout(dojo.hitch(this, "cleanMessage"), cleanAfter);
		}
	},
	
	cleanMessage: function(/*int*/cleanAfter){
		// summary: cleans the message.
		this.messageArea.innerHTML="";
	},
	resize: function(changeSize, resultSize){
		if(resultSize){
			
		}
		var size = changeSize || resultSize || this._sizeCache.domNode;
		var _mb = {};
		_mb.w = size.w;
		_mb.h = size.h - this._sizeCache.correction.h;
		dojo.marginBox(this.containerNode, _mb);
		//this.containerNode.style.height = _mb.h+"px"; 
		console.log("resize(ts)-->"+ (new Date().getTime() - this.startTime));
	}
	
});
