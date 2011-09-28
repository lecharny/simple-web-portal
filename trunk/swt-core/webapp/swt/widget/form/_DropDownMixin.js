dojo.provide("swt.widget.form._DropDownMixin");

dojo.declare("swt.widget.form._DropDownMixin",[],{

	toggle: function(evt){
		// summary: toggles the open/close state.
    	if(this.dropDown.isOpen){
    		this._hide(evt);
    	} else {
    		this._show(evt);
    	}
    },
    _show: function(evt){
    	// summary: show the drop down
    	var _l="", _t="";
    	if(this.getParent && this.getParent().getAlignment()=="vertical"){
    		_l = this.domNode.offsetWidth + this.dropDownOffset + "px";
    		dojo.style(this.dropDown, {'visibility':'visible','left': _l});
    	} else {
        	var _mb = dojo.position(this.domNode, true);
        	//console.log(dojo.toJson(_mb));
    		_l = 0 + "px";
    		_t = _mb.h+ this.dropDownOffset + "px";
    		if(this.dropDownAlign=="R"){
        		dojo.style(this.dropDown, {'visibility':'visible','right': _l, 'top': _t});
    		} else {
        		dojo.style(this.dropDown, {'visibility':'visible','left': _l, 'top': _t});
    		}

    	}
    	dojo.addClass(this.domNode,"dropDownOpen");
    	
    	this.dropDown.isOpen = true;
    },
    
    _hide: function(evt){
    	// summary: hide the drop down    	
    	dojo.style(this.dropDown, {'visibility':'hidden'});
    	dojo.removeClass(this.domNode,"dropDownOpen");
    	this.dropDown.isOpen = false;
    }

});