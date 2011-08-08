dojo.provide("swt.widget.util.ellipses");
dojo.require("dojo.html");

dojo.setObject("swt.widget.util.ellipses", {
	generateEllipsis : function(aNode, appendHtml,  ellipsisHtml, maxTextLengthAllowed) {
	    // Summary: 
	    //    Given a domNode with text in it, it will check if all the text is visible
	    //    if not it will try to remove one character at a time inside a text node or one 
	    //    HTMLElement at a time to make the text fit in the DOM node.
	    //
	    // el: DomNode
	    //    If the test node is multiline it should have class ecpMultilineText
	    //
	    // appendHTML: String
	    //    If not empty it will be appended to the original content of el and the function
	    //    will make it fit in the allowed space
	    //
	    // ellipsisHTML: String
	    //        The HTML to generate the ellipsis if it needs one
	    //        defaults to <span class="ellipsis">&hellip;</span>
	    //
		// maxTextLengthAllowed: number
		//		if supplied the text inside will be truncated before ellipses.
		//		user it if you have a length string and are sure most of it will not be used.
		
	    var startTime = new Date();
	    ellipsisHtml = (ellipsisHtml)?ellipsisHtml:'<span class="ellipsis">&hellip;</span>';
	    if(dojo.isString(aNode)){
	    	aNode = dojo.byId(aNode);
	    }
	    if(dojo.style(aNode, "overflow") == "hidden") {
	    	// get the box model for the node, we do not need to worry about margin, border and padding. Check if dojo.contentBox works better.
	    	maxTextLengthAllowed = (maxTextLengthAllowed) ? maxTextLengthAllowed : -1;
	    	var extraTextTruncated = false;
	    	var _pos = dojo.position(aNode);
	    	var elWidth  = _pos.w;
	        var elHeight = _pos.h;
	        var text = aNode.innerHTML;
	        // add a class ecpMultilineText other ellipses appears on a single line only as width is user instead.
	        var multiline = dojo.hasClass(aNode,'swtMultilineText');
			// clone the node to make a copy	        
	        var _clone = aNode.cloneNode(true);
	        var offset = 0;
	        var appendHtmlNode;
	        var ellipsisNode;
	        
			if (appendHtml && appendHtml.length>0) {
	            appendHtmlNode = dojo._toDom(appendHtml);
	            offset += (appendHtmlNode.nodeType === 11) ? appendHtmlNode.childNodes.length : 1;
	            dojo.place(appendHtmlNode, _clone, "last");
			}
			//console.log("generateEllipsis(offset at begin)-->" + offset);
			// if node supplied has nothing in it just add the appendHtmlNode and return.
	        if (aNode.innerHTML === "") {
	            dojo.place(appendHtmlNode, aNode, "last");
	            return;
	        }
	        //console.debug("generateEllipsis: dojo.marginBox(el).h:",dojo.marginBox(el).h);
	        //console.debug("generateEllipsis: dojo.style(el, 'height'):",dojo.style(el, 'height'));
	        // define some styles for the cloned node.
	        var style = {display: '', overflow: 'visible'};
	        if (multiline) {
	            style.height = 'auto';
	        } else {
	            style.width = 'auto';                
	        }
	        dojo.style(_clone, style);
	        // place cloned node as the last child of the node supplied.
	        dojo.place(_clone, aNode, "after");
	        
	        // local function used for single line. Checks if the cloned nodes width is greater
	        // then the width of the node that was passed as an argument. If so returns true.
	        function width() { 
	            var isOverflowing = Math.round(dojo.style(_clone, 'width')) > elWidth;
	            if(isOverflowing){
	                //console.debug("generateEllipsis::width()-->",isOverflowing);
	            }
	            return isOverflowing;
	        }
	        // local function used for multiline. Checks if the cloned nodes height is greater
	        // then the height of the node that was passed as an argument. If so returns true.
	        function height() {
	            var isOverflowing = Math.round(dojo.style(_clone, 'height')) > elHeight;
	            if(isOverflowing){
	                //console.debug("generateEllipsis::height(): height()-->" + isOverflowing);
	            }
	            return isOverflowing;
	        }

	        var func = (multiline) ? height : width;
	        
	        var lastNode, i=0;
	            
	        function chopText(node, until) {
	            // Summary: 
	            //     Given a DOM node it will remove text char by char from the inner most
				//     children until it fits in the allowed space. If all the chars have been
				//     removed from particular node it will work its way up the siblings until 
				//     it fits or there are no more siblings.
				//
				// node: HTMLElement
				//      The HTML Element from which to remove characters
				//
				// until: function
				//      The function that will be called after a char is removed to check
				//      whether we should continue removing characters
	            var value, lc;
	            if (node.nodeType === 3) { // TEXT_NODE
	                while (node.nodeValue.length && until()) {
	                	if(maxTextLengthAllowed > 5 && node.nodeValue.length > maxTextLengthAllowed ){
	                		value = node.nodeValue.substr(0, maxTextLengthAllowed);
	                		//extraTextTruncated = true;
	                	} else {
	                        value = node.nodeValue;
	                	}
	                    node.nodeValue = value.substr(0, value.length - 1);
	                    //console.debug("generateEllipsis: at the end of inner char loop: ", _clone.innerHTML);
	                }
	                if (!node.nodeValue.length) {
	                    node.parentNode.removeChild(node);
	                }
	            } else if(node.nodeType === 1) { //ELEMENT_NODE
	                if (node.childNodes.length > 0) {
	                    lc=node.lastChild;
	                    while(lc && until()) {
	                        chopText(lc, until);
	                        lc=node.lastChild;
	                    }
	                } else {
	                    node.parentNode.removeChild(node);
	                }
	            } else {
	                node.parentNode.removeChild(node);
	            }
	        }
	        
	        while (_clone.innerHTML.length && func()) {
	            //console.debug("generateEllipsis: at the beginning of loop: ", _clone.innerHTML);
	            if (i === 0) {
	                // append the 'more' span only if needed
	                ellipsisNode = dojo._toDom(ellipsisHtml);
	                dojo.place(ellipsisNode, _clone, _clone.childNodes.length-offset);
	                offset += (ellipsisNode.nodeType === 11)?ellipsisNode.childNodes.length:1;
	                i++;
	            }
	            
	            lastNode = _clone.childNodes[_clone.childNodes.length - (1+offset)]; // Get the direct nodes of the element
	            chopText(lastNode, func);
	            //console.debug("generateEllipsis: at the end of loop: ", _clone.innerHTML);
	        }

	        //console.debug("generateEllipsis: setting original el's innerHTML to '", _clone.innerHTML,"'");
	        dojo.html.set(aNode, _clone.innerHTML);
	        //console.debug("generateEllipsis: removing cloned node");
	        _clone.parentNode.removeChild(_clone);
	        //console.debug("generateEllipsis: done!");
			var elapsed = new Date().getTime() - startTime;
			console.log("generateEllipsis: Time taken to do ellipses(ms)-->" + elapsed);
	    }
	}
});