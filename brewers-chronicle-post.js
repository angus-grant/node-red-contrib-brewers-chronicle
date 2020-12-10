/*
The majority of this work was copied from node-red-contrib-brewfather
I did add in the httpService.getWithJson function to handle posting json into a get request
https://github.com/enorfelt/node-red-contrib-brewfather/blob/master/core/brewfather-service.js
*/

module.exports = function(RED) {
    "use strict";
    const bcService = require("./core/brewerschronicle-service");
    
    function BrewersChroniclePostReadingNode(config) {
        RED.nodes.createNode(this,config);
        
        this.name = config.name;
        this.readingtype = config.readingtype;
        this.readingvalue = config.readingvalue;
        this.readingvaluetype = config.readingvaluetype;
        
        var node = this;
        node.on("input", async function (msg, send, done) {
            var globalContext = this.context().global;
            var brew_log_id = globalContext.get("selected_batch_id", "storeInFile");
            var bc_apikey = globalContext.get("bc_api_key", "storeInFile");
            
            bcService.setCredentials(bc_apikey);

            switch (this.readingtype) {
                case "13": /* Mash started */
                case "14": /* Mash Ended */
                case "16": /* Mash step ended */
                    msg.payload = await bcService.postBoilSessionReading(brew_log_id, this.readingtype, "");

                    break;
                case "17": /* Mash-in temp */
                case "15": /* Mash step started */
                case "18": /* Target temp */
                case "19": /* Temp */
                    var outValue;
                    var promise = new Promise((resolve,reject) => {
                            RED.util.evaluateNodeProperty(this.readingvalue,this.readingvaluetype,node,msg,(err,value) => {
                                if (err) {
                                    reject(err);                                
                                } else {
                                    outValue = parseFloat(value.toFixed(1));
                                    resolve();
                                }
                            });                            
                        });               
                    
                    msg.payload = await bcService.postBoilSessionReading(brew_log_id, this.readingtype, outValue);

                    break;
            }
            
            send(msg);
            if (done) done();
        });
    }
    RED.nodes.registerType("brewers-chronicle-post",BrewersChroniclePostReadingNode);
}