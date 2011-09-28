dojo.provide("swt.widget.repeater.Repeater");

dojo.require("dojo.i18n");
dojo.require("dojo.html");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._CssStateMixin");
dojo.require("dojox.string.Builder");

dojo.requireLocalization("swt", "swtnls");

dojo.declare('swt.widget.repeater.Repeater', [ dijit._Widget, dijit._Templated, dijit._CssStateMixin], {

	baseClass:"swtRepeater",
	
	templateString: dojo.cache("swt", "widget/repeater/templates/Repeater.html"),
	
	widgetsInTemplate: true,
	
	// pointer to nls messages
	massages: null,
	
	// loadingMessage: String
	//  Message that shows while the repeater is loading
	loadingMessage: "<span class='swtRepeaterLoading'>${loadingState}</span>",
	
	// errorMessage: String
	//  Message that shows when the repeater encounters an error loading
	errorMessage: "<span class='swtRepeaterLoading'>${errorState}</span>",
	
	actions: null,
	
	store: null,
	
	query: null,
	
	formatter: null,
	
	//an array that points to current page data set will include query results if applicable.
	_data: null,
	
	// Object.
	// holds the css classes used in the table.
	_css: {
		"ctxtba": "ctxTooolbarArea",
		"container": "containerNode",
		"headerNode":"headerNode",
		"bodyNode":"bodyNode",
		"repeaterItem":"rItem",
		"odd":"oddRow",
		"even":"evenRow"
	},
	
	needToolbar: false,
	
	needHeader: false,
	
	_row_num: "rrow-num",
	
	constructor: function(arguments){
		var xx = "";
	},

	postMixInProperties: function(){
		this.inherited(arguments);
		this.messages = dojo.i18n.getLocalization("swt", "swtnls", this.lang);
		this.loadingMessage = dojo.string.substitute(this.loadingMessage, this.messages);
		this.errorMessage = dojo.string.substitute(this.errorMessage, this.messages);
	},
	
	postCreate: function(arguments){
		
		if(!this.needToolbar){
			dojo.destroy(this.ctxToolbarArea);
		}
		if(!this.needHeader){
			dojo.destroy(this.headerNode);
		}
		
		this.render();
		
		this.watch("store", dojo.hitch(this, "setStore"));
		this.connect(this.bodyNode, "onclick", dojo.hitch(this, "_onClick"));
	},
	
	render: function(clean){
		if(clean){
			dojo.destroy(this.bodyNode);
			this.bodyNode = dojo.create("div", {"class": this._css.bodyNode}, this.containerNode, "last");
		}
		//show loading message.
		this.bodyNode.innerHTML = this.loadingMessage;
		
		var _self = this;
		if(this.store.declaredClass){
			if(this.query){
				this._data = this.store.query(this.query);
			} else {
				this._data = this.store.data;
			}
		} else {
			this._data = this.store;
		}

		var sb = new dojox.string.Builder();
		if(this._data){
			var st;
			dojo.forEach(this._data, function(item, idx, arr){
				sb.append("<div class='"+ _self._css.repeaterItem + "' " + _self._row_num +"='"+ idx +"'>");
				st = dojo.string.substitute(_self.formatter, item);
				sb.append(st);
				sb.append("</div>");
			});
			//clear anything we may have like a message.
			this.bodyNode.innerHTML = "";
			dojo.place(sb.toString(), this.bodyNode, "last");
		}
	},
	
	setStore: function(aStore){
		if(aStore){
			this.store = aStore;
			this.render(true);
		}
	},
	
	_onClick: function(evt){
		var _ri = evt.target;
		if(!dojo.hasClass(_ri, this._css.repeaterItem)){
			while(_ri.parentNode){
				_ri = _ri.parentNode;
				if(dojo.hasClass(_ri, this._css.repeaterItem)){
					break;
				}
			}
		}
		var _r = parseInt(dojo.attr(_ri, this._row_num));
		this.onClick(evt, this._data[_r]);
	},
	onClick: function(evt, item){
		var xx = "";
		console.log(dojo.toJson(item));
	}
});