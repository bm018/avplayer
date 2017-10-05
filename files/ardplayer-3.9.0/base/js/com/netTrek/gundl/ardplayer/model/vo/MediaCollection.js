/**
 * Class MediaCollection
 *
 * Jede Player-Instanz verwendet eine MediaCollection (Video oder Audio, isLive, defaultQuality).
 * Eine media collection verfügt über mehrere Medien-Objekte von der zur Verfügung stehenden Medien (Flash, HTML5, wm).
 * Jedes Medium hat mehrere Streams in verschiedenen Qualitätsstufen (S, M, L, XL).
 *
 * Der Unterstrich wird verwendet, um Klassen, Attribute und Methoden als privat durch Namenskonvention zu erklären.
 *
 * Created:        2009_09-25
 * Modified:    2010_09-29
 *
 * @version 0.3
 * @author Jan Voelker
 * @copyright ARD.de
 * @module vo
 */

(function (ns, $, console) {
	"use strict";
	/**
	 * Class constructor
	 * @class MediaCollection
	 * @public
	 * @constructor
	 * @param type String. Verlangte Werte sind: "video" oder "audio"
	 * @param isLive boolean. Die MediaCollection ist ein Livestream
	 * @param defaultQuality int. Die Standard-Qualität für die MediaCollection
	 */
	var MediaCollection = function (type, isLive, defaultQuality) {
		this.initialize(type, isLive, defaultQuality);
	};

	var p = MediaCollection.prototype;


	/**
	 * Initialisierungsmethode, wird vom Konstruktor aufgerufen.
	 * Hier werden die Parameter an die vorgesehenen Variablen zugewiesen.
	 * @method initialize
	 * @protected
	 * @param type String. Korrekte Werte sind: "video" oder "audio"
	 * @param isLive boolean. Die MediaCollection ist ein Livestream
	 * @param defaultQuality int. Die Standard-Qualität für die MediaCollection
	 */
	p.initialize = function (type, isLive, defaultQuality) {
		/**
		 * Typ der MediaCollection. Erlaubte Werte sind "video" oder "audio"
		 * @property  _type
		 * @private
		 * @type String.
		 **/
		this._type = type;
		/**
		 * Objekt zur Eruierung, ob die Mediacollection live ausgestrahlt wird.
		 * @property _isLive
		 * @private
		 * @type Boolean
		 **/
		this._isLive = isLive;
        /**
         * Gibt an, ob die hinterlegten Streams GEO-blockiert sind.
         * @type {boolean}
         * @private
         */
        this._geoblocked = false;
		/**
		 * Die eingestellte Qualität
		 * @property _defaultQuality
		 * @private
		 * @type uint
		 **/
		this._defaultQuality = defaultQuality;

		/**
		 * Während des Download-Prozesses wird der Wert auf true gestellt, ansonsten auf false
		 * @property _download
		 * @private
		 * @type Boolean.
		 **/
		this._download = false;
		/**
		 * Flag, ob die MediaCollection ein podcast ist, oder nicht.
		 * @property _podcast
		 * @private
		 * @type Boolean
		 **/
		this._podcast = false;
		/**
		 * URL zu dem Audiobild
		 * @property _audioImage
		 * @private
		 * @type String.
		 **/
		this._audioImage = "";
		/**
		 * URL zu dem Vorschaubild
		 * @property _previewImage
		 * @private
		 * @type String.
		 **/
		this._previewImage = "";
		/**
		 * URL zu dem Untertitel
		 * @property _subtitleUrl
		 * @private
		 * @type String.
		 **/
		this._subtitleUrl = "";
		/**
		 * Offesetwert zu dem Untertitel
		 * mit dem Offset definiert man mit welcher verschiebung (in sekunden) Untertitel ngezeigt werden soll.
		 * Damit kann man dafür sorgen, dass Untertitel Vor- oder Nach dem Ton erscheinen
		 * Abweichungen in der Event-Gesteuerten Darstellung lassen sich damit abgleichen!
		 * @property _subtitleOffset
		 * @private
		 * @type String.
		 **/
		this._subtitleOffset = 0;
		/**
		 * MediaArray
		 * @property _mediaArray
		 * @private
		 * @type Array
		 **/
		this._mediaArray = new Array(false, false, false);
		/**
		 * Alternatives MediaArray
		 * @property _alternativeMediaArray
		 * @private
		 * @type Array
		 **/
		this._alternativeMediaArray = null;
		/**
		 * PluginArray
		 * @property _pluginArray
		 * @private
		 * @type Array
		 **/
		this._pluginArray = new Array(false, false, false);
		/**
		 * SortierArray
		 * @property _sortierArray
		 * @private
		 * @type Array
		 **/
		this._sortierArray = new Array(0, 1, 2);
		/**
		 * Startzeit des Videos
		 * @property  _startTime
		 * @private
		 * @type number.
		 **/
		this._startTime = 0;
		/**
		 * Endzeit des Videos
		 * @property  _endTime
		 * @private
		 * @type number.
		 **/
		this._endTime = 0;
		/**
		 * Gibt an, ob der DVR Modus aktiviert werden soll.
		 * Voraussetzung hierfür ist, dass der Stream ebenfalls eine
		 * DVR Funktionalität mitsich bringt. Nur für Flash.
		 * @property  _dvrEnabled
		 * @private
		 * @type boolean
		 **/
		this._dvrEnabled = false;

        /**
         * AddonSprungmarken Variablen
         * @type {{_chapterSpriteImage: null, _chapterSpriteColumns: number, _chapterArray: Array}}
         * @private
         */
		this._chapters = {
			_chapterSpriteImage: null,
			_chapterSpriteColumns : 4,
			_chapterArray: []
		};

        // Pixel Controler
        this._pixelConfig = "";
	};

	/**
	 * Erstellt eine flache Kopie des kompletten Media-Arrays. Nötig, da beim Errorhandling u.a.
	 * Streams gelöscht werden (um nicht erneut angesprungen zu werden).
	 * Die Flache Kopie ermöglicht einen späteren Zugriff auf die Rohdaten, zB um die Fehlertafel
	 * anzuzeigen.
	 *
	 * Wird initial nur einmalig ausgefüht (bei Initialisierung des Players).
	 */
	p.createMediaArrayBackup = function () {

		var plugins = [],
			streamArr;

		for (var i = 0; i < this._mediaArray.length; i++) {

			plugins[i] = {};
			streamArr = this._mediaArray[i]._mediaStreamArray;

			if (!streamArr)
			{
				plugins[i] = null;
				continue;
			}

			for ( var j = 0; j < streamArr.length; j++ )
			{
				plugins[i][j] = streamArr[j];
			}

			if (streamArr['auto'])
				plugins[i]['auto'] = streamArr['auto'];
		}

		this._fullFlatMediaArrayBackup = plugins;
	};

    /**
     * Definiert den Pfad zur Pixel-Konfiguration
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setPixelConfig = function (path) {
        this._pixelConfig = path;
    };

    p.getPixelConfig = function () {
        return this._pixelConfig;
    };

	/**
	 * Fügt ein Media-Objekt zu den MediaCollection-Objekt hinzu.
	 * Teilt dem Player mit, dass ein Clip für ein bestimmtes Plugin verfügbar ist. Das Ausführen dieser Funktion erzeugt ein neues Objekt der Klasse Media.
	 * @public
	 * @method addMedia
	 * @param plugin Typ: string. Plugin 0 - flash, 1 - html5, 2 - windows media
	 * @return MediaCollection
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.addMedia = function (plugin) {
		this._mediaArray[plugin] = new ns.Media(plugin);
		return this;
	};

    /**
     * Gibt an, ob der Stream GEO-blockiert wurde.
     * @returns {boolean}
     */
    p.getGeoBlocked = function () {
        return this._geoblocked;
    };

    /**
     * Setzt das Flag, ob der Stream GEO-blockiert wurde.
     * @param flag
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setGeoBlocked = function (flag) {
        this._geoblocked = flag;
    };

    /**
     * Gibt an, ob für den Stream DVR aktiviert wurde.
     * @returns {boolean|Boolean}
     */
	p.getDVREnabled = function () {
		return this._dvrEnabled && this.getIsLive();
	};

    /**
     * Setzt das Flag, ob für den Stream DVR aktiviert wurde.
     * @param flag
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
	p.setDVREnabled = function (flag) {
		this._dvrEnabled = flag;
	};

	/**
	 * Ändert Sortierreihenfolge für Plugin-Abfrage (Standard: flash,html,wm)
	 * @public
	 * @method setSortierung
	 * @param check1 String.
	 * @param check2 String.
	 * @param check3 String.
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setSortierung = function (check1, check2, check3) {
		var arr = new Array();
		if (typeof arguments[0] != "number") {
			$.each(check1, function (ind, value) {
				arr [ind] = Number(value);
			});
		}
		else {
			arr = new Array(check1, check2, check3);
		}
		this._sortierArray = arr;
	};

	/**
	 * Gibt die aktuelle Sortierreihenfolge für die Plugin-Abfrage zurück
	 * @public
	 * @method getSortierung
	 * @return Array
	 */
	p.getSortierung = function () {

		var availableSortOrder = new Array();

		for (var i in this._sortierArray) {
			if (this._mediaArray[this._sortierArray[i]] != false) {
				availableSortOrder.push(this._sortierArray[i]);
			}
		}

		return availableSortOrder;
	};

	/**
	 * Fügt ein MediaStream-objekt zu einem MediaObject-Objekt hinzu.
	 * Für dem im MediaCollection gehaltenen Media-Objekt eine Quelle für eine bestimmte Qualitätsstufe hinzu. Teilt dem Player somit mit, welche Qualitätsstufen für ein Plugin verfügbar sind.
	 * @public
	 * @method addMediaStream
	 * @param plugin {string} Plugin 0 - flash, 1 - html5, 2 - windows media
	 * @param quality {string} Quality of the stream 0 - s, 1 - m 2 - l, 3 - xl
	 * @param server {string} Streamingserver URL
	 * @param stream {string} Stream location
	 * @param cdn {string} Definiert den CDN Namen. Standardwert ist default.
	 * @param label {string} Kurzbeschreibung der Qualität, zB "hohe"
	 * @param description {string} Langbeschreibung der Qualität, zB "Hohe Qualität"
	 * @return MediaCollection
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.addMediaStream = function (plugin, quality, server, stream, cdn, label, description) {
		cdn = $.isBlank(cdn) ? "default" : cdn;
		var mediaStream = new ns.MediaStream(quality, server, stream, cdn, label, description);
		this._mediaArray[plugin].addMediaStream(mediaStream);
		return this;
	};

	/**
	 * Fügt ein MediaStream-objekt zu einem MediaObject-Objekt hinzu (alternative Streams nach Typ).
	 * Für dem im MediaCollection gehaltenen Media-Objekt eine Quelle für eine bestimmte Qualitätsstufe hinzu. Teilt dem Player somit mit, welche Qualitätsstufen für ein Plugin verfügbar sind.
	 * @public
	 * @method addAlternativeMediaStream
	 * @param type Type des alternativen MediaArray Sets
	 * @param plugin string Plugin 0 - flash, 1 - html5, 2 - windows media
	 * @param quality string Quality of the stream 0 - s, 1 - m 2 - l, 3 - xl
	 * @param server string Streamingserver URL
	 * @param stream string Stream location
	 * @param cdn Type String. Definiert den CDN Namen. Standardwert ist default.
	 * @param label {string} Kurzbeschreibung der Qualität, zB "hohe"
	 * @param description {string} Langbeschreibung der Qualität, zB "Hohe Qualität"
	 * @return MediaCollection
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.addAlternativeMediaStream = function (type, plugin, quality, server, stream, cdn, label, description) {
		cdn = $.isBlank(cdn) ? "default" : cdn;
		var mediaStream = new ns.MediaStream(quality, server, stream, cdn, label, description);

		var mediaArray = this.getAlternativeMediaArrayByType(type);
		if ( !mediaArray[plugin] )
			mediaArray[plugin] = new ns.Media(plugin);

		mediaArray[plugin].addMediaStream(mediaStream);

		return this;
	};

	/**
	 * Gibt an, ob ein alternatives MediaArray basierend auf dem Typen existiert.
	 * @param type String
	 * @returns {boolean}
	 */
	p.hasAlternativeMediaArrayByType = function (type) {
		if ( !this._alternativeMediaArrays )
			this._alternativeMediaArrays = [];

		var curMAWrapper;
		for ( var i = 0; i < this._alternativeMediaArrays.length; i++ )
		{
			curMAWrapper = this._alternativeMediaArrays[i];
			if ( curMAWrapper._type.indexOf(type) >= 0 )
			{

				// Make sure the found media array contains a set of streams.
				// They might get nulled in case of errors.
				var ma = curMAWrapper._mediaArray;
				if ( ma != null ) {
					var numStreamEntrys = 0;
					for ( var j = 0; j < ma.length; j++ )
					{
						if ( ma[j] !== false )
							numStreamEntrys++;
					}

					if ( numStreamEntrys == 0 )
						curMAWrapper = null;
				}

				break;
			}
			else
				curMAWrapper = null;
		}

		return curMAWrapper != null;
	};

	/**
	 * Gibt das alternative MediaArray nach Typ zurück. Falls nicht vorhanden, wir ein neues erstellt.
	 * @param type String
	 * @returns {MediaArray}
	 */
	p.getAlternativeMediaArrayByType = function (type) {

		if ( !this._alternativeMediaArrays )
			this._alternativeMediaArrays = [];

		var curMAWrapper;
		for ( var i = 0; i < this._alternativeMediaArrays.length; i++ )
		{
			curMAWrapper = this._alternativeMediaArrays[i];
			if ( curMAWrapper._type.indexOf(type) >= 0 )
				break;
			else
				curMAWrapper = null;
		}

		if ( curMAWrapper == null )
		{
			curMAWrapper = {_type:[type], _mediaArray:[false, false, false] };
			this._alternativeMediaArrays.push(curMAWrapper);
		}

		return curMAWrapper._mediaArray;
	};

	/**
	 * Ermöglicht ein Plugin für ein Media
	 * Die PluginDetection befähigt ein Plugin, wenn der Client ein Plugin installiert hat
	 * und wenn die Media-Source für dieses Plugin angeboten wird
	 * @public
	 * @method enablePlugin
	 * @param plugin. Typ: string Plugin 0 - flash, 1 - html5, 2 - windows media
	 * @param version. Typ: string Version of the plugin
	 * @return void
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.enablePlugin = function (plugin, version) {
		this._pluginArray[plugin] = version;
	};

	/**
	 * Getter für ein plugin, ausgehend von seinem Namen
	 * @public
	 * @method getMediaAndPluginAvailableArray
	 * @return _pluginArray. Typ: boolean/string Plugin gefundene/plugin version
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.getMediaAndPluginAvailableArray = function () {
		return this._pluginArray;
	};

	/**
	 * Getter für das Media-Object, ausgehend von seinem pluginNamen.
	 * @public
	 * @method getMediaArray
	 * @return Array
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.getMediaArray = function () {
		//console.log("getMediaArray","alternativeMediaArray:", this._alternativeMediaArray)
		return this._alternativeMediaArray != null ? this._alternativeMediaArray : this._mediaArray;
	};

	/**
	 * Setzt das zu verwendende MediaArray anhand des Typen.
	 * @param alternativeMediaArrayType String
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setUseAlternativeMediaArrayType = function (alternativeMediaArrayType) {
		if ( this.hasAlternativeMediaArrayByType(alternativeMediaArrayType) )
			this._alternativeMediaArray = this.getAlternativeMediaArrayByType(alternativeMediaArrayType);
		else
			this._alternativeMediaArray = null;
	};

	/**
	 * Setzt einen Download-Klick-Funktion hinzu
	 * @public
	 * @method setDownloadClickFunction
	 * @param func function download click function
	 * @return MediaCollection
	 * @deprecated Entfällt in Version 3.10
	 */
	p.setDownloadClickFunction = function (func) {
		this._download = func;
		return this;
	};

	/**
	 * Getter für einen Download-Klick-Funktion
	 * @public
	 * @method getDownloadClickFunction
	 * @return function download click function
	 */
	p.getDownloadClickFunction = function () {
		return this._download;
	};

	/**
	 * Setzt eine podcast click function
	 * @public
	 * @method setPodcastClickFunction
	 * @param func function podcast click function
	 * @return MediaCollection
	 * @deprecated Entfällt in Version 3.10
	 */
	p.setPodcastClickFunction = function (func) {
		this._podcast = func;
		return this;
	};

	/**
	 * Getter für die podcast click function
	 * @public
	 * @method getPodcastClickFunction
	 * @return function podcast click function
	 */
	p.getPodcastClickFunction = function () {
		return this._podcast;
	};

	/**
	 * Setter für eine audio-bild-url
	 * @public
	 * @method setAudioImage
	 * @param url string URL
	 * @return MediaCollection
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setAudioImage = function (url) {
		this._audioImage = url;
		return this;
	};

	/**
	 * Getter ffür eine audio-bild-url
	 * @public
	 * @method getAudioImage
	 * @return String audio image url
	 */
	p.getAudioImage = function () {
		return this._audioImage;
	};

	/**
	 * Setter für eine Vorschau-Bild-URL
	 * @public
	 * @method setPreviewImage
	 * @param url string URL
	 * @return MediaCollection
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setPreviewImage = function (url) {
		this._previewImage = url;
		return this;
	};

	/**
	 * Getter  für eine Vorschau-Bild-URL
	 * @public
	 * @method getPreviewImage
	 * @return String preview image url
	 */
	p.getPreviewImage = function () {
		return this._previewImage;
	};

	/**
	 * Set a subtitle url to a subtitle file
	 * @public
	 * @method setSubtitleUrl
	 * @param subtitleUrl. Typ: String.
	 * @param subtitleOffset. Typ: String.
	 * @return MediaCollection
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setSubtitleUrl = function (subtitleUrl, subtitleOffset) {
		this._subtitleUrl = subtitleUrl;
		this._subtitleOffset = subtitleOffset;
		return this;
	};

	/**
	 * Getter für die subtitle url
	 * @public
	 * @method getSubtitleUrl
	 * @return String subtitle url
	 */
	p.getSubtitleUrl = function () {
		return this._subtitleUrl;
	};

	/**
	 * Getter für die subtitle offset
	 * @public
	 * @method getSubtitleOffset
	 * @return int subtitle offset
	 */
	p.getSubtitleOffset = function () {
		return this._subtitleOffset;
	};

	/**
	 * Getter für den Typ der MediaCollection
	 * @public
	 * @method getType
	 * @return String "video" or "audio"
	 */
	p.getType = function () {
		return this._type;
	};

	/**
	 * Getter für den isLive-status
	 * @public
	 * @method getIsLive
	 * @return Boolean
	 */
	p.getIsLive = function () {
		return this._isLive;
	};

	/**
	 * Setter um die Start- und Endzeit für die Wiedergabe
	 * @public
	 * @method setStartStopTime
	 * @param start. Typ: number. Start nach n Sekunden (0 für einen normalen Start)
	 * @param stop. Typ: number. Stopt Video nach n Sekunden (0 für ein normales Ende)
	 * @return void
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setStartStopTime = function (start, stop) {
		this._startTime = start;
		this._endTime = stop;
	};

	/**
	 * Getter die eingestellte Startzeit für die Wiedergabe zu erhalten
	 * @public
	 * @method getStartTime
	 * @return _startTime. Typ: number.
	 */
	p.getStartTime = function () {
		return this._startTime;
	};

	/**
	 * Getter die eingestellte Endzeit für die Wiedergabe zu erhalten
	 * @public
	 * @method getEndTime
	 * @return _endTime. Typ: number.
	 */
	p.getEndTime = function () {
		return this._endTime;
	};

	/**
	 * Getter für die standard-Qualität
	 * @public
	 * @method getDefaultQuality
	 * @return number 0: s, 1: m, 2: l, 3: xl
	 */
	p.getDefaultQuality = function () {
		return this._defaultQuality;
	};

	/**
	 * Setter für die standard-Qualität
	 * @public
	 * @method getDefaultQuality
	 * @param idx. Typ: number 0: s, 1: m, 2: l, 3: xl
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setDefaultQuality = function (idx) {
		this._defaultQuality = idx;
	};

	/**
	 * Setter fuer die Sprungmarken. Genauer fuer das HauptSpriteSheet
	 * @public
	 * @method setChapterSpriteImage
	 * @return void
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 * */
	p.setChapterSpriteImage = function (value) {
		this._chapters._chapterSpriteImage = value;
	};
	/**
	 * Getter fuer die Sprungmarken. Genauer fuer das HauptSpriteSheet
	 * @public
	 * @method setChapterSpriteImage
	 * @return string
	 * */
	p.getChapterSpriteImage = function () {
		return this._chapters._chapterSpriteImage;
	};
	/**
	 * Setter fuer die Sprungmarken. Genauer wieviele Frames das HauptSpriteSheet besitzt
	 * @public
	 * @method setChapterSpriteColumns
	 * @return void
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 * */
	p.setChapterSpriteColumns = function (value) {
		this._chapters._chapterSpriteColumns = value;
	};
	/**
	 * Getter fuer die Sprungmarken. Genauer wieviele Frames das HauptSpriteSheet besitzt
	 * @public
	 * @method getChapterSpriteColumns
	 * @return number
	 * */
	p.getChapterSpriteColumns = function () {
		return this._chapters._chapterSpriteColumns;
	};
	/**
	 * Setter fuer die Sprungmarken. Genauer die Defintion der einzelnen Sprungmarken
	 * @public
	 * @method setChapterArray
	 * @return void
	 * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 * */
	p.setChapterArray = function (value) {
		this._chapters._chapterArray = value;
	};
	/**
	 * Getter fuer die Sprungmarken. Genauer die Defintion der einzelnen Sprungmarken
	 * @public
	 * @method setChapterArray
	 * @return Array:  [100, "Das ist Kapitel 1" , "imgURL" ]
	 * */
	p.getChapterArray = function () {
		return this._chapters._chapterArray;
	};

	/**
	 * Die Methode klont die aktuell genutzte MediaCollection
	 * @public
	 * @method clone
	 * @return void.
	 */
	p.clone = function () {
		var clone = null;

		new ns.GetMediaCollectionByJsonCmd().execute(this, function (c) {
			if (c && c instanceof MediaCollection)
				clone = c;
		});

		return clone;
	};

	p.checkStreamIsAvailable = function (qualityIndex, pluginIdToCheck, player) {
		var mediaArray = this.getMediaArray();
		var pluginID = player.isFlashCtrl() ? ns.GlobalModel.FLASH : ns.GlobalModel.HTML5;

		if (!isNaN(pluginIdToCheck) && pluginIdToCheck >= 0 && pluginIdToCheck <= 3)
			pluginID = pluginIdToCheck;

		var mediaStreamArray = mediaArray[pluginID]._mediaStreamArray;
		var nextStream = mediaStreamArray[qualityIndex];

		return !(nextStream == false || nextStream == undefined);
	};

	p.getStreamByQualityIndex = function (qualityIndex, pluginID) {
		var mediaArray = this.getMediaArray();

		var mediaStreamArray = mediaArray[pluginID]._mediaStreamArray;
		var nextStream = mediaStreamArray[qualityIndex];

		return !(nextStream == false || nextStream == undefined) ? nextStream : null;
	};

	p.removeStreamQuality = function (pluginID, qualityIndex) {
		var mediaArray = this.getMediaArray();
		try {
			var mediaStreamArray = mediaArray[pluginID]._mediaStreamArray;
			mediaStreamArray[qualityIndex] = false;
		} catch ( err ) {
		}
	};

	p.getAvailableQualities = function (forPluginID) {
		var mediaArray = this.getMediaArray()[forPluginID];
		if (mediaArray && mediaArray._mediaStreamArray) {
			return mediaArray._mediaStreamArray;
		}

		return [];
	};

	p.getNumAvailableQualities = function (forPluginID) {
		var numAvailable = 0;

		var mediaArray = this.getMediaArray()[forPluginID];
		if (mediaArray && mediaArray._mediaStreamArray) {
			for (var i = 0; i < mediaArray._mediaStreamArray.length; i++) {
				if (mediaArray._mediaStreamArray[i]) {
					numAvailable++;
				}
			}

			if (mediaArray._mediaStreamArray["auto"])
				numAvailable++;
		}

		return numAvailable;
	};

	p.getMaxNumAvailableQualities = function () {

		var gm = ns.GlobalModel.getInstance();

		var max = 0;
		if ( gm.isFlashSupported )
		{
			max = this.getNumAvailableQualities(ns.GlobalModel.FLASH);
		}

		if ( gm.isHTML5Supported )
		{
			var hsup = this.getNumAvailableQualities(ns.GlobalModel.HTML5);
			if ( hsup > max )
				max = hsup;
		}

		return max;
	};

	p.getUsedCDNList = function () {

		var cdnList = [];

		var media,
			i, j,
			medias = this._mediaArray,// FIXME - Concat all MediaArrays..
			mediaCount = medias.length,
			mediaStreamArray, streamCount, streamItem;

		for (j = 0; j < mediaCount; j++) {
			media = medias[j];

			if (media && media != false && media instanceof ns.Media) {
				mediaStreamArray = media.getMediaStreamArray();
				streamCount = mediaStreamArray.length;

				for (i = 0; i < streamCount; i++) {
					streamItem = mediaStreamArray[i];

					if (streamItem && streamItem != false && streamItem instanceof ns.MediaStream) {
						var cdn = streamItem.getCDN();
						if ($.inArray(cdn, cdnList) < 0) {
							cdnList.push(cdn);
						}
					}
				}

				streamItem = mediaStreamArray["auto"];
				if (streamItem instanceof ns.MediaStream) {
					var cdn = streamItem.getCDN();
					if ($.inArray(cdn, cdnList) < 0) {
						cdnList.push(cdn);
					}
				}
			}
		}

		return cdnList;
	};

	/**
	 * Statischer Wert der für den playertypen genutzt wird
	 * @public
	 * @static
	 * @constant
	 */
	MediaCollection.TYPE_VIDEO = "video";
	/**
	 * Statischer Wert der für den playertypen genutzt wird
	 * @public
	 * @static
	 * @constant
	 */
	MediaCollection.TYPE_AUDIO = "audio";
	/**
	 * Statischer Wert der definiert, um welche Streamqualität es sich handelt
	 * @public
	 * @static
	 * @constant
	 */
	MediaCollection.DEFAULT_STREAM_QUALITY_S = 0;
	/**
	 * Statischer Wert der definiert, um welche Streamqualität es sich handelt
	 * @public
	 * @static
	 * @constant
	 */
	MediaCollection.DEFAULT_STREAM_QUALITY_M = 1;
	/**
	 * Statischer Wert der definiert, um welche Streamqualität es sich handelt
	 * @public
	 * @static
	 * @constant
	 */
	MediaCollection.DEFAULT_STREAM_QUALITY_L = 2;
	/**
	 * Statischer Wert der definiert, um welche Streamqualität es sich handelt
	 * @public
	 * @static
	 * @constant
	 */
	MediaCollection.DEFAULT_STREAM_QUALITY_XL = 3;
	/**
	 * Statischer Wert der definiert, um welche Streamqualität es sich handelt
	 * @public
	 * @static
	 * @constant
	 */
	MediaCollection.DEFAULT_STREAM_QUALITY_AUTO = "auto";

	/** @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt. */
	ns.MediaCollection = MediaCollection;

})(ardplayer, ardplayer.jq, ardplayer.console);