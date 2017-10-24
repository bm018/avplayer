/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module core
 **/

(function (ns, $, console) {

    $(ns).ready(function () {

        var query = ns.GlobalModel.getInstance().startParams;

        var players = $('div').filter(function () {
            return $(this).attr("id") && $(this).attr("id").match(/^player\d{1,2}$/i) != undefined;
        });

        var ids = new Array();

        $.each(players, function (key, value) {
            var id = $(value).attr("id");
            if (query && query [id + "mc"] && query [id + "pc"]) {
                $(value).hideWithClass();
                ids.push(id);
            }
        });
        ids.sort();

        var currentPlayer;

        function initNextPlayer() {

            if (currentPlayer)
                currentPlayer.showWithClass();

            if (ids && ids.length > 0) {
                var t_id = ids.shift();
                currentPlayer = $(t_id);
                currentPlayer.hideWithClass();
                initPlayer(t_id);
            }
        }

        function initPlayer(id) {
            if (query && query [id + "mc"] && query [id + "pc"]) {
                new ns.Player(id, initNextPlayer);

            }
            else
                initNextPlayer();
        }

        initNextPlayer();

    });

})(ardplayer, ardplayer.jq, ardplayer.console);
