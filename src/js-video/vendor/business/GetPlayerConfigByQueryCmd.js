/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse erstellt die PlayerConfiguration die der Entwickler über die URL des Browsers übergeben kann
     * @class GetPlayerConfigByQueryCmd
     * @constructor
     * @public
     **/
    var GetPlayerConfigByQueryCmd = function () {
        this.initialize();
    };

    var p = GetPlayerConfigByQueryCmd.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {

    };

    /**
     * Diese Methode löste das Command aus.
     * @methode execute
     * @public
     * @param queryObject Typ: Object.
     * @param callback Typ: function. - Eventhandler dass im Anschluss aufgerufen werden soll
     */
    p.execute = function (queryObject, callback) {
        var q = queryObject || ns.GlobalModel.getInstance().startParams,
            pc;
        if (q) {
            pc = new ns.PlayerConfiguration();
            this.parseRepresentation(q, pc);                       // queryObject.reps
            pc.setShowOptions((q.opt && q.opt === "1") ? true : false);
            pc.setShowToolbar((q.tb && q.tb === "1") ? true : false);
            pc.setShowToolbarDownloadButtons((q.tbd && q.tbd === "1") ? true : false);
            pc.setShowToobarQualButtons((q.tbq && q.tbq === "1") ? true : false);
            pc.setShowToobarQualNavButtons((q.tbqn && q.tbqn === "1") ? true : false);
            pc.setZoomEnabled((q.zoom && q.zoom === "1") ? true : false);
            pc.setShowSettings((q.set && q.set === "1") ? true : false);
            pc.setRememberCurrentTime((q.rem && q.rem === "0") ? false : true);
            pc.setAutoPlay((q.auto && q.auto === "1") ? true : false);
            pc.setAutoSave((q.autosv && q.autosv === "1") ? true : false);
            //offset                                             queryObject.time
            if (q.time && q.time.split(",").length == 2) {
                var offsetTime = q.time.split(",");
                pc.setStartStopTime(Number(offsetTime[0]), Number(offsetTime[1]));
            }
            //disable subtitel at start                          queryObject.dsas //disable subtitel at start
            if (q.dsas && q.dsas === "1") {
                pc.setNoSubtitelAtStart();
            }
        }
        if (callback)
            callback(pc);

        return pc;
    };

    /**
     * Die Methode wird ausgelöst zu Beginn des Commands.
     * Hier wird die für die Playerconfiguration die objekte erstellt und anschliessend in die setRepresentation-Funktion übergeben,
     * setRepresentation == Stellt die Darstellung auf ein Qualitätsniveau ein
     * @methode parseData
     * @param queryObject String welches kommasepariert die Representationen beinhaltet
     * @param pc PlayerConfiguration in welche die Representationen abgelegt werden müssen
     * @private
     */
    p.parseRepresentation = function (queryObject, pc) {
        if (queryObject.reps) {
            var repsList = queryObject.reps.split(",");
            if (repsList.length % 4 === 0) {
                var ind = 0;
                while (repsList.length > 0) {
                    pc.setRepresentation(ind++, repsList.shift(), repsList.shift(), repsList.shift(), repsList.shift());
                }
            }
        } else {
            //this.playerconfig.setRepresentation(quality,, width, height, inLayer, scale)
            pc.setRepresentation(0, 256, 144, false, true);
            pc.setRepresentation(1, 512, 288, false, true);
            pc.setRepresentation(2, 960, 540, true, true);
            pc.setRepresentation(3, 1280, 720, true, true);
        }
    };

    ns.GetPlayerConfigByQueryCmd = GetPlayerConfigByQueryCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);
