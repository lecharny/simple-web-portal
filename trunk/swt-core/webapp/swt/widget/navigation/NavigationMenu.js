dojo.provide("swt.widget.navigation.NavigationMenu");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");
dojo.require("dijit._Contained");
dojo.declare("swt.widget.navigation.NavigationMenu",[dijit._Widget, dijit._Templated, dijit._Container, dijit._Contained],{

	baseClass: "navigationMenu",
    
    templateString: dojo.cache("swt", "widget/navigation/templates/NavigationMenu.html"),
    
    selectedIndex: -1,
    
    // alignment vertical (default) or horizontal.
    alignment: "vertical",
    
    constructor : function() {
		this.inherited(arguments);
    },

    postMixInProperties : function() {
    	this.inherited(arguments);
    },

    postCreate : function() {
    	dojo.addClass(this.domNode, this.alignment);
    	this.inherited(arguments);
    },
    startup : function() {
    	 if (this._started) {
             return;
         }
         var _self = this;
         dojo.forEach(this.getChildren(), function(child){
         	if(!this._started){
         		child.startup();
         	}
         });
         
    	this.inherited(arguments);
    },
    destroy: function(){
    	this.inherited(arguments);
    },
    _onItemClick: function(item, evt){
    	if(this.selectedIndex >= 0){
    		var sItem = this.getChildren()[this.selectedIndex];
    		if(sItem){
    			sItem._setSelected(false);
    		}
    		this.selectedIndex = this.getIndexOfChild(item);
    		item._setSelected(true);
    	} else {
    		this.selectedIndex = this.getIndexOfChild(item);
    		item._setSelected(true);
    	}
    	console.log("SelectedIndex is for "+ this.id +" :: " + this.selectedIndex);
    },
    
    _onItemOver: function(item, evt){
    },
    _onItemOut: function(item, evt){
    },
    getSelected: function(){
    	return this.selected;
    },
    
    getSelectedIndex: function(){
    	if(!this.selected == -1){
        	this.getIndexOfChild(this.selected);
    	}
    },
    
    getAlignment: function(){
    	return this.alignment;
    }
    
});