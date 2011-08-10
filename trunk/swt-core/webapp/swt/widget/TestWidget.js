dojo.provide("swt.widget.TestWidget");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("swt.widget.TestWidget",[dijit._Widget, dijit._Templated],{

	baseClass: "testWidget",
    
	//templatePath :dojo.moduleUrl("swt", "widget/templates/TestWidget.html"),
    templateString: dojo.cache("swt", "widget/templates/TestWidget.html"),
    
    someCustomProperty : "",

    constructor : function() {
        /*
        This stub provides a way for you to perform any other custom
        initialization on your widget, including the management 
        of inheritance relationships. Application developers
        might also handle any custom parameters that have been
        passed to a widget in here without having to dig into any
        source code.
        */
		this.inherited(arguments);
        console.log("constructor");
    },

    buildRendering: function(){
		this.inherited(arguments);
		console.log("buildRendering");
    },
    postMixInProperties : function() {
        /*
        This method is a stub provided by _Widget and is called 
        after all superclass properties, if any, have been mixed
        into the widget. In this example, _Templated is providing
        some properties that get mixed in, including the templateString
        property you see above. A very common operation to perform
        here is manipulation of the template.
        */
    	this.inherited(arguments);
        console.log("postMixInProperties");
    },

    postCreate : function() {
        /*
        This stub is also provided by _Widget, and once it has been 
        called, the widget has been placed in the DOM and is
        available on screen. You might override it to perform any
        additional initialization actions that require the widget
        to first be visible on the screen.
        */
    	this.inherited(arguments);
    	if(dojo.isIE){
        	dojo.connect(this.divOneAP, "onmouseenter", function(e){
        		console.log("this.divOneAP onmouseenter called!");
        	});
        	dojo.connect(this.divOneAP, "onmouseleave", function(e){
        		console.log("this.divOneAP onmouseleavet called!");
        	});

    	} else {
        	dojo.connect(this.divOneAP, "onmouseover", function(e){
        		console.log("this.divOneAP onmouseover called!");
        	});
        	dojo.connect(this.divOneAP, "onmouseout", function(e){
        		console.log("this.divOneAP onmouseout called!");
        	});
    	}
    	console.log("postCreate");
    },

    startup : function() {
        /*
        Here in startup, you can be assured that all of the
        widget's children, if there are any, have been initialized
        and are available. It is not uncommon (at all) for a good
        design to consist of a sophisticated widget that is broken
        down into a number of simpler child widgets.
        */
    	this.inherited(arguments);
        console.log("startup");
    },
    
    destroy: function(){
    	this.inherited(arguments);
    	console.log("destroy");
    },

    // Any custom  methods...
    fooMethod : function(evt) {
    	console.log("fooMethod invoked!");
    }

});