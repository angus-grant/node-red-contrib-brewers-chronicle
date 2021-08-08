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
            var device_name = globalContext.get("deviceName", "storeInFile");
            var brew_log_id = globalContext.get("selected_batch_id", "storeInFile");
            var bc_apikey = globalContext.get("bc_api_key", "storeInFile");

            bcService.setCredentials(bc_apikey);

            switch (this.readingtype) {
               case "3": /* Ferment target temp */
                    var json = "{ 'AssetName' : '" + device_name + "', 'AssetAPIId' : '" + device_name  + "_TargetTemp', 'ReadingValue' : '" + msg.payload  + "', 'ControlSoftwareName' : 'bc_node_red_device', 'Notes' : '' } ";
                    msg.payload = await bcService.postFermentSessionReading(json);
                    break;
                case "4": /* Ferment temp */
                    var json = "{ 'AssetName' : '" + device_name + "', 'AssetAPIId' : '" + device_name  + "_CurrentTemp', 'ReadingValue' : '" + msg.payload  + "', 'ControlSoftwareName' : 'bc_node_red_device', 'Notes' : '' } ";
                    msg.payload = await bcService.postFermentSessionReading(json);
                    break;
                case "10": /* Ferment cooling status */
                    var json = "{ 'AssetName' : '" + device_name + "', 'AssetAPIId' : '" + device_name  + "_CoolingStatus', 'ReadingValue' : '" + msg.payload  + "', 'ControlSoftwareName' : 'bc_node_red_device', 'Notes' : '' } ";
                    msg.payload = await bcService.postFermentSessionReading(json);
                    break;
                case "20": /* Ferment heating status */
                    var json = "{ 'AssetName' : '" + device_name + "', 'AssetAPIId' : '" + device_name  + "_HeatingStatus', 'ReadingValue' : '" + msg.payload  + "', 'ControlSoftwareName' : 'bc_node_red_device', 'Notes' : '' } ";
                    msg.payload = await bcService.postFermentSessionReading(json);
                    break;
                case "13": /* Mash started */
                case "14": /* Mash Ended */
                case "16": /* Mash step ended */
                    msg.payload = await bcService.postBoilSessionReading(brew_log_id, this.readingtype, "");

                    break;
                case "17": /* Mash-in temp */
                case "15": /* Mash step started */
                case "18": /* Mash target temp */
                case "19": /* Mash temp */
                    msg.payload = await bcService.postBoilSessionReading(brew_log_id, this.readingtype, msg.payload);

                    break;
            }

            send(msg);
            if (done) done();
        });
    }
    RED.nodes.registerType("brewers-chronicle-post",BrewersChroniclePostReadingNode);
}
