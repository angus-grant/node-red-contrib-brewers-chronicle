module.exports = function(RED) {
     "use strict";
     const bcService = require("./core/brewerschronicle-service");

    function BrewersChronicleGetNode(config) {
        RED.nodes.createNode(this,config);
        
        this.name = config.name;
        this.getmethod = config.getmethod;
        
        var node = this;
        node.on("input", async function (msg, send, done) {
            var globalContext = this.context().global;
            var brew_log_id = globalContext.get("selected_batch_id", "storeInFile");
            var bc_apikey = globalContext.get("bc_api_key", "storeInFile");
            
            bcService.setCredentials(bc_apikey);
            
            switch (this.getmethod) {
                case "BoilSessions":
                    msg.payload = await bcService.getBoilSessions(node, msg, config);

                    break;
                case "BoilSessionInfo":
                    msg.payload = await bcService.getBoilSessionInfo(brew_log_id);

                    break;
            }
            
            send(msg);
            if (done) done();
        });
    }
    RED.nodes.registerType("brewers-chronicle-get",BrewersChronicleGetNode);
}