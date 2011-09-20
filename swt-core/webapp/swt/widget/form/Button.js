dojo.provide("swt.widget.form.Button");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("swt.widget.form.Button",[dijit._Widget, dijit._Templated],{

	baseClass: "swtbtn",
    
    templateString: dojo.cache("swt", "widget/form/templates/Button.html"),
    
    iconClass:"",
    
    label:"",
    
    href:"#",
    
    showLabel: true,
    
    postCreate : function() {
    	if(this.iconClass.length>1){
    		var _html = "<span class='btnicon "+ this.iconClass +"'></span>"; 
    		dojo.place(_html, this.domNode, "first");
    	}
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
    onClick: function(evt){
    	// callback for onClick.
    	if(this.href.length>1){
    		evt.preventDefault();
    	}
    }
});