dojo.provide("swt.widget.form.DropDownButton");

dojo.require("swt.widget.form._DropDownMixin");

dojo.declare("swt.widget.form.DropDownButton",[swt.widget.form.Button, swt.widget.form._DropDownMixin],{

	additionalClass: "swtbtndropdown",
	
	dropDown: null,
	
	dropDownAlign: "L",
	
    dropDownOffset: -2,
    
    postCreate : function() {
    	dojo.addClass(this.domNode, this.additionalClass);
    	this.inherited(arguments);
    },
    startup : function() {
    	if (this._started) {
    		return;
    	}
   	 	var _im = dojo.query(".dropDown", this.domNode);
   	 	if(_im.length>0){
   	 		this.dropDown = _im[0];
        	this.connectDropDown();
        	console.log("DropDown found");
        }
       	// set up watchers
       	this.watch("dropDown", dojo.hitch(this, "setDropDown"));
         
    	this.inherited(arguments);
    },
    
    onClick: function(evt){
    	// callback for onClick.
    	if(this.href.length>1){
    		evt.preventDefault();
    	}
    },

    connectDropDown: function(){
    	// no support for inner menu if using as horizontal.
    	// comment it out if want to support horizontal.
    	//if(this.getParent().getAlignment()=="horizontal"){
    	//	return;
    	//}
    	//this.innerMenuIndicator = dojo.create("span", {'class':'subMenuIndicator dijitArrowButtonInner', innerHTML:''}, this.labelNode, "last");

    	this.connect(this.dropDown, "onclick", function(evt){
    		dojo.stopEvent(evt);
    	});
    	
    	if(this.openDropDownOn=="hover"){
        	this.connect(this.domNode, "onmouseover", dojo.hitch(this, "_show"));
        	this.connect(this.domNode, "onmouseout", dojo.hitch(this, "_hide"));
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