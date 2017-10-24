/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module business
 **/

(function (ns, $, console) {
	"use strict";
	/**
	 * Diese Command-Klasse wird aufgerufen, wenn man MediaCollection-Objekte aus einem JSON-Objekt anfordert
	 * @class GetMediaCollectionByJsonCmd
	 * @constructor
	 * @public
	 **/
	var GetMediaCollectionByJsonCmd = function (player) {

		this._player = player;

		this.initialize();
	};

	var p = GetMediaCollectionByJsonCmd.prototype;

	/**
	 * Initialization Methode.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function () {
	};

	/**
	 * Diese Methode löste das Command aus.
	 * @methode execute
	 * @public
	 * @param data Typ: string. - URL der JSON Datei
	 * @param callback Typ: function. - Eventhandler dass im Anschluss aufgerufen werden soll
	 */
	p.execute = function (data, callback) {

		var owner = this;

		if (callback)
			this._callback = callback;

		var isError = true;

		if (data) {
			//if (data instanceof ns.MediaCollection) {
			if (typeof data == "object") {
				isError = false;
				this.parseData(JSON.parse(JSON.stringify(data)));
			}
			else if (!$.isBlank(data)) {
				isError = false;
				$.getJSON(data, ns.Delegate.create(this, this.parseData))
					.fail(function (jqXHR, textStatus, errorThrown) {
						owner._callback(undefined);
						owner._callback = null;
						ns.ErrorController.getInstance(owner._player).throwError(ns.ErrorController.MC_JSON_FILE_NOT_FOUND, ns.ErrorController.IS_CRITICAL_YES, data);
					});
			}
		}
		if (isError) {
			ns.ErrorController.getInstance(owner._player).throwError(ns.ErrorController.MC_JSON_FILE_WRONG_URI, ns.ErrorController.IS_CRITICAL_YES, data);
			// alert("illegal data for mc");
		}
	};

	/**
	 * Die Methode wird ausgelöst als Eventhandler, während der Ausführung des getJSON-Aufrufs
	 * @methode parseData
	 * @param data. Typ: JSON.
	 * @private
	 */
	p.parseData = function (data) {
		var mc;
		if (data) {
			mc = new ns.MediaCollection();
			$.each(data, function (key, value) {

				if (key === "_download") {
					if (value != "false" && value != false) {
						mc.setDownloadClickFunction(eval(value));
					}
				}
				else if (key === "_podcast") {
					if (value != "false" && value != false) {
						mc.setPodcastClickFunction(eval(value));
					}
				}
				else if (key === "_mediaArray") {
					$.each(value, function (plugInIndex, media) {
						mc.addMedia(media._plugin);

						if (media && media._mediaStreamArray) {
							for (var i = 0; i < media._mediaStreamArray.length; i++) {
								var mediaValue = media._mediaStreamArray[i];
								if ((mediaValue._server + mediaValue._stream).length > 0) {
									mc.addMediaStream(media._plugin, mediaValue._quality, mediaValue._server, mediaValue._stream, mediaValue._cdn, mediaValue._label, mediaValue._description);
								}
							}
						}

					});
				}
				else if (key === "_alternativeMediaArray") {
					$.each(value, function (index, alternativeMediaTypeObj) {
						//console.log("idx", index, "media", alternativeMediaTypeObj);

						$.each(alternativeMediaTypeObj._mediaArray, function (plugInIndex, media) {

							if (media && media._mediaStreamArray) {
								for (var i = 0; i < media._mediaStreamArray.length; i++) {
									var mediaValue = media._mediaStreamArray[i];
									if ((mediaValue._server + mediaValue._stream).length > 0) {
										//console.log(alternativeMediaTypeObj._type[0], media._plugin, mediaValue._quality, mediaValue._server, mediaValue._stream, mediaValue._cdn);
										mc.addAlternativeMediaStream(alternativeMediaTypeObj._type[0], media._plugin, mediaValue._quality, mediaValue._server, mediaValue._stream, mediaValue._cdn);
									}
								}
							}

						});
					});
				}
				else {
					mc [key] = value;
				}
				//log ( key +" := " + value );
			});
		}


		if (this._callback)
			this._callback(mc);

		return mc;
	};

	ns.GetMediaCollectionByJsonCmd = GetMediaCollectionByJsonCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);
