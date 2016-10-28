"use strict";

var Widget = require('./widget').Widget,
    util = require('../util');

var $ = util.$;
var _t = util.gettext;

var NS = 'annotator-adder';


// Adder shows and hides an annotation adder button that can be clicked on to
// create an annotation.
var Adder = Widget.extend({

    constructor: function (options) {
        Widget.call(this, options);

        this.ignoreMouseup = false;
        this.annotation = null;

        this.onCreate = this.options.onCreate;

        var self = this;
        this.element
            .on("click." + NS, 'button', function (e) {
                self._onClick(e);
            })

        this.document = this.element[0].ownerDocument;
        // $(this.document.body).on("mouseup." + NS, function (e) {
        //     self._onMouseup(e);
        // });
    },

    destroy: function () {
        this.element.off("." + NS);
        $(this.document.body).off("." + NS);
        Widget.prototype.destroy.call(this);
    },

    // Public: Load an annotation and show the adder.
    //
    // annotation - An annotation Object to load.
    // position - An Object specifying the position in which to show the editor
    //            (optional).
    //
    // If the user clicks on the adder with an annotation loaded, the onCreate
    // handler will be called. In this way, the adder can serve as an
    // intermediary step between making a selection and creating an annotation.
    //
    // Returns nothing.
    load: function (annotation) {
        this.annotation = annotation;
        this.show();
    },

    // Public: Show the adder.
    //
    // position - An Object specifying the position in which to show the editor
    //            (optional).
    //
    // Examples
    //
    //   adder.show()
    //   adder.hide()
    //   adder.show({top: '100px', left: '80px'})
    //
    // Returns nothing.
    show: function () {
        Widget.prototype.show.call(this);
    },

    // Event callback: called when the mouse button is depressed on the adder.
    //
    // event - A mousedown Event object
    //
    // Returns nothing.
    _onMousedown: function (event) {
        // Do nothing for right-clicks, middle-clicks, etc.
        if (event.which > 1) {
            return;
        }

        event.preventDefault();
        // Prevent the selection code from firing when the mouse button is
        // released
        this.ignoreMouseup = true;
    },

    // Event callback: called when the mouse button is released
    //
    // event - A mouseup Event object
    //
    // Returns nothing.
    _onMouseup: function (event) {
        // Do nothing for right-clicks, middle-clicks, etc.
        if (event.which > 1) {
            return;
        }

        // Prevent the selection code from firing when the ignoreMouseup flag is
        // set
        if (this.ignoreMouseup) {
            event.stopImmediatePropagation();
        }
    },

    // Event callback: called when the adder is clicked. The click event is used
    // as well as the mousedown so that we get the :active state on the adder
    // when clicked.
    //
    // event - A mousedown Event object
    //
    // Returns nothing.
    _onClick: function (event) {
        // Do nothing for right-clicks, middle-clicks, etc.
        if (event.which > 1) {
            return;
        }

        event.preventDefault();

        // Hide the adder
        this.hide();
        this.ignoreMouseup = false;

        // Create a new annotation
        if (this.annotation !== null && typeof this.onCreate === 'function') {
            this.onCreate(this.annotation, event);
        }
    }
});

Adder.template = [
    '<div class="annotator-adder btn btn-default annotator-hide">',
    '  <button type="button ">Annotate</button>',
    '</div>'
].join('\n');

// Configuration options
Adder.options = {
    // Callback, called when the user clicks the adder when an
    // annotation is loaded.
    onCreate: null
};


exports.Adder = Adder;
