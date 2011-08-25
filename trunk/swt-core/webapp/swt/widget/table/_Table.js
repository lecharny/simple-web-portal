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
	// pointer to nls messages
	massages: null,
	// loadingMessage: String
	//  Message that shows while the grid is loading
	loadingMessage: "<span class='swtTableLoading'>${loadingState}</span>",
	// errorMessage: String
	//  Message that shows when the grid encounters an error loading
	errorMessage: "<span class='swtTableLoading'>${errorState}</span>",
	// a layout that acts as outer container for the table.
	//layoutClass: "swt.widget.table._Layout",
	// pointer to layout widget instance.
	//layout: null,
	// swt.widget.table.Toolbar
	// global toolbar for the table.
	toolbar: null,
	// swt.widget.table.ContextualToolbar
	// contextual toobar.
	contextualToolbar: null,

	//////////////////
	// PRIVATE START//
	//////////////////
	_paginationTop: null,
	_paginationBottom: null,
	_sizeCache: null,
	// boolean
	// if the store has identifier key, _hasIdentifier is set to true.
	_hasIdentifier: false,
	
	// integer 
	// number of pages (totalCount/rowsPerPage), totalCount comes from data.
	_pages: 0,
	
	// Object.
	// holds the css classes used in the table.
	_css: {
		"layout":"swtTableLayout",
		"title": "tableTitle",
		"ctxtba": "ctxTooolbarArea",
		"container": "containerNode",
		"table": "tableNode",
		"bottom":"bottomArea",
		"headerNode":"headerNode",
		"bodyNode":"bodyNode",
		"thead":"tableHeader",
		"tbody":"tableBody",
		"odd":"oddRow",
		"even":"evenRow",
		"selected":"selected",
		"selectAll":"selectAll",
		"selectRow":"selectRow",
		"sortIcon":"sortIcon",
		"sortable":"sortable",
		"ascending":"swt-icon swt-icon-triangle-1-n",
		"descending":"swt-icon swt-icon-triangle-1-s"
	},
	// String
	// html template for select/multi-select
	_selectionMultiple: "<input type='checkbox' class='selectAll' value=''/>",
	
	_selectionRow: "<input type='checkbox' class='selectRow' value=''/>",
	// an object/objects depending on single/multiple.  
	_selection: null,
	// boolean
	// pointer used in selectAll and deSelectAll functionality.
	_selectedAll: false,
	// String
	// caches the columns widths calculated for future use.
	_columnWidthCache: null,
	
	_row_num: "row-num",
	
	_row_id: "row-id",
	// boolean
	// used to check if the table body has been created.
	_tableBodyCreated: false,
	//////////////////
	// PRIVATE END////
	//////////////////

	
	////////////////////////
	// user supplied START//
	////////////////////////
	// boolean 
	// for pagination control, if you do not want to show set to false(for smaller dataset).
	// accepted values are client, server and none.
	// client: all the dataset is available and client manages the pagination
	paginationAt: "none",
	_paginationAtObject: {"client":"client", "server": "server", "none":"none"},
	// integer
	// what page to show when table is rendered. Starts with index 0
	showPage: 0,
	// integer
	// pages to cache. Do not set it high if rows per page are large.
	_pageCacheCount: 3,
	// boolean 
	// if set to false no toolbar is shown.
	needToolbar: true,
	// boolean
	// if set to false no contextual toolbar is shown.
	needContextualToolbar: true,
	// String 
	//table  title.
	tableTitle:"Table Title",
	// String
	// iconClass to be shown for the table.
	iconClass: "",
	// integer 
	// rows per page.
	rowsPerPage: 0,
	// boolean 
	// lazy load/render pages.
	lazyLoad: true,
	// boolean 
	// if set to true column width will be computed automatically.
	autoWidth: false,
	// integer
	// height of the table
	height: 400,
	// object (check documentation for details)
	// column set for the table as specified in JSON.
	structure: null,
	// column set after normalizing, i.e. adding row counter and selection.
	_structureClone: null,
	
	// String
	// single, multiple or none.
	selectionMode: "single",
	_single: "single",
	_multiple: "multiple",
	_none: "none",
	
	// String
	// Message that shows if the grid has no data - wrap it in a
	noDataMessage: "",
	// boolean
	// if set to true the row is editable.
	editable: false,
	// Object
	// store for the table, can be a dojo based store or a plain JSON data structure. Check documentation for details.
	store: null,
	// String
	// renderer type (basic, advanced), basic is fast and advanced is slow.
	rendererType: "basic",
	// String
	// shows the row numbers if set to true.
	showRowNumbers: true,
	// int
	// If column width is not supplied, this is used as default for autoWidth=false.
	defaultColumnWidth: 100,
	
	// acceptable values are none, top, bottom, both
	showPaginationAt: "none",
	
	////////////////////////
	// user supplied END////
	////////////////////////
	
	/////////////////////
	// NLS Labels START//
	/////////////////////
	sortable : "sortable",
	/////////////////////
	// NLS Labels END////
	/////////////////////
	
	constructor: function(arguments){
		var xx = "";
	},

	postMixInProperties: function(){
		this.startTime = new Date();
		this.inherited(arguments);
		this.messages = dojo.i18n.getLocalization("swt", "swtnls", this.lang);
		this.loadingMessage = dojo.string.substitute(this.loadingMessage, this.messages);
		this.errorMessage = dojo.string.substitute(this.errorMessage, this.messages);
		this.sortable = (this.messages[this.sortable])?this.messages[this.sortable]:"Sortable";
		// may not need this.
		if(this.srcNodeRef && this.srcNodeRef.style.height){
			this.height = this.srcNodeRef.style.height;
		}
		// initialize selection
		this._selection = [];			
		// call initialization();
		this.initialize();
		
	},

	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postCreate: function(){
		this.inherited(arguments);
		
		if(dojo.isIE<8){
			dojo.addClass(this.tableNode, this._css.table);
		}
		
		// check if table has identifier key.
		if(this.store.idProperty){
			this._hasIdentifier = true;
		}
		
		// normalize the structure.
		this._normalizeStructure();
		this._createLayout();
		this._computeSize();
		this._setStructure();
		this.render();
		// add event handlers.
		this.connect(this.domNode, "onclick", dojo.hitch(this, "_onClick"));
	},
	
	startup: function(){
		this.inherited(arguments);
		//this.layout.startup();
		this.resize();
	},
	initialize: function(){
		// summary: do the initialization.
		
		if(this.structure.showPaginationAt){
			this.showPaginationAt = this.structure.showPaginationAt;
			if(this.structure.paginationAt){
				this.paginationAt = this.structure.paginationAt;
			} else {
				this.paginationAt = this._paginationAtObject.client;
			}
		}
		
		// if rowsPerPage are not pases on as constructor parameter check if it is specified in structure.
		// if supplied in structure and set it appropriately.
		if(this.rowsPerPage<1 && this.structure.rowsPerPage){
			this.rowsPerPage = this.structure.rowsPerPage;
		}
		
		this._calculatePages();
		
		// log pagin info.
		this._logPagingInfo();
	},
	_normalizeStructure: function(){
		// summary:  Any operation like showing row numbers or selection model is fixed in this call.
		
		// clone the structure.
		this._structureClone = dojo.clone(this.structure);

		if(this.showRowNumbers){
			var _rcc = {};
			_rcc.label = "&nbsp;";
			_rcc.isRowCounter= true;
			_rcc.width = 25;
			if(this.rowsPerPage>999){
				_rcc.width = 35;
			}
			this.structure.columns.splice(0, 0, _rcc);
			//splice(2,0,"Lene");
		}
		if(this.selectionMode){
			var _rss = {};
			_rss.label = "&nbsp;";
			//if(this.selectionMode=="single"){
			//	_rss.label = "Select";
			//}
			if(this.selectionMode=="multiple"){
				_rss.label = "Select All";
			}
			_rss.isSelector= true;
			_rss.width = 25;
			this.structure.columns.splice(1, 0, _rss);
		}
	},
	
	_createLayout: function(){
		this.setMessage("Creating layout...");
		if(this.showPaginationAt){
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
	
	_setStructure: function(){
		// summary: create the column set for the table.
		// structure: object see the column/structure definition for the table.
		var structure = this.structure;
		this.setMessage("Creating structure...");
		var _self = this;
		this.headerNode.style.width = this._sizeCache.tableWidth+"px";
		var sb = new dojox.string.Builder();
		var st = "";//"<th>${column.label}</th>";
		//console.log("strucure::" + dojo.toJson(this.structure)); dojo.string.substitute(this.loadingMessage, messages);
		sb.append("<table");
		if(this._sizeCache.tableWidth > 0){
			sb.append(" width='" + this._sizeCache.tableWidth + "'>");
		}
		sb.append(this._columnWidthCache);
		sb.append("<tbody class='");
		sb.append(this._css.thead);
		sb.append("'><tr>");
		//sb.append("<thead class='tableHeader'><tr>");
		dojo.forEach(structure.columns, function(column, idx, arr){
			//console.log(column.label);
			if(column.hidden){
				// do nothing.
				st="";
			} else if(column.isSelector && _self.selectionMode=="multiple"){
				st = "<td title='"+ column.label +"'>"+ _self._selectionMultiple + "</td>";
			} else {
				st = "<td>${label}</td>";
				if(column.sortable){
					st = "<td class='"+ _self._css.sortable + "' title='"+ _self.sortable + "'>${label}<span class='" + _self._css.sortIcon + "'></span></td>";
				}
				st = dojo.string.substitute(st, column);
			}
			sb.append(st);
		});
		sb.append("</tbody></tr></table>");
		console.log(sb.toString());
		dojo.html.set(this.headerNode, sb.toString());
		//dojo.place(sb, this.tableNode, "first")
		// add the header height to correction.
		this._sizeCache.heightHeader = dojo.position(this.headerNode).h;
		
		// add select all connect. TODO destroy these connects if grid re-renders.
		var _sa = dojo.query(this.headerNode, this._css.selectAll)[0];
		if(_sa){
			this.connect(_sa, "onclick", dojo.hitch(this,"selectAll"));
		}
		
		this._structureChanged();
		console.log("_setStructure(ts)-->"+ (new Date().getTime() - this.startTime));
	},
	render: function(){
		// summary: This method renders the table.
		
		this.setMessage("Rendering table...");
//		if(!this._tableBodyCreated){
//			this.bodyNode.style.width = this._sizeCache.tableWidth+"px";
//			dojo.attr(this.tableNode, "width", this._sizeCache.tableWidth);
//			dojo.place(this._columnWidthCache, this.tableNode, "first");
//			this.tbody = dojo.create("tbody", {"class": this._css.tbody});
//			dojo.place(this.tbody, this.tableNode, "last");
//			this._tableBodyCreated = true;
//		} else {
//			this._cleanTable();
//		}
		
		// IE8 and IE7 does not like setting innerHTML on a table node.
		if(dojo.isIE<9){
			dojo.destroy(this.tableNode);
			this.tableNode = dojo.create("table", {"class": this._css.table}, this.bodyNode);
			
		} else {
			this.tableNode.innerHTML="";			
		}

		
		this.bodyNode.style.width = this._sizeCache.tableWidth+"px";
		dojo.attr(this.tableNode, "width", this._sizeCache.tableWidth);
		dojo.place(this._columnWidthCache, this.tableNode, "first");
		this.tbody = dojo.create("tbody", {"class": this._css.tbody});
		dojo.place(this.tbody, this.tableNode, "last");

		var _startRow = ((this.showPage)*this.rowsPerPage)+1;
		var _endRow = (this.showPage+1)*this.rowsPerPage;
		//TODO harjeest if(this.paginationAt==this._paginationAtObject.client){}

		//var sb = new dojox.string.Builder();
		//sb.append("<tbody class='tableBody'>");
		var _self = this;
		if(this.store && this.store.data){
			dojo.forEach(this.store.data, function(row, idx, arr){
				if(((idx+1) < _startRow) || ((idx+1) > _endRow)){
					// do nothing;
				} else {
					try{
						var rb = new dojox.string.Builder();
						var _rcls = (idx%2==0) ? _self._css.even : _self._css.odd; 
						rb.append("<tr class='"+_rcls +"' " + _self._row_num +"='"+ idx +"'>");
						//rb.append("<tr>");
						dojo.forEach(_self.structure.columns, function(column, idxIn, arr){
							//var _r = "<td>${" + column.attr + "}</td>";
							if(column.hidden){
								// do nothing.
							} else if(column.isRowCounter) {
								rb.append("<td>"+(idx+1)+"</td>");
							} else if(column.isSelector) {
								rb.append("<td>"+ _self._selectionRow + "</td>");
							} else {
								if(column.ellipses){
									if(dojo.isChrome){
										// chrome has some issues with ellipses and fixed table layout.
										rb.append("<td><div style='width:"+ (column.width - 10) + "px' class='ellipses' title='${"+column.attr+"}'>${" + column.attr + "}</td>");
									} else {
										rb.append("<td><div class='ellipses' title='${"+column.attr+"}'>${" + column.attr + "}</td>");									
									}
								} else {
									rb.append("<td>${" + column.attr + "}</td>");							
								}
							}
						});
						rb.append("</tr>");
						var _r = rb.toString();
						_r = dojo.string.substitute(_r, row);
						dojo.place(_r, _self.tbody, "last");
						if(_self._hasIdentifier){
							// IE does not have lastElementChild property.
							dojo.attr(_self.tbody.lastElementChild || _self.tbody.lastChild, _self._row_id , row[_self.store.idProperty]);
						}
					} catch(error){
						console.error("Failed adding row ::" + row[_self.store.idProperty]);
					}
				}
			});
			
			// high light the selected rows for this page if any.
			// applicable only if pagination managed by client.
			if(this.paginationAt== this._paginationAtObject.client){
				this._highlightSelection(_self.tbody);						
			}
		}
		console.log("render(ts)-->"+ (new Date().getTime() - this.startTime));
		this.setMessage("Rendered table in " + (new Date().getTime() - this.startTime) + "ms", 4000);
	},
	_structureChanged: function(){
		// called when columnset is changed.
		
	},
	setPagination: function(/*widget*/pagination, /*String*/location){
		// summary: adds pagination
		// pagination: a widget of type swt.widget.table._Pagination
		// location: String (top, bottom or both)
		if(this.showPaginationAt==="none"){
			// do nothing.
		} else 
		{
			if(this.showPaginationAt=="bottom"){
				this._paginationBottom = new swt.widget.table._Pagination({"class":"paginationBottom dijitInline", table:this}, this.paginationBottom);
				this._paginationBottom.startup();
			} 
			if(this.showPaginationAt=="top"){
				this._paginationTop = new swt.widget.table._Pagination({"class":"paginationTop dijitInline", table:this}, this.paginationTop);
				this._paginationTop.startup();
			}
			if(this.showPaginationAt=="both"){
				this._paginationBottom = new swt.widget.table._Pagination({"class":"paginationBottom dijitInline", table:this}, this.paginationBottom);
				this._paginationBottom.startup();
				this._paginationTop = new swt.widget.table._Pagination({"class":"paginationTop dijitInline", table:this}, this.paginationTop);
				this._paginationTop.startup();
			}
		}
	},
	setToolbar: function(/*widget*/toolbar){
		// summary : adds contextual toolbar
		// toolbar : should be an instance of swt.widget.table.ContextualToolbar or dijit.Toolbar.
		if(!toolbar){
			this.toolbar = new swt.widget.table.Toolbar({"class":"dijitInline", table:this}, this.toolbar);
			this.toolbar.startup();
		} else {
			this.toolbar.appendChild(toolbar);
		}
	},
	setContextualToolbar: function(/*widget*/toolbar){
		// summary : adds toolbar.
		// toolbar : should be an instance of swt.widget.table.Toolbar or dijit.Toolbar.
		if(!toolbar){
			this.contextualToolbar = new swt.widget.table.ContextualToolbar({"class":"dijitInline", table:this}, this.contextualToolbar);
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
		
		// populate the _columnWidthCache now.
		this._computeColumnWidths();
		console.log("_computeSize(ts)-->"+ (new Date().getTime() - this.startTime));
	},
	_computeColumnWidths: function(){
		// summary: computed the column widths from the table structure provided.
		var _self = this;
		this._sizeCache.tableWidth = 0;
		var sb = new dojox.string.Builder();
		var st = "";
		dojo.forEach(this.structure.columns, function(column, idx, arr){
			//console.log(column.label);
			if(column.hidden){
				// do nothing.
				st="";
			} else {
				st = "<col width='${width}'></col>";
				_self._sizeCache.tableWidth = _self._sizeCache.tableWidth + column.width;
			}
			st = dojo.string.substitute(st, column);
			sb.append(st);
		});
		// if sum of column width is less that available use available.
		if(this._sizeCache.domNode.w > this._sizeCache.tableWidth){
			this._sizeCache.tableWidth = this._sizeCache.domNode.w;
		}
		this._columnWidthCache = sb.toString();
		//console.log("_computeColumnWidths::" + this._columnWidthCache);
		return this._columnWidthCache;
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
		if(this._sizeCache.heightHeader && this._sizeCache.heightHeader>0){
			this.bodyNode.style.height = (_mb.h - this._sizeCache.heightHeader)+"px";			
		}
		//this.containerNode.style.height = _mb.h+"px"; 
		console.log("resize(ts)-->"+ (new Date().getTime() - this.startTime));
	},
	////////////////////////////////////
	// contextual toobar actions START//
	////////////////////////////////////
	edit: function(){
		console.log("Table edit invoked, needs to be implemented!");
	},
	deleteRow: function(evt){
		console.log("Table deleteRow invoked, needs to be implemented!");	
	},
	addRow: function(evt){
		console.log("Table addRow invoked, needs to be implemented!");	
	},
	clearSelection: function(evt){
		// summary: clears all the selection is any.
		var _self = this;
		if(this._selection){
			var curPage = this._selection[this.showPage];
			dojo.forEach(curPage, function(item, idx, arr){
				_sr = _self.tbody.rows[item.rowIndex];
				if(_sr){
					dojo.removeClass(_sr, _self._css.selected);
					_sr.cells[1].firstChild.checked = false;
				}
			});
			/*
			var _sr;
			for(var prop in this._selection){
				_sr = this.tbody.rows[prop];
				dojo.removeClass(_sr, this._css.selected);
				_sr.cells[1].firstChild.checked = false;
			};
			this._selection = {};
			*/
		}
		this._createSelectionObject();
	},
	////////////////////////////////////
	// contextual toobar actions END////
	////////////////////////////////////
	
	/////////////////////////
	// Toobar actions START//
	/////////////////////////
	refresh: function(evt){
		console.log("Refresh table not done yet!");
	},
	/////////////////////////
	// Toobar actions END////
	/////////////////////////

	/////////////////////////////
	// Pagination actions START//
	/////////////////////////////
	priviousPage: function(evt){
		console.log("Pagination(privious) in table not done yet!");
	},
	nextPage: function(evt){
		console.log("Pagination(next) in table not done yet!");
	},
	/////////////////////////////
	// Pagination actions END////
	/////////////////////////////

	_onClick: function(evt){
		// summary: if a user clicks anywhere inside the table, the table tries to understand and act appropriately. Following are
		// 	handled right now:
		//  1. invoke the onClick call back so that we know row, col and item for the click.
		console.log("Clicked on::" + evt);
		this._handleClick(evt);
	},
	onSelect: function(/*Array*/selection, /*store*/ store){
		// summary: Event callback called when a user selects/deselects a row.
	},
	selectAll: function(evt){
		// summary: selects all the rows in table.
		//	for pagination none and server this is equallent to select all. For pagination on client select all
		//	select all the rows in a given page.
		if(evt.target.checked){
			var _self = this;
			var _sd, _ri;
			this._selection[this.showPage]=[];
			dojo.forEach(this.tbody.rows, function(row, idx, arr){
				_sd = {};
				_sd.page = _self.showPage;
				_sd.rowIndex = row.rowIndex;
				_sd.item = _self._getStoreItemForTableRow(row);
				_self._selection[_self.showPage].push(_sd);
				row.cells[1].firstChild.checked = true;
				dojo.addClass(row, _self._css.selected);
			});
			this.onSelect(this._selection, this.store);
			this._selectedAll = true;
		}
		if(!evt.target.checked && this._selectedAll){
			this.deSelectAll(evt);
		}
	},
	deSelectAll: function(evt){
		// summary: selects all the rows in table.
		if(!evt.target.checked){
			var _self = this;
			dojo.forEach(this.tbody.rows, function(row, idx, arr){
				row.cells[1].firstChild.checked = false;
				dojo.removeClass(row, _self._css.selected);
			});

			this._selection[this.showPage]=[];
			this.onSelect(this._selection, this.store);
			this._selectedAll = false;
		}

	},
	onClick: function(/*domNode TR*/ row, /*domNode TD*/ col, /*Object*/ item, /*pageNumber*/ page){
		// summary: Event callbak called when user clicks on a row.
		// tags: callback
		// row: domNode representing TR tag.
		// col: domNode representing TD tag.
		// item: data item as JSON object from the store.
		// page: page number for the selecttion, if pagination is not used it ia 1 always as single page is assumed.
	},
	_handleClick: function(evt){
		// summary: Tries to understand the user click and interpret it accordingly.
		//	if the user has clicked on a table cell, locates it and fires onClick callback.
		// evt: the dom event.
		var _self = this;
		var row, item, isSelect, selected;
		var node = evt.target;
		
		//if user clicks on a checkbox to select a row.
		if(node.nodeName.toUpperCase()=="INPUT" && dojo.hasClass(node, this._css.selectRow)){
			isSelect = true;
			selected = node.checked;
		}
		//if user clicks on a table cell, determine the row for the cell.
		if(node.nodeName.toUpperCase()=="TD"){
			// if user clicks on a TD tag, means no formatter or ellipses in use.
			if(dojo.hasAttr(node.parentNode, this._row_id) || dojo.hasAttr(node.parentNode, this._row_num)){
				row = node.parentNode;
				//console.log("Row found-->" + dojo.attr(row, this._row_id) + " - " + dojo.attr(row, this._row_num) + " (TR) rowindex is::" + row.rowIndex + " CellIndex is::" + node.cellIndex);
			}
		} else {
			// if use clicks on some nested dom means formatter or ellipses in use.
			while(node.parentNode){
				if(dojo.hasClass(node, this._css.tbody)){
					break;
				}
				if(node.nodeName.toUpperCase()=="TD"){
					if(dojo.hasAttr(node.parentNode, this._row_id) || dojo.hasAttr(node.parentNode, this._row_num)){
						row = node.parentNode;
						//console.log("Row found-->" + dojo.attr(row, this._row_id) + " - " + dojo.attr(row, this._row_num) + " (TR) rowindex is::" + row.rowIndex + " CellIndex is::" + node.cellIndex);
					}
					break;
				}
				node = node.parentNode;
			}
		}
		// if user clicks on sortable column icon.
		if(dojo.hasClass(node, this._css.sortIcon) || dojo.hasClass(node, this._css.sortable)){
			var _td = node;
			if(dojo.hasClass(node, this._css.sortIcon)){
				_td = node.parentNode;
			}
			var _tr = _td.parentNode;
			dojo.forEach(_tr.cells, function(td, idx, arr){
				if(_td.cellIndex==td.cellIndex || !td.firstElementChild){
					
				} else {
					dojo.removeClass(td.firstElementChild, _self._css.ascending+" "+ _self._css.descending);
				}
			});
			// IE8 and below do not have node.lastElementChild API
			var _si = _td.firstElementChild || _td.lastChild;
			if(dojo.hasClass(_si, _self._css.ascending)){
				dojo.replaceClass(_si, _self._css.descending, _self._css.ascending);
			} else if(dojo.hasClass(_si, _self._css.descending)){
				dojo.replaceClass(_si, _self._css.ascending, _self._css.descending);
			} else {
				dojo.addClass(_si, _self._css.ascending);
			}

			console.log("sort now by colIndex" + _td.cellIndex || _td.cellIndex);
		}

		
		
		if(row){
			item = this._getStoreItemForTableRow(row);
		}
		// here we are assuming that the row counters will be adjusted for pages, if reset at page level this will not work.
		// TODO harjeet for paginated table we need to keep selection for each page alive separately.
		if(isSelect && row){
			if(selected){
				var _sd = {};
				_sd.page = this.showPage;
				_sd.rowIndex = row.rowIndex;
				_sd.item = item;
				if(this.selectionMode===this._single){
					// if selection mode is single, _selection points to store item directly.
					//this._selection[row.rowIndex] = item; OLD
					this.clearSelection(null);
					this._selection[this.showPage] = [_sd];
					//this._selection[this.showPage] = _sd;
				} else if (this.selectionMode===this._multiple){
					// if selection mode is multiple, _selection is an object with keys pointing to store items.
					// if pagination is being used we need to make sure selection is toed to a page.
					//this._selection[row.rowIndex] = item; OLD
					var indexAlreadySelected = this._checkIfAlreadySelected(this._selection[this.showPage], _sd.rowIndex);
					if(indexAlreadySelected>-1){
						this._selection[this.showPage][indexAlreadySelected] = _sd;
					} else {
						this._selection[this.showPage].push(_sd);
					}
					
				} else {
					// nothing to do.
				}
				dojo.addClass(row, this._css.selected);
			} else {
				if(this.selectionMode===this._single){
					this.clearSelection(null);
				} else if (this.selectionMode===this._multiple){
					//delete this._selection[row.rowIndex];
					var _item;
					for(var i=0; i<this._selection[this.showPage].length;i++){
						_item = this._selection[this.showPage][i];
						if(_item.rowIndex==row.rowIndex){
							_self._selection[_self.showPage].splice(i, 1);
							break;
						}
					}
					//this._selection.splice(row.rowIndex, 1);
				} else {
					// nothing to do.
				}
				dojo.removeClass(row, this._css.selected);
			}
			this.onSelect(this._selection, this.store);
		} else {
			if(row){
				this.onClick(row, node, item, this.showPage);
			}
		}
	},
	getRow: function(index){
		
	},
	getColumn: function(index){
		
	},

	resetTableView: function(/*Number*/rowsPerPage, /*Number*/ gotoPage){
		// summary: resets the table view.
		// rowsPerPage: Number of rows per page to show.
		// gotoPage: Goto page number.
		if(rowsPerPage>0){
			this.rowsPerPage = rowsPerPage;
			this._calculatePages();
		}

		this.showPage = gotoPage;
		
		// reset the clock for new page.
		this.startTime = new Date();
		this.render();
		
		this._logPagingInfo();
	},
	
	_calculatePages: function(){
		// summary: calculates the number of pages from total and rows per page.
		// CaseOne all the data is available with the client and user has requested pagination.
		// if rowsPerPage > 0, figure out how many pages we are going to have from the available data.
		if(this.rowsPerPage>0){
			if(this.rowsPerPage < this.store.data.length){
				this._pages = Math.ceil(this.store.data.length/this.rowsPerPage);	
			} else {
				this._pages = 1;
			}
		}
		this._createSelectionObject();
		// add logic here to retail old selections before number of pages OR rows per page were changed.
		// TODO harjeet.hans
		
		// CaseTwo data is served from a server on demand. server does provide total records etc.
		// the small batch of data received can be either paginated or shown all at a time.
		// TODO harjeet.hans

	},
	_cleanTable: function(){
		var _count = 0;
		dojo.query("tr", this.tbody).forEach(function(node, index, arr){
			dojo.destroy(node);
			_count++;
			//console.log("Desctoyed node::" + index);
		});
		console.log("Destroy(count)::" + _count);
	},
	_logPagingInfo: function(){
		console.log("Pagination At::" + this.paginationAt);
		console.log("Show pagination at ::" + this.showPaginationAt);
		console.log("Total rows::" + this.store.data.length);
		console.log("Rows/page::" + this.rowsPerPage);
		console.log("Total pages::" + this._pages);
		console.log("Show page number::" + this.showPage);
	},
	
	_selectItem: function(/*Object*/ item, /*boolean*/ selected){
		// summary: select or deselects a store item depending on boolean passed.
		// 	sets a key (_selected) for user later.
		item.__selected = selected;
	},
	_createSelectionObject: function(){
		// create selection bucket.
		for(var i=0; i< (this._pages); i++){
			this._selection[i] = [];
		}
	},
	_checkIfAlreadySelected: function(pageSelection, rowIndex){
		// summary: checks if a row is already selected for a given page.
		// pageSelection: an array of selected items for a given page.
		// rowIndex: rowIndex to be checked if present.
		// return : index of row if already selected or -1 otherwise.
		var aRow;
		var result = -1;
		for(var i=0; i<pageSelection.length; i++){
			aRow = pageSelection[i];
			if(aRow.rowIndex == rowIndex){
				result = i;
				break;
			}
			return result;
		}
	},
	_highlightSelection: function(/*domNode*/tBody){
		// summary: hightlights the existing selection for a given page.
		var _self = this;
		dojo.forEach(this._selection[this.showPage], function(item, index, arr){
			if(tBody.rows[item.rowIndex]){
				tBody.rows[item.rowIndex].cells[1].firstChild.checked = true;
				dojo.addClass(tBody.rows[item.rowIndex], _self._css.selected);
			}
		});
	},
	_getStoreItemForTableRow: function(/*domNode*/ row){
		// summary: gets a pointer to store iten given a table row (tr) node.
		if(this.paginationAt== this._paginationAtObject.none || this.paginationAt== this._paginationAtObject.server){
			return this.store.data[row.rowIndex];
		} else {
			var _ri = (this.showPage*this.rowsPerPage) + row.rowIndex;
			return this.store.data[_ri];
		}
	},
	hideColumn: function(/*number*/ columnIndex){
		if(columnIndex>-1 && columnIndex < (this.structure.columns.length)){
			this.structure = dojo.clone(this._structureClone);
			this.structure.columns[columnIndex].hidden = true;
			this._normalizeStructure();
			this._computeColumnWidths();
			this._setStructure();
			this.render();
		} else {
			console.warn("Trying to hide a non existant column!");
		}
		this.resize();
	},
	showColumn: function(/*number*/ columnIndex){
		if(columnIndex>-1 && columnIndex < (this.structure.columns.length)){
			this.structure = dojo.clone(this._structureClone);
			this.structure.columns[columnIndex].hidden = false;
			this._normalizeStructure();
			this._computeColumnWidths();
			this._setStructure();
			this.render();
		} else {
			console.warn("Trying to show a non existant column!");
		}
	}	
});