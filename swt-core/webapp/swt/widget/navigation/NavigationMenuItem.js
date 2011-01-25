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
    
    handler:"",
    
    href:"javascript: void;",
    
    target: "_self",
    
    label: "",
    
    hasInnerMenu: false,
    
    innerMenuReference: null,
    
    innerMenuIndicator: null,
    
    innerMenuOffset: -2,
    
    constructor : function() {
		this.inherited(arguments);
    },

    postMixInProperties : function() {
    	this.inherited(arguments);
    },

    postCreate : function() {
    	this.inherited(arguments);
    	if(this.iconClass && this.iconClass.length>1){
    		dojo.addClass(this.containerNode, this.iconClass);
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
    	console.log("_onClick called!");
    	this.getParent()._onItemClick(this, evt);
	    this.onClick(this, evt);
	    //dojo.stopEvent(evt);
    },
    
    onClick: function(evt){
    	// summary:
    	//		Call-back to connect to on click.
    },
    onMouseOver: function(evt){
    	// summary:
    	//		Call-back to connect to on mouse over.
    	console.log("onMouseOver::"+ this.id);
    },
    
    onMouseOut: function(evt){
    	// summary:
    	//		Call-back to connect to on mouse out.
    	console.log("onMouseOut::"+ this.id);
    },

    connectInnerMenu: function(){
    	if(this.getParent().getAlignment()=="horizontal"){
    		return;
    	}
    	this.innerMenuIndicator = dojo.create("span", {'class':'subMenuIndicator dijitArrowButtonInner', innerHTML:'&nbsp;'}, this.labelNode, "last");
    	dojo.addClass(this.labelNode, "hasInnerMenu");
    	//dojo.style(this.subMenuIndicator, 'visibility','visible');
    	dojo.marginBox(this.innerMenuReference.domNode, {w: this.domNode.offsetWidth});
    	this.connect(this, "onMouseOver", dojo.hitch(this, "_showInnerMenu"));
    	this.connect(this, "onMouseOut", dojo.hitch(this, "_hideInnerMenu"));
    	
    	//add cosmetic effects if any.
    	dojo.addClass(this.innerMenuReference.domNode, "dijitPopup");
    },
    
    _showInnerMenu: function(evt){
    	var _l = this.domNode.offsetWidth + this.innerMenuOffset + "px";
    	dojo.style(this.innerMenuReference.domNode, {'visibility':'visible','left': _l});
    	dojo.addClass(this.domNode,"innerMenuOpen");
    },
    _hideInnerMenu: function(evt){
    	dojo.style(this.innerMenuReference.domNode, {'visibility':'hidden'});
    	dojo.removeClass(this.domNode,"innerMenuOpen");
    }


});