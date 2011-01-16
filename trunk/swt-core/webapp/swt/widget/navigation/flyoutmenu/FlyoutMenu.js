dojo.provide("swt.widget.navigation.flyoutmenu.FlyoutMenu");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");

dojo.declare("swt.widget.navigation.flyoutmenu.FlyoutMenu",[dijit._Widget, dijit._Templated, dijit._Container],{

	baseClass: "flyoutMenu",
    
    templateString: dojo.cache("swt", "widget/navigation/flyoutmenu/templates/FlyoutMenu.html"),
    
    selected: -1,
    
    constructor : function() {
		this.inherited(arguments);
    },

    postMixInProperties : function() {
    	this.inherited(arguments);
    },

    postCreate : function() {
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
    	this.selected = item;
    },
    
    getSelected: function(){
    	return this.selected;
    },
    
    getSelectedIndex: function(){
    	if(!this.selected == -1){
        	this.getIndexOfChild(this.selected);
    	}
    }
    
});