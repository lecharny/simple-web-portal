dojo.provide("swt.widget.navigation.NavigationMenuItem");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.declare("swt.widget.navigation.NavigationMenuItem",[dijit._Widget, dijit._Templated, dijit._Contained, dijit._Container],{

	baseClass: "navigationMenuItem",
    
    templateString: dojo.cache("swt", "widget/navigation/templates/NavigationMenuItem.html"),
    
    attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		label: { node: "labelNode", type: "innerHTML" }
	}),
	
	// iconClass for the item, default size is 16x16, override if needed.
    iconClass:"",
    
    hoverClass: "navigationMenuItemHover",
    
    handler:null,
    
    href:"#",
    
    target: "_self",
    
    label: "",
    
    hasInnerMenu: false,
    
    innerMenuReference: null,
    
    innerMenuIndicator: null,
    
    innerMenuOffset: -2,
    
    // hover or click
    openInnerMenuOn: "hover",
    
    constructor : function() {
		this.inherited(arguments);
    },

    postMixInProperties : function() {
    	this.inherited(arguments);
    },

    postCreate : function() {
    	this.inherited(arguments);
    	if(this.iconClass && this.iconClass.length>1){
    		//dojo.addClass(this.containerNode, this.iconClass);
    		this.iconNode = dojo.create("span", {'class':'navigationItemIcon ' + this.iconClass, innerHTML:''}, this.labelNode, "first");
    	}
    },

    startup : function() {
   	 	if (this._started) {
   	 		return;
   	 	}
   	 	var _im = this.getChildren();//dojo.query("ul",this.containerNode);
    	if(_im.length>0){
    		this.hasInnerMenu = true;
    		this.innerMenuReference = _im[0];
    		this.connectInnerMenu();
    		console.log("Inner menu found");
    	}
    	this.inherited(arguments);

    },
    
    destroy: function(){
    	this.inherited(arguments);
    },

    _onMouseOver: function(evt){
    	dojo.addClass(this.domNode, this.hoverClass);
    	this.getParent()._onItemOver(this, evt);
    	this.onMouseOver(evt);
    	//dojo.stopEvent(evt);
    },
    _onMouseOut: function(evt){
    	dojo.removeClass(this.domNode, this.hoverClass);
    	this.getParent()._onItemOut(this, evt);
    	this.onMouseOut(evt);
    	//dojo.stopEvent(evt);
    },
    _onClick: function(evt){
    	//console.log("_onClick called!");
    	this.getParent()._onItemClick(this, evt);
	    //this.onClick(this, evt);
	    //dojo.stopEvent(evt);
    },
    
    //onClick: function(item, evt){
    	// summary:
    	//		Call-back to connect to on click.
    //},
    onMouseOver: function(evt){
    	// summary:
    	//		Call-back to connect to on mouse over.
    	//console.log("onMouseOver::"+ this.id);
    },
    
    onMouseOut: function(evt){
    	// summary:
    	//		Call-back to connect to on mouse out.
    	//console.log("onMouseOut::"+ this.id);
    },

    connectInnerMenu: function(){
    	// no support for inner menu if using as horizontal.
    	// comment it out if want to support horizontal.
    	//if(this.getParent().getAlignment()=="horizontal"){
    	//	return;
    	//}
    	//this.innerMenuIndicator = dojo.create("span", {'class':'subMenuIndicator dijitArrowButtonInner', innerHTML:''}, this.labelNode, "last");
    	dojo.addClass(this.labelNode, "hasInnerMenu");
    	//dojo.style(this.subMenuIndicator, 'visibility','visible');
    	if(this.getParent().getAlignment()=="horizontal"){
    		//var _w = (this.domNode.offsetWidth*this.innerMenuReference.getChildren().length) + 30;
    		//dojo.marginBox(this.innerMenuReference.domNode, {w: _w});
    	} else {
        	dojo.marginBox(this.innerMenuReference.domNode, {w: this.domNode.offsetWidth});
        	//add cosmetic effects if any.
        	dojo.addClass(this.innerMenuReference.domNode, "dijitPopup");
    	}

    	if(this.openInnerMenuOn=="hover"){
        	this.connect(this, "onMouseOver", dojo.hitch(this, "_showInnerMenu"));
        	this.connect(this, "onMouseOut", dojo.hitch(this, "_hideInnerMenu"));
    	} else {
        	this.connect(this, "onClick", dojo.hitch(this, "toggle"));
    	}
    	
    },
    
    toggle: function(evt){
    	if(this.innerMenuReference.isOpen){
    		this._hideInnerMenu(evt);
    	} else {
    		this._showInnerMenu(evt);
    	}
    	
    },
    _showInnerMenu: function(evt){
    	var _l="", _t="";
    	if(this.getParent().getAlignment()=="horizontal"){
        	var _mb = dojo.position(this.domNode, true);
        	//console.log(dojo.toJson(_mb));
    		_l = 0 + "px";
    		_t = _mb.h+ this.innerMenuOffset + "px";
    		//console.log("_l, _t::" + _l +" - "+ _t);
    		dojo.style(this.innerMenuReference.domNode, {'visibility':'visible','left': _l, 'top': _t});
    	} else {
    		_l = this.domNode.offsetWidth + this.innerMenuOffset + "px";
    		dojo.style(this.innerMenuReference.domNode, {'visibility':'visible','left': _l});
    	}
    	dojo.addClass(this.domNode,"innerMenuOpen");
    	
    	this.innerMenuReference.isOpen = true;
    },
    _hideInnerMenu: function(evt){
    	dojo.style(this.innerMenuReference.domNode, {'visibility':'hidden'});
    	dojo.removeClass(this.domNode,"innerMenuOpen");
    	this.innerMenuReference.isOpen = false;
    },
    _setSelected: function(/*boolean*/selected){
        // summary:
        //    Select this navigation menu item. Applications should not set 
        //    the selection on the navigation menu item directly. The selection
        //    must be set on the parent navigation menu.
        // tags:
        //    private
        if (selected) {
            dojo.addClass(this.domNode, "navigationMenuItemSelected");
            this.selected = true;
        } else {
            dojo.removeClass(this.domNode, "navigationMenuItemSelected");
            this.selected = false;
        }
    }


});