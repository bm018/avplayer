define("playerInitialize-audio", [], function() {

    var playerInitialize = function(dom_element, options) {
        this.$dom_element = $(dom_element);
        this.options = options;
        this.initialize();
    };

    playerInitialize.prototype = {
        initialize: function() {
            var that = this;
            console.log('this is playerInitialize-audio on element', this.$dom_element[0], this.options); 
        }
    };

    jsb.registerHandler('playerInitialize-audio', playerInitialize);

});
