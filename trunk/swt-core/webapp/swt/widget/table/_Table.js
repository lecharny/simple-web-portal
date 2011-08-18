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
		"selectAll":"selectAll"
	},
	// String
	// html template for select/multi-select
	_selectionMultiple: "<input type='checkbox' class='selectAll' value=''/>",
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
	
	//////////////////
	// PRIVATE START//
	//////////////////

	
	////////////////////////
	// user supplied START//
	////////////////////////
	// boolean 
	// for pagination control, if you do not want to show set to false(for smaller dataset).
	needPagination: true,
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
	rowsPerPage: 50,
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
	
	////////////////////////
	// user supplied END////
	////////////////////////
	
	
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
		if(this.selectionMode===this._multiple){
			this._selection = {};			
		}
	},

	buildRendering: function(){
		this.inherited(arguments);
	},
	
	postCreate: function(){
		this.inherited(arguments);
		// check if table has identifier key.
		if(this.store.idProperty){
			this._hasIdentifier = true;
		}
		
		// normalize the structure.
		this._normalizeStructure();
		this._createLayout();
		this._computeSize();
		this._setStructure(this.structure);
		this.render();
		// add event handlers.
		this.connect(this.domNode, "onclick", dojo.hitch(this, "_onClick"));
	},
	
	startup: function(){
		this.inherited(arguments);
		//this.layout.startup();
		this.resize();
	},
	
	render: function(){
		this.setMessage("Rendering table...");
		this.bodyNode.style.width = this._sizeCache.tableWidth+"px";
		dojo.attr(this.tableNode, "width", this._sizeCache.tableWidth);
		dojo.place(this._columnWidthCache, this.tableNode, "first");
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
					rb.append("<tr class='"+_rcls +"' " + _self._row_num +"='"+ idx +"'>");
					//rb.append("<tr>");
					dojo.forEach(structure.columns, function(column, idxIn, arr){
						//var _r = "<td>${" + column.attr + "}</td>";
						if(column.isRowCounter) {
							rb.append("<td>"+(idx+1)+"</td>");
						} else if(column.isSelector) {
							rb.append("<td>"+ _self._selectionMultiple + "</td>");
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
					//console.log("Arow::(" + idx + ")::" + _r);
				} catch(error){
					console.error("Failed adding row ::" + row[_self.store.idProperty]);
				}
			});
			
		}
		console.log("render(ts)-->"+ (new Date().getTime() - this.startTime));
		this.setMessage("Rendered table in " + (new Date().getTime() - this.startTime) + "ms", 4000);
	},
	
	_setStructure: function(structure){
		// summary: create the column set for the table.
		// structure: object see the column/structure definition for the table.
		
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
			if(column.isSelector && _self.selectionMode=="multiple"){
				st = "<td title='"+ column.label +"'>"+ _self._selectionMultiple + "</td>";
			} else {
				st = "<td>${label}</td>";
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
		
		// add select all connect.
		var _sa = dojo.query(this.headerNode, this._css.selectAll)[0];
		if(_sa){
			this.connect(_sa, "onclick", dojo.hitch(this,"selectAll"));
		}
		
		this._structureChanged();
		console.log("_setStructure(ts)-->"+ (new Date().getTime() - this.startTime));
	},
	_normalizeStructure: function(){
		// summary:  Any operation like showing row numbers or selection model is fixed in this call.
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
			st = "<col width='${width}'></col>";
			st = dojo.string.substitute(st, column);
			sb.append(st);
			_self._sizeCache.tableWidth = _self._sizeCache.tableWidth + column.width;
		});
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
//		if(this.selectionMode===this._single){
//			this._selection = null;
//		} else {
//			this._selection = {};
//		}
		if(this._selection && dojo.isObject(this._selection)){
			var _sr;
			for(var prop in this._selection){
				_sr = this.tbody.rows[prop];
				dojo.removeClass(_sr, this._css.selected);
				_sr.cells[1].firstChild.checked = false;
			};
			this._selection = {};
		}
		
		//console.log("Table clearSelection invoked, needs to be implemented!");
	},
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
		if(evt.target.checked){
			var _self = this;
			this._selection = {};
			dojo.forEach(this.tbody.rows, function(row, idx, arr){
				row.cells[1].firstChild.checked = true;
				dojo.addClass(row, _self._css.selected);
				_self._selection[row.rowIndex] = _self.store.data[row.rowIndex];
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
			this._selection = {};
			this.onSelect(this._selection, this.store);
			this._selectedAll = false;
		}

	},
	onClick: function(/*domNode TR*/ row, /*domNode TD*/ col, /*Object*/ item){
		// summary: Event callbak called when user clicks on a row.
		// tags: callback
		// row: domNode representing TR tag.
		// col: domNode representing TD tag.
		// item: data item as JSON object from the store.
	},
	_handleClick: function(evt){
		// summary: Tries to understand the user click and interpret it accordingly.
		//	if the user has clicked on a table cell, locates it and fires onClick callback.
		// evt: the dom event.
		var row, item, isSelect, selected;
		var node = evt.target;
		if(node.nodeName.toUpperCase()=="INPUT"){
			isSelect = true;
			selected = node.checked;
		}
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
		if(row){
			item = this.store.data[row.rowIndex];
		}

		// here we are assuming that the row counters will be adjusted for pages, if reset at page level this will not work.
		if(isSelect && row){
			if(selected){
				if(this.selectionMode===this._single){
					// if selection mode is single, _selection points to store item directly.
					this._selection = {};
					this._selection[row.rowIndex] = item;
					//this._selection = item;
				} else if (this.selectionMode===this._multiple){
					// if selection mode is multiple, _selection is an object with keys pointing to store items.
					//this._selection.push(row.rowIndex);
					this._selection[row.rowIndex] = item;
				} else {
					// nothing to do.
				}
				dojo.addClass(row, this._css.selected);
			} else {
				if(this.selectionMode===this._single){
					delete this._selection;
				} else if (this.selectionMode===this._multiple){
					delete this._selection[row.rowIndex];						
					//this._selection.splice(row.rowIndex, 1);
				} else {
					// nothing to do.
				}
				dojo.removeClass(row, this._css.selected);
			}
			this.onSelect(this._selection, this.store);
		} else {
			if(row){
				this.onClick(row, node, item);
			}
		}
	},
	getRow: function(index){
		
	},
	getColumn: function(index){
		
	}
	
});
