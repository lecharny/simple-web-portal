dojo.provide("swt.widget.navigation.flyoutmenu.FlyoutMenuItem");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.declare("swt.widget.navigation.flyoutmenu.FlyoutMenuItem",[dijit._Widget, dijit._Templated, dijit._Contained, dijit._Container],{

	baseClass: "flyoutMenuItem",
    
    templateString: dojo.cache("swt", "widget/navigation/flyoutmenu/templates/FlyoutMenuItem.html"),
    
    attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		label: { node: "labelNode", type: "innerHTML" }
	}),
	
	// iconClass for the item, default size is 16x16, override if needed.
    iconClass:"",
    
    hoverClass: "flyoutMenuItemHover",
    
    handler:"",
    
    href:"javascript: void;",
    
    target: "_self",
    
    label: "",
    
    hasInnerMenu: false,
    
    innerMenuReference: null,
    
    innerMenuIndicator: null,
    
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
   	 	var _im = dojo.query("ul",this.containerNode);
    	if(_im.length>0){
    		this.hasInnerMenu = true;
    		this.innerMenuReference = _im;
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
    	dojo.stopEvent(evt);
    },
    _onMouseOut: function(evt){
    	dojo.removeClass(this.domNode, this.hoverClass);
    	this.getParent()._onItemOut(this, evt);
    	this.onMouseOut(evt);
    	dojo.stopEvent(evt);
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
    },

    connectInnerMenu: function(){

    	this.innerMenuIndicator = dojo.create("span", {'class':'subMenuIndicator', innerHTML:'&nbsp;&nbsp;'}, this.labelNode, "last"); 
    		    
    		
    		/*
    		ultags[t].parentNode.onmouseover=function(){
    		    this.getElementsByTagName("ul")[0].style.left=this.parentNode.offsetWidth+submenuoffset+"px"
    		    this.getElementsByTagName("ul")[0].style.display="block"
    		    }
    		    ultags[t].parentNode.onmouseout=function(){
    		    this.getElementsByTagName("ul")[0].style.display="none"
    		    }
    		    
    		    
    		    }
    		  }*/
    }

});