dojo.provide("swt.widget.navigation.NavigationMenuItem");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Contained");
dojo.require("dijit._Container");
dojo.require("swt.widget.form._DropDownMixin");

dojo.declare("swt.widget.navigation.NavigationMenuItem",[dijit._Widget, dijit._Templated, dijit._Contained, dijit._Container, swt.widget.form._DropDownMixin],{

	baseClass: "navigationMenuItem",
    
    templateString: dojo.cache("swt", "widget/navigation/templates/NavigationMenuItem.html"),
    
    attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
		label: { node: "labelNode", type: "innerHTML" }
	}),
	
	// iconClass for the item, default size is 16x16, override if needed.
    iconClass:"",
    //TODO use cssstatemixin instead.
    hoverClass: "navigationMenuItemHover",
    
    handler:null,
    
    href:"#",
    
    target: "_self",
    
    label: "",
    
    dropDown: null,
    
    innerMenuIndicator: null,
    
    dropDownOffset: -2,
    
    hasDropDown: false,
    
    dropDownAlign: "L",
    
    // hover or click
    openDropDownOn: "hover",
    
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
   	 	if(this._started) {
   	 		return;
   	 	}
   	 	//var _im = this.getChildren();//dojo.query("ul",this.containerNode);
   	 	var _im = dojo.query(">ul, .dropDown",this.containerNode);
    	if(_im.length>0){
    		this.dropDown = _im[0];
    		this.connectDropDown();
    		console.log("DropDown found");
    	}
    	this.inherited(arguments);

    	// set up watchers
    	this.watch("dropDown", dojo.hitch(this, "setDropDown"));
    	
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
    },

    connectDropDown: function(){
    	// no support for inner menu if using as horizontal.
    	// comment it out if want to support horizontal.
    	//if(this.getParent().getAlignment()=="horizontal"){
    	//	return;
    	//}
    	//this.innerMenuIndicator = dojo.create("span", {'class':'subMenuIndicator dijitArrowButtonInner', innerHTML:''}, this.labelNode, "last");

    	dojo.addClass(this.labelNode, "hasDropDown");
    	if(this.openDropDownOn=="hover"){
        	this.connect(this, "onMouseOver", dojo.hitch(this, "_show"));
        	this.connect(this, "onMouseOut", dojo.hitch(this, "_hide"));
    	} else {
        	this.connect(this, "onClick", dojo.hitch(this, "toggle"));
    	}
    	
    },

    setDropDown: function(/*object*/ aDropDown){
    	// summary: sets the dropdown if not set already.
    	// aDropDown: a widget or a domNode
    	if(aDropDown){
        	if(aDropDown.declaredClass){
        		if(!aDropDown._started){
        			aDropDown.startup();
        		}
        		this.dropDown = aDropDown.domNode;
        	} else {
            	this.dropDown = aDropDown;
        	}
        	dojo.place(this.dropDown, this.domNode);
        	this.connectDropDown();
    	}
    }

});