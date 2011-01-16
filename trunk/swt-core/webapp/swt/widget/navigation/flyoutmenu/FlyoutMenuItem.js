dojo.provide("swt.widget.navigation.flyoutmenu.FlyoutMenuItem");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Contained");

dojo.declare("swt.widget.navigation.flyoutmenu.FlyoutMenuItem",[dijit._Widget, dijit._Templated, dijit._Contained],{

	baseClass: "flyoutMenuItem",
    
    templateString: dojo.cache("swt", "widget/navigation/flyoutmenu/templates/FlyoutMenuItem.html"),
    
    attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		label: { node: "containerNode", type: "innerHTML" }
	}),
	
	// iconClass for the item, default size is 16x16, override if needed.
    iconClass:"",
    
    hoverClass: "flyoutMenuItemHover",
    
    handler:"",
    
    href:"javascript: void;",
    
    target: "_self",
    
    label: "",
    
    constructor : function() {
		this.inherited(arguments);
        console.log("constructor");
    },

    postMixInProperties : function() {
    	this.inherited(arguments);
        console.log("postMixInProperties");
    },

    postCreate : function() {
    	this.inherited(arguments);
    	if(this.iconClass && this.iconClass.length>1){
    		dojo.addClass(this.containerNode, this.iconClass);
    	}
    	console.log("postCreate");
    },

    startup : function() {
    	this.inherited(arguments);
        console.log("startup");
    },
    
    destroy: function(){
    	this.inherited(arguments);
    	console.log("destroy");
    },

    _onMouseOver: function(evt){
    	dojo.addClass(this.domNode, this.hoverClass);
    	this.onMouseOver(evt);
    },
    _onMouseOut: function(evt){
    	dojo.removeClass(this.domNode, this.hoverClass);
    	this.onMouseOut(evt);
    },
    _onClick: function(evt){
    	console.log("_onClick called!");
    	this.getParent()._onItemClick(this, evt);
	    this.onClick(this, evt);
	    dojo.stopEvent(evt);
    },
    
    onClick: function(evt){
    	// summary:
    	//		Call-back to connect to on click.
    },
    onMouseOver: function(evt){
    	// summary:
    	//		Call-back to connect to on mouse over.
    },
    
    onMouseOut: function(evt){
    	// summary:
    	//		Call-back to connect to on mouse out. 
    }
});