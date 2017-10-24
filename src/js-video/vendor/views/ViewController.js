/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module views
 **/

(function (ns, $, console) {
	"use strict";
	/**
	 * Das ist die Klasse die alle DOM-Elemente aus der index.html-Datei  und für die JS-Dateien verfgübar macht.
	 * Da für jeden Player
	 * @class ViewController
	 * @constructor
	 * @public
	 * @param player
	 * @return void
	 **/
	var ViewController = function (player) {
		if (ViewController.playerIDs == undefined)
			ViewController.playerIDs = {};
		if (ViewController.players == undefined)
			ViewController.players = [];

		var playerID = undefined;
		if (player && player instanceof ns.Player) {
			playerID = player.getId();
		}

		if (playerID == undefined) {
			var errorCtrl = ns.ErrorController.getInstance();
			errorCtrl.throwError(ns.ErrorController.NO_PLAYER_DEFINED, ns.ErrorController.IS_CRITICAL_YES);
		}

		if (ViewController.playerIDs [playerID]) {
			return ViewController.playerIDs [playerID];
		}
		ViewController.playerIDs [playerID] = this;
		ViewController.players.push(player);

		/**
		 * Div-id für diesen Player
		 * @property playerID
		 * @type String
		 */
		this.playerID = playerID;
		/**
		 * Playerinstanz von diesem Model
		 * @property player
		 * @type Player
		 */
		this.player = player;

		this.initialize();
	};

	/**
	 * Diese Funktion löscht die notwendigen Singleton-Instanzen.
	 * Somit wird es ermöglicht  der ViewController neu erstellt werden.
	 * @method resetSingleton
	 * @public
	 * @return void
	 **/
	ViewController.resetSingleton = function () {
		ViewController.playerIDs = undefined;
		ViewController.players = undefined;
	};

	/**
	 * Singletonfactory für eine Playerinstanz
	 * @method getInstance
	 * @public
	 * @static
	 * @param player
	 * @return ViewController
	 */
	ViewController.getInstance = function (player) {
		return new ViewController(player);
	};

	/**
	 * Gibt den ViewController für eine playerid zurück
	 * @method getInstanceByPlayerID
	 * @public
	 * @static
	 * @param playerID
	 * @return ViewController
	 */
	ViewController.getInstanceByPlayerID = function (playerID) {
		return ViewController.playerIDs [playerID];
	};

	var p = ViewController.prototype,
		dbClickTimeoutID,
		lastClick = 0;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 * @return void
	 **/
	p.initialize = function () {

		/**
		 * wird auf true gestellt bei einem kritischen Fehler!
		 * @type {Boolean}
		 */
		this.isErrorState = false;

        var isMobileFlag = ns.GlobalModel.getInstance().isMobileDevice;
        this.moveEventName = isMobileFlag ? "touchmove" : "mousemove";
        this.downEventName = isMobileFlag ? "touchstart" : "mousedown";
        this.clickEventName = isMobileFlag ? "touchend" : "click";
        this.clickEventIsMove = false;

		var vc = this,
			pl = vc.player,
			m = pl.model,
			pc = m.playerConfig,
			mc = m.mediaCollection,
			g = ns.GlobalModel.getInstance();

		this.playerDiv = $('#' + vc.playerID);
		this.tabFadePrevention = false;

        this.setRepresentationsClasses(vc.player.model.playerConfig.getRepresentationClass(0));

		generateViewport(vc, vc.playerDiv);

		generatePosterframe(vc, vc.viewport);
		generatePosterControl(vc, vc.viewport);

        if ( mc.getType() === ns.MediaCollection.TYPE_AUDIO )
        {
            generateAudioframe(vc, vc.viewport);
        }

		generateBufferingIndicator(vc, vc.viewport);

		generateMainControlbar(vc);     // controls-aktiv

        if (!mc.getIsLive() || mc.getDVREnabled()) {
            generateTimelineContainer(vc);
        }

		generateMainControlbarBox(vc);  // controlbar-box

		// #7674 set meta-css classes according to controlbar size
		this.measureControlbarDimension();

		generateMainCtrls(vc);          // controlbar01

		generateButtonTransportBox(vc);

		generatePlayPause(vc);
		generatePlayAgain(vc);

		if (mc.getType() === ns.MediaCollection.TYPE_AUDIO) {
			if (this.player.model.playerConfig.getShowEqualizer()) {
				generateEqualizer(vc);
			}
		}

		generateTimeConatiner(vc);

		generateFunctionButtonBox(vc);

		// Versions-Label im Player (#10822)
		generateVersionLabel(vc);

		if (this.player.isPrerollPlayer())
        {
            generatePrerollInfoBanner(vc);
            generatePrerollSkipButton(vc);
        }

		generateDVRButton(vc);

		if (pc.getShowOptions() && ( pc.getShowOptions_Quality()  || pc.getShowOptions_Plugins()  ) )  {
			var numPlugins = ( mc.getMediaArray()[ns.GlobalModel.FLASH] !== false && g.isFlashSupported ) ? 1 : 0;
			numPlugins += ( mc.getMediaArray()[ns.GlobalModel.HTML5] !== false && g.isHTML5Supported ) ? 1 : 0;

			if ( numPlugins > 1 || mc.getMaxNumAvailableQualities() > 1 )
				generateOptionsButton(vc);
		}

		// Setup Plugins to register for view context
		this.player.dispatchCustomEvent(ns.Player.SETUP_VIEW, {controller: vc, viewport: vc.viewport, container: this.functionBtnBox});

		if (g.isMobileDevice === false) {
			generateSoundContainer(vc);
			generateSound(vc);
			generateSoundSlider(vc);
		}

		if (mc.getType() === ns.MediaCollection.TYPE_VIDEO) {
			generateFullscreen(vc);
		}

		// #3128
		if (vc.player.model.playerConfig.getAutoPlayBoolean() == false)
			vc.mainControlbar.hideWithClass();

		vc.fadeOutCtrlBar();

		// #3128
		this.viewport.click(function (event) {
			ns.KeyboardPlayerController.getInstance().attachNativeListeners();
		});

		// #3128
		$(document).click(function (event) {

			if (vc.player !== ns.KeyboardPlayerController.getInstance().lastPlayingPlayer)
				return;

			var clickedInVP = false;
			var currentElement = event.target;

			while (currentElement != null && currentElement.parentNode != null) {
				if (currentElement === vc.viewport[0]) {
					clickedInVP = true;
					break;
				}

				currentElement = currentElement.parentNode;
			}

			if (clickedInVP == false) {
				ns.KeyboardPlayerController.getInstance().removeNativeListeners();
			}
		});

		if (!g.isMobileDevice)
			this.observeTabIndex();

		// Setup Plugins to register for view context
		this.player.dispatchCustomEvent(ns.Player.SETUP_VIEW_COMPLETE, {controller: vc});
	};

	/**
	 * Prüft, ob die Eckbedingungen zur Anzeige des Optionsbuttons weiterhin
	 * erfüllt sind. Dies kann vorkommen, wenn bspw. ein Stream oder Plugin
	 * durch Fehlerhafte Dateien oder Konfigurationen vom Player entfernt
	 * werden.
	 */
	p.updateOptionButtonVisibility = function () {
		if ( this.optionsButton )
		{
			var vc = this,
				pl = vc.player,
				m = pl.model,
				mc = m.mediaCollection,
				g = ns.GlobalModel.getInstance();

			var numPlugins = ( mc.getMediaArray()[ns.GlobalModel.FLASH] !== false && g.isFlashSupported ) ? 1 : 0;
			numPlugins += ( mc.getMediaArray()[ns.GlobalModel.HTML5] !== false && g.isHTML5Supported ) ? 1 : 0;

			if ( numPlugins == 1 && mc.getMaxNumAvailableQualities() == 1 )
			{
				this.optionsButton.hideWithClass();
			} else
			{
				this.optionsButton.showWithClass();
			}
		}

        // Für Mobilegeräte die neue Qualität selektieren
        if ( this.nativeOptionDropdown )
        {
            if ( !this.optionsButton.isHiddenByClass() )
            {
				updateNativeOptionButtonValues(this);

                var remainingQualities = vc.representationQualityOrder.concat(vc.representationQuality);
                this.nativeOptionDropdown.children("option").filter(function() {

                    var val = $(this).val();
                    if ( val != "auto" )
                        val = parseInt(val);

                    return remainingQualities.indexOf( val ) == -1 && remainingQualities.indexOf( ""+val ) == -1;
                }).remove();

                this.nativeOptionDropdown.val(this.representationQuality);
				this.nativeOptionDropdown.showWithClass();
            } else
            {
                this.nativeOptionDropdown.hideWithClass();
            }
        }

		this.measureControlbarDimension();
	};

	/**
	 * Initialisiert die Überwachung des aktiven Tab-Index.
	 * @method observeTabIndex
	 * @public
	 * @return void
	 **/
	p.observeTabIndex = function () {

		var that = this;

		var isControlbarElement = function (domElement) {

			// Sliderelemente nicht im Fokus berücksichtigen
			if ( domElement.className.match(/ui-slider-handle/))
			{
				return false;
			}

			if ( domElement.className.match(/ardplayer-preroll-skip/))
			{
				return true;
			}

			var testElement = that.mainControlbar[0];

			var currentElement = domElement;
			while (currentElement != null && currentElement.parentNode != null) {
				if (currentElement === testElement) {
					return true;
				}

				currentElement = currentElement.parentNode;
			}

			return false;
		};

		var clickTabChangeHandler = function (event) {
			if (isControlbarElement(event.target)) {
				// Standardverhalten wiederherstellen
				that.tabFadePrevention = false;

			} else {
				// Standardverhalten wiederherstellen und Ctrlbar ausblenden
				handleTabChange(event.target);
			}
		};

		var handleTabChange = function (domElement) {

			$(document).off(that.clickEventName, clickTabChangeHandler);

			if (isControlbarElement(domElement)) {

                that.fadeInCtrlBar();
				that.tabFadePrevention = true;

				that.mainControlbar
					.stop()
					.css("opacity", 1)
                    .css("bottom", 0);

				// #3128
				ns.KeyboardPlayerController.getInstance().attachNativeListeners();

				// Allow unfocus by click
				$(document).on(that.clickEventName, clickTabChangeHandler);

			} else {

				that.tabFadePrevention = false;

				if ( !that._fullscreenEnabled ) // #9343 - Chrome: HTML Spulfunktion per Hotkeys teilw. nicht möglich
					ns.KeyboardPlayerController.getInstance().removeNativeListeners();

				// IE FIX #2800, #2256
				if ((domElement.nodeName || "").toLowerCase() != "body") {
					that.fadeOutCtrlBar();
				}
			}

		};

		if (that.player.model.playerConfig.getForceControlBarVisible() == false) {

			var focusHandler = function (e) {

				// Workaround fuer Browser, die das activeElement nicht kennen
				if (e && e.target) {
					try {
						if (document.activeElement == null) {
							document.activeElement =
								e.target == document ? null : e.target;
						}
					} catch (exception) {
					}
				}

				if (ns.KeyboardPlayerController.getInstance().lastPlayingPlayer !== that.player) {
					return;
				}

				// Sonderfall IE #4451 - Fokuselement wird gesetzt, dass eigentlich nicht in der
				// Tabreihenfolge berücksichtigt werden darf. Das Setzen erfolgt automatisch durch
				// Entfernung des Sound-Popovers (Kindelement)
				if ( document.activeElement.className == ViewController.CLASS_VOLUME_CONTAINER )
					return;

				handleTabChange(document.activeElement);
			};


			if (document.addEventListener) {
				document.addEventListener('focus', focusHandler, true);
			}
		}
	};

	/**
	 * Die dispose-Methode. Hier werden Eigenschaften aus dem ViewController auf die Startwerte zurückgesetzt
	 * @method dispose
	 * @public
	 * @return void
	 **/
	p.dispose = function () {
		this.restoreDefaults();

		if (this.mediacanvas) {
			try {
				this.mediacanvas
					.off(this.clickEventName)
					.off("dblclick");
			} catch (Exception) {
			}
			this.mediacanvas = null;
		}
	};

	/**
	 * Entfernt den VC endgültig, und löst alle sichtbaren Elemente auf. Danach ist der
	 * Controller nicht mehr in einem wiederherstellbaren Zustand!
	 */
	p.destroy = function () {
		if ( this.viewport )
		{
			this.viewport.remove();
		}
		if (this.mediacanvas) {
			try {
				this.mediacanvas
					.off(this.clickEventName)
					.off("dblclick");
			} catch (Exception) {
			}
			this.mediacanvas = null;
		}
	};

	/**
	 * Die Methode entfernt den Player der als Parameter übergeben wird, aus der Playerliste.
	 * @method forceRemovePlayer
	 * @public
	 * @param player
	 * @return void
	 **/
	ViewController.forceRemovePlayer = function (player) {

		var removalIndex = -1;
		$.each(ViewController.players, function (key, value) {
			if (value == player) {
				removalIndex = key;
			}
		});

		if (removalIndex >= 0) {
			ViewController.players.splice(removalIndex, 1);
		}

		ViewController.playerIDs[ player.getId() ] = null;
		ViewController.playerIDs[ player.getId() ] = undefined;
		delete ViewController.playerIDs[ player.getId() ];
	};

	/**
	 * Hier werden Eigenschaften aus dem ViewController auf die Startwerte zurückgesetzt
	 * @method restoreDefaults
	 * @public
	 * @return void
	 **/
	p.restoreDefaults = function () {
		var m = this.player.model;
		var mc = m.mediaCollection;

		var availableQualities = mc.getDefaultQuality();
		if ( availableQualities instanceof Array )
		{
			this.representationQualityOrder = new Array().concat(availableQualities);
			this.representationQualityOrderAutofix = false;
		} else
		{

			switch( availableQualities )
			{
				case "auto":
				case "0":
				case "1":
				case "2":
				case "3":
					this.representationQualityOrder = [availableQualities, "auto", 0, 1, 2, 3];
					break;

				default:
					this.representationQualityOrder = ["auto", 0, 1, 2, 3];
					break;
			}

			this.representationQualityOrderAutofix = true;
		}

		var gm = ns.GlobalModel.getInstance();
		var lastQuality = gm.getLastQuality();
		if ( lastQuality !== false )
		{
			// Falls Cookie Qualität bereits vorhanden, an den Anfang schieben.
			var repo = this.representationQualityOrder;
			for (var i = 0; i < repo.length; i++)
			{
				if (repo[i] == lastQuality)
				{
					repo.splice(i,1);
					i--;
				}
			}

			repo.unshift(lastQuality);
		}

		//console.log("[ap] order: " + this.representationQualityOrder);
		this.representationQuality = this.representationQualityOrder.shift();

        // Für Mobilegeräte die neue Qualität selektieren
        if ( this.nativeOptionDropdown )
        {
            this.nativeOptionDropdown.val(this.representationQuality);
        }

        // Flag, ob beim automatischen Wechsel der Repräsenationen ein Fehlerfall aufgetreten ist.
        // Dient zur nachträglichen Zuordnung von Stream / Konfigurationfehlern.
        this.representationErrorTriggered = false;

		this.hideBufferingIndicator();

		if (this.player.model.playerConfig.getAutoPlayBoolean() == false) {
			this.showPosterFrame();
			this.showPosterControl();
			this.hideAudioFrame();
		} else {
			this.hidePosterFrame();
			this.hidePosterControl();
			this.showBufferingIndicator();
		}

		// Notify plugins
		this.player.dispatchCustomEvent(ns.Player.VIEW_RESTORE_DEFAULTS);

		this.fadeOutCtrlBar();
		this.forceCtrlbarVisible = false;
		this.allowFadeInByMouseOver = true;
		this.controlbarShowing = false;

		// DVR defaults
		this._dvrEnabled = false;
		this._dvrIsLive = false;
		this._dvrWindow = 0;
		this._dvrEnabledAndRequested = false;

        this.updateDVRSlider(mc.getIsLive() ? 1 : 0, 1);

		if (this.optionsControlDiv) {
			this.optionsControlDiv.remove();
			this.optionsControlDiv = null;
		}
	};

	/**
	 * Erstellt das VersionLabel-div-Objekt, das die Player-Version anzeigt. (#10822 )
 	 * @method generateVersionLabel
	 * @public
	 * @param vc. Typ: ViewController.
	 * @param target. Typ: Das viewport-div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem targetClass hinzugefügt werden soll
	 * @return t. Typ: Div-Container
	 **/
	function generateVersionLabel(vc, target, classes) {
		vc.versionLabel = generateDiv(ViewController.CLASS_TIME_CONTAINER, vc.mainControls, vc, target, classes);
		vc.versionLabel.addClass(ViewController.CLASS_VERSIONLABEL);
		vc.versionLabel.addClass("hidden");

		var playerVersion = ardplayer.GlobalModel.VERSION;
		vc.versionLabel.html(playerVersion);

		var hostname = window.location.hostname;
        // Abfrage zum direkten Anzeigen der Version bei TuA Mediathek, lokaler Entwicklung und TuA ARD.de CMS
        if (hostname.indexOf("mediathek-tua.") > -1 || hostname.indexOf("localhost") > -1 || hostname.indexOf("www-tua.ard.de") > -1 || hostname.indexOf("lra.ard.de") > -1) {
			vc.versionLabel.removeClass("hidden");
		}
		return vc.versionLabel;
	}

	/**
	 * Erstellt einen Div-Container.
	 * @method generateDiv
	 * @public
	 * @param targetClass. Typ: Die Klasse die hinzugefügt werden soll, zu dem target oder dem defaultTarget
	 * @param defaultTarget. Typ: Das div-Player-Objekt zu dem die Klasse hinzugefügt werden soll
	 * @param vc. Typ: ViewController.
	 * @param target. Typ: Das viewport-div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem targetClass hinzugefügt werden soll
	 * @return t. Typ: Div-Container
	 **/
	function generateDiv(targetClass, defaultTarget, vc, target, classes) {
		var t = $("<div></div>")
				.appendTo(target || defaultTarget)
				.addClass(targetClass + (classes ? (" " + classes) : ''))
			;

		return t;
	};

	// Public function
	p.generateDiv = generateDiv;

	/**
	 * Erstellt einen Button.
	 * @method generateButton
	 * @public
	 * @param targetClass. Typ: Die Klasse die hinzugefügt werden soll, zu dem target oder dem defaultTarget
	 * @param defaultTarget. Typ: Das div-Player-Objekt zu dem die Klasse hinzugefügt werden soll
	 * @param vc. Typ: ViewController.
	 * @param target. Typ: Das viewport-div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem targetClass hinzugefügt werden soll
	 * @return t. Typ: Button
	 **/
	function generateButton(targetClass, defaultTarget, vc, target, classes) {
		var t = $("<button/>")
				.appendTo(target || defaultTarget)
				.addClass(targetClass + (classes ? (" " + classes) : ''))
			;

		return t;
	};

	// Public function
	p.generateButton = generateButton;

	/**
	 * Erstellt einen Span-Objekt.
	 * @method generateSpan
	 * @public
	 * @param content. Typ: String. Inhalt der in das Span-Objekt geschrieben werden soll
	 * @param targetClass. Typ: Die Klasse die hinzugefügt werden soll, zu dem target oder dem defaultTarget
	 * @param defaultTarget. Typ: Das div-Player-Objekt zu dem die Klasse hinzugefügt werden soll
	 * @param vc. Typ: ViewController.
	 * @param target. Typ: Das viewport-div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem targetClass hinzugefügt werden soll
	 * @return t. Typ: Span-Objekt
	 **/
	function generateSpan(content, targetClass, defaultTarget, vc, target, classes) {
		var t = $("<span></span>")
				.appendTo(target || defaultTarget)
				.addClass(targetClass + (classes ? (" " + classes) : ''))
				.text(content || '')
			;

		return t;
	};

	/**
	 * Fügt weitere Elemente in das DOM-Model hinzu, die programmatisch erzeugt werden.
	 * @method addGeneratedElemetToList
	 * @public
	 * @param vc. Typ: ViewController. ViewController der das Objekt kontrollieren soll
	 * @param propertyname. Typ: String. Name des Elementes das hinzugefügt wird.
	 * @param classname. Typ: String. ViewController-Konstantenname
	 * @param jqueryObj. Typ: Object. das erzeugte Div-Objekt.
	 * @param additionalClasses. Typ: Object. CSS-Klassen die hinzugefügt werden
	 * @param includeWidth. Typ: Boolean. Bool-wert der angibt, ob die Breite mit in den className hinzugefügt.
	 * @param includeHeight. Typ: Boolean. Bool-wert der angibt, ob die Höhe mit in den className hinzugefügt.
	 * @param includeBaseClass. Typ: Boolean. Definitionsklassen die mit hinzufügt werden sollen, oder nicht.
	 * @param includeAdditionalRepresentationClass. Type. Boolean. Repräsentationsklasse, die per Konfiguration hinterlegt wurde.
	 * @param includeAdditionalPlayerTypeClass. Typ: Boolean. Gibt an, ob zusätzlich der Playertyp "audio"/"video" angehängt wird.
	 * @param includeDynamicWidthHeightByScale. Typ: Boolean. Gibt an, ob abh. vom Parameter ScaleContent (Config) die Größe und Breite definiert wird.
	 * @return jqueryObj. Typ: jquery-Objekt, das in dieser Fkt. überarbeitet wurde.
	 **/
	function addGeneratedElemetToList(vc, propertyname, classname, jqueryObj, additionalClasses, includeWidth, includeHeight, includeBaseClass, includeAdditionalRepresentationClass, includeAdditionalPlayerTypeClass, includeDynamicWidthHeightByScale) {
		if (!vc.generatedElements)
			vc.generatedElements = {};

		vc.generatedElements [classname] = {
			'propertyname': propertyname,
			'instance': jqueryObj,
			'additionalClasses': additionalClasses,
			'includeWidth': includeWidth,
			'includeHeight': includeHeight,
			'includeBaseClass': includeBaseClass,
			'includeAdditionalRepresentationClass': includeAdditionalRepresentationClass,
			'includeAdditionalPlayerTypeClass': includeAdditionalPlayerTypeClass,
			'includeDynamicWidthHeightByScale': includeDynamicWidthHeightByScale
		};

		var pc = vc.player.model.playerConfig,
			mc = vc.player.model.mediaCollection,
            g = ns.GlobalModel.getInstance();

		if (includeDynamicWidthHeightByScale) {
			includeBaseClass = true;
		}

		var targetSizeId = "";
		targetSizeId = classname; // + " ardplayer-rep-" + rc;

		var isHidden = jqueryObj.isHiddenByClass();

		jqueryObj
			.removeClass();

		if (includeAdditionalRepresentationClass) {
			var repClass = pc.getRepresentationClass(vc.representationQuality);
			if (repClass != null) {
				jqueryObj.addClass("ardplayer-" + repClass);
			}
		}

		if (includeAdditionalPlayerTypeClass) {
			jqueryObj.addClass("ardplayer-" + mc.getType());
		}

		if (includeBaseClass)
        {
            if ( classname == ViewController.CLASS_MEDIA_CANVAS && g.browserIsOpera )
            {
                jqueryObj.attr("class", classname);
            } else
            {
			    jqueryObj.addClass(classname);
            }
        }

		jqueryObj.addClass(targetSizeId);

		if (isHidden)
			jqueryObj.hideWithClass();

		return jqueryObj;
	};

	// Public function
	p.addGeneratedElemetToList = addGeneratedElemetToList;

	/**
	 * Erstellt das timeContainer-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateTimeConatiner
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das timeContainer-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.timeContainer. Typ: timeContainer-Objekt
	 **/
	function generateTimeConatiner(vc, target, classes) {
		vc.timeContainer = generateDiv(ViewController.CLASS_TIME_CONTAINER, vc.mainControls, vc, target, classes)
			.attr("aria-live","off");
		return vc.timeContainer;
	};

	/**
	 * @method generateOptionsDialog
	 * @public
	 * @param vc. Typ: ViewController.
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return {*}
	 **/
	function generateOptionsDialog(vc, target, classes, raisedByKeyboard) {

		var optionsControlDiv = generateDiv(ViewController.CLASS_OPTIONS_DIALOG, vc.viewport, vc, target, classes);

		var pl = vc.player,
			m = pl.model,
			pc = m.playerConfig,
			mc = m.mediaCollection,
			g = ns.GlobalModel.getInstance();

		var active = false;
		var currentPlugin = m.currentPluginID;

		// Tabbing variables
		var focusElement = null;

		$("<a href=\"javascript:void(0)\" tabindex=\"0\" style=\"width:0px;height:0px;position:absolute;margin:0;padding:0\"></a>")
			.appendTo(optionsControlDiv)
			.on("focus", function(e) {
				vc.hideAllDialogs();

				var prevChild = vc.optionsButton.prev(":not(.ardplayer-hideclass)");

				// No previous button available, fall back to play/pause toggle
				if ( prevChild.length == 0 )
				{
					if ( !vc.playPause.isHiddenByClass() )
					{
						prevChild = vc.playPause;
					} else
					{
						if ( !vc.playagain.isHiddenByClass() )
						{
							prevChild = vc.playagain;
						}
					}
				}

				prevChild.focus();
			});

		if (pc.getShowOptions_Plugins()) {
			/* PLAYERFORMAT */
			var playerformatSection = $("<section role=\"listbox\"><h1>Playerformat:</h1></section>");
			var playerformatSelectionList = $("<ul></ul>").appendTo(playerformatSection);

			var isFlashSupported = mc.getMediaArray()[ns.GlobalModel.FLASH] !== false && g.isFlashSupported;
			var isHtmlSupported = mc.getMediaArray()[ns.GlobalModel.HTML5] !== false && g.isHTML5Supported;

			if (isFlashSupported || isHtmlSupported) {
				var numSupportedPlugins = 0;

				if (isFlashSupported) {
					numSupportedPlugins++;
					active = currentPlugin == ns.GlobalModel.FLASH;
					var btnFlash = $('<li' + (active ? ' class="selected"' : '') + ' role="option">' +
						'<a ' +
						'tabindex=\"0\" ' +
						'href="javascript:void(0)" ' +
						'title="Abspielformat Flash">' +
						'Flash</a>' +
					'</li>')
						.appendTo(playerformatSelectionList)
                        .on("keydown", function (event) {

                            if ( event.keyCode == 13 )
                            {
                                event.preventDefault();

                                if (currentPlugin != ns.GlobalModel.FLASH) {
                                    pl.pixelController.triggerPluginChanged(ns.PlayerPixelController.IA_MOUSE_PLUGIN_CHANGE);
                                    vc.changePluginSelection(ns.GlobalModel.FLASH, true);
                                    vc.activateFlash();
                                    vc.hideAllDialogs();
                                }

                                vc.optionsButton.focus();
                                return false;
                            }
                        })
						.on(vc.clickEventName, function (event) {
							if (currentPlugin != ns.GlobalModel.FLASH) {
								pl.pixelController.triggerPluginChanged(ns.PlayerPixelController.IA_MOUSE_PLUGIN_CHANGE);
								vc.changePluginSelection(ns.GlobalModel.FLASH, true);
								vc.activateFlash();
								vc.hideAllDialogs();
							}

							return false;
						})
                        // Mouseover Handling
                        .on('mouseover mouseout touchstart touchend', function (event) {
                            event.preventDefault();
                            $(event.target).toggleClass('hover');
                        });

					focusElement = btnFlash;
				}

				if (isHtmlSupported) {
					numSupportedPlugins++;
					active = currentPlugin == ns.GlobalModel.HTML5;
					var btnHTML = $('<li' + (active ? ' class="selected"' : '') + ' role="option">' +
						'<a ' +
						'tabindex=\"0\" ' +
						'href="javascript:void(0)" ' +
						'title="Abspielformat HTML5">' +
						'HTML</a></li>')
						.appendTo(playerformatSelectionList)
                        .on("keydown", function (event) {

                            if ( event.keyCode == 13 )
                            {
                                event.preventDefault();

                                if (currentPlugin != ns.GlobalModel.HTML5) {
                                    pl.pixelController.triggerPluginChanged(ns.PlayerPixelController.IA_MOUSE_PLUGIN_CHANGE);
                                    vc.changePluginSelection(ns.GlobalModel.HTML5, true);
                                    vc.activateHTML();
                                    vc.hideAllDialogs();
                                }

                                vc.optionsButton.focus();
                                return false;
                            }
                        })
						.on(vc.clickEventName, function (event) {
							if (currentPlugin != ns.GlobalModel.HTML5) {
								pl.pixelController.triggerPluginChanged(ns.PlayerPixelController.IA_MOUSE_PLUGIN_CHANGE);
								vc.changePluginSelection(ns.GlobalModel.HTML5, true);
								vc.activateHTML();
								vc.hideAllDialogs();
							}

							return false;
						})
                        // Mouseover Handling
                        .on('mouseover mouseout touchstart touchend', function (event) {
                            event.preventDefault();
                            $(event.target).toggleClass('hover');
                        });

					if ( !focusElement )
						focusElement = btnHTML;
				}

				if ( numSupportedPlugins>1 ){
					playerformatSection.appendTo(optionsControlDiv);
				} else
				{
					focusElement = null;
				}
			}

		}

		if (pc.getShowOptions_Quality()) {
			/* PLAYERQUALITAET */
			var playerqualitySection = $("<section role=\"listbox\"><h1>Qualität:</h1></section>");
			var playerqualitySelectionList = $("<ul></ul>").appendTo(playerqualitySection);

			var addRepQualityMenu = function( quality, label, ariaLabel) {
				active = vc.representationQuality == quality;

				var menuItem = $('<li' + (active ? ' class="selected"' : '') + ' role="option">' +
					'<a ' +
					'tabindex=\"0\" ' +
					'href="javascript:void(0)" ' +
					'title="' + ariaLabel + '">' + label + '</a></li>')
					.appendTo(playerqualitySelectionList)
                    .on("keydown", function (event) {

                        if ( event.keyCode == 13 )
                        {
                           event.preventDefault();

                            if ( vc.representationQuality != quality )
                            {

                                // Reset DVR
                                // #6263
                                if ( vc._dvrEnabledAndRequested && !vc._dvrIsLive )
                                    pl.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_BACK_TO_LIVE);


                                pl.pixelController.triggerQualityChanged(ns.PlayerPixelController.IA_MOUSE_QUALITY_CHANGE);

                                vc.hideAllDialogs();

                                vc.representationQualityOrder.push(vc.representationQuality);
                                vc.setQualityIndex(quality);
                            }

                            vc.optionsButton.focus();
                            return false;
                        }
                    })
					.on(vc.clickEventName, function (event) {

						if ( vc.representationQuality != quality )
						{

                            // Reset DVR
                            // #6263
                            if ( vc._dvrEnabledAndRequested && !vc._dvrIsLive )
                                pl.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_BACK_TO_LIVE);


							pl.pixelController.triggerQualityChanged(ns.PlayerPixelController.IA_MOUSE_QUALITY_CHANGE);

							vc.hideAllDialogs();

							vc.representationQualityOrder.push(vc.representationQuality);
							vc.setQualityIndex(quality);
						}

						return false;
					})
                    // Mouseover Handling
                    .on('mouseover mouseout touchstart touchend', function (event) {
                        event.preventDefault();
                        $(event.target).toggleClass('hover');
                    });

				if ( !focusElement )
					focusElement = menuItem;
			};

			active = false;

			var numAvailableQualities = mc.getNumAvailableQualities(currentPlugin);
			if ( numAvailableQualities > 1 )
			{
				playerqualitySection.appendTo(optionsControlDiv);

				var availQualities = mc.getAvailableQualities(currentPlugin),
					quality;
				for (var i = availQualities.length-1; i >= 0; i--)
				{
					quality = availQualities[i];
					if ( quality )
						addRepQualityMenu(i, quality.getLabel(), quality.getDescription());
				}

				var hasAuto = mc.checkStreamIsAvailable("auto", currentPlugin, pl);
				if ( hasAuto )
				{
					quality = mc.getStreamByQualityIndex("auto", currentPlugin);
					if ( quality )
						addRepQualityMenu("auto", quality.getLabel(), quality.getDescription());
				}
			}
		}

		$("<a href=\"javascript:void(0)\" tabindex=\"0\" style=\"width:0px;height:0px;padding:0px;margin:0px;position:absolute\"></a>")
			.appendTo(optionsControlDiv)
			.on("focus", function() {
				vc.hideAllDialogs();

				vc.optionsButton
					.next()
					.children()
					.andSelf()
					.filter("button:not(.ardplayer-hideclass)")
					.focus();
			});


		vc.hideAllDialogs();
		vc.setForceCtrlBarVisible(true);

		var oCtrlW = optionsControlDiv.width();
		var left = vc.optionsButton.position().left + 23; // 46/2 == Btn Width, static
		left -= oCtrlW / 2;
		optionsControlDiv.css("left", Math.min(left, vc.viewport.width() - oCtrlW) + "px");

        if ( mc.getIsLive() && !vc._dvrEnabledAndRequested )
        {
            optionsControlDiv.addClass("live");
        }

		vc.optionsControlDiv = optionsControlDiv;

		if ( raisedByKeyboard && focusElement )
		{
			setTimeout(function() {
				focusElement.children("a:first-child").focus();
			},50);
		}

		return optionsControlDiv;
	};

	p.hideAllDialogs = function (event) {

		// Flash Klicks auf die Bühne nicht direkt verarbeiten, sonst keine Steuerung
		// über den Flash Plugin Ctrl möglich.
		if ( !!event && event.target &&
             this.player.isFlashCtrl() &&
			 !!this.mediacanvas && event.target == this.mediacanvas[0] )
			return;

        // #11266 - Bei Klick ausserhalb der Settings sollen diese geschlossen werden
		// unregister listener
        document.removeEventListener(this.clickEventName, this.hideAllDialogs);

		// Global settings
		if (this.optionsControlDiv) {
			this.optionsControlDiv.children().off();
			this.optionsControlDiv.remove();
			this.optionsControlDiv = null;
		}

		this.setForceCtrlBarVisible(false, true);
	};

	/**
	 * Erstellt den Options Button, das Einstellungsmenü öffnet.
	 * @method generateOptionsButton
	 * @public
	 * @param vc. Typ: ViewController
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.optionsButton. Typ: Button-DIV-Objekt
	 **/
	function generateOptionsButton(vc, target, classes) {

        function handleClickLogic(triggeredByKeyboard) {
            if (vc.optionsControlDiv) {
                vc.hideAllDialogs();
            } else {
                var additionalClasses = "";
                if (vc.player.model.mediaCollection.getIsLive() && !vc._dvrEnabledAndRequested)
                    additionalClasses = "live";

                // #11266 - Bei Klick ausserhalb der Settings sollen diese geschlossen werden
                document.addEventListener(vc.clickEventName, vc.hideAllDialogs.bind(vc));

                generateOptionsDialog(vc, null, additionalClasses, triggeredByKeyboard);
            }
        }

        var g = ardplayer.GlobalModel.getInstance();

        vc.optionsButton = vc.generateButton(ViewController.CLASS_OPTIONS, vc.functionBtnBox, vc, target, classes)
            .attr({
                "title": "Auswahl Playerformat und Qualität",
                "role": "menuitem",
                "tabindex": "0",
                "onClick": "this.blur(); return false;"
            });


        if (!g.isMobileDevice) {
            vc.optionsButton
                .off("keydown")
                .off(vc.clickEventName)
                .on("keydown", function (event) {
                    if (event.keyCode == 13) {
                        handleClickLogic(true);
                        event.preventDefault();
                        return false;
                    }
                })
                .on(vc.clickEventName, function (event) {
                    handleClickLogic(false);

                    // Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
                    vc.tabFadePrevention = false;

                    return false;
                })

                // Mouseover Handling
                .on('mouseover mouseout touchstart touchend', function (event) {
                    event.preventDefault();
                    $(event.target).toggleClass('hover');
                });
        } else
        {

            var pl = vc.player,
                m = pl.model,
                pc = m.playerConfig,
                mc = m.mediaCollection,
                g = ns.GlobalModel.getInstance();

            // Mobile dropdown overlay
            var mySelect = $("<select>")
                .addClass("ardplayer-btn-settings-mobile")
                .appendTo(vc.optionsButton)

                .on("change", function (event) {
                    var quality = event.target.value;
                    if ( vc.representationQuality != quality )
                    {
                        // Reset DVR
                        // #6263
                        if ( vc._dvrEnabledAndRequested && !vc._dvrIsLive )
                            pl.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_BACK_TO_LIVE);

                        pl.pixelController.triggerQualityChanged(ns.PlayerPixelController.IA_MOUSE_QUALITY_CHANGE);

                        vc.hideAllDialogs();

                        vc.representationQualityOrder.push(vc.representationQuality);
                        vc.setQualityIndex(quality);
                    }
                });

            vc.nativeOptionDropdown = mySelect;
			updateNativeOptionButtonValues(vc);

        }

        return vc.optionsButton;
	}

	function updateNativeOptionButtonValues(vc) {

		var pl = vc.player,
			m = pl.model,
			mc = m.mediaCollection,
			mySelect = vc.nativeOptionDropdown;

		mySelect.empty();

		var numAvailableQualities = mc.getNumAvailableQualities(ns.GlobalModel.HTML5, pl);

		var remove = numAvailableQualities < 1;

		if ( numAvailableQualities > 1 )
		{
			var hasAuto = mc.checkStreamIsAvailable("auto", ns.GlobalModel.HTML5, pl);
			if ( hasAuto )
				numAvailableQualities--;

			var quality, added = 0;
			for (var i = numAvailableQualities-1; i >= 0; i--)
			{
				quality = mc.getStreamByQualityIndex(i, ns.GlobalModel.HTML5);
				if ( quality != null )
				{
					mySelect.append('<option value="' + i + '">' + quality.getDescription() + '</option>');
					added++;
				}
			}

			if ( hasAuto )
			{
				quality = mc.getStreamByQualityIndex("auto", ns.GlobalModel.HTML5);
				if ( quality != null )
				{
					mySelect.append('<option value="auto">' + quality.getDescription() + '</option>');
					added++;
				}
			}

			remove = added == 0;
		}

		if ( remove )
		{
			if ( mySelect )
				mySelect.remove();
			if ( vc.optionsButton )
				vc.optionsButton.hideWithClass();
		}
	}

    function generatePrerollInfoBanner(vc) {
        vc.prerollInfoBox = generateDiv(ViewController.CLASS_PREROLL_INFO, vc.viewport, vc);
        vc.prerollInfoBox.text("Trailer");

        return vc.prerollInfoBox;
    }

    function generatePrerollSkipButton(vc) {
        //vc.prerollSkipBox = generateDiv(ViewController.CLASS_PREROLL_SKIP, vc.viewport, vc);
        vc.prerollSkipBox = vc.generateButton(ViewController.CLASS_PREROLL_SKIP, vc.viewport, vc);
        vc.prerollSkipBox
            .html("Überspringen <i/>")
            .attr( {
                "title": "Überspringt diesen Clip",
                "tabindex": "0",
                "onClick": "this.blur(); return false;"
            })
            .off(vc.clickEventName)
            .on(vc.clickEventName, function (event) {
                vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_SKIP_PREROLL);
                vc.player.skipPreroll();
                return false;
            })

            // Mouseover Handling
            .on('mouseover mouseout touchstart touchend', function (event) {
                event.preventDefault();
                $(event.target).toggleClass('hover');
            });

        return vc.prerollSkipBox;
    };

	/**
	 * Erstellt den DVR Button, der zum "Live-Head" zurückspringt.
	 * @method generateDVRButton
	 * @public
	 * @param vc. Typ: ViewController
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.dvrBacktoLiveButton. Typ: Button-DIV-Objekt
	 **/
	function generateDVRButton(vc, target, classes) {
		var g = ns.GlobalModel.getInstance();

		if (g.isIOSDevice === false) {
			vc.dvrBacktoLiveButton = vc.generateButton (ViewController.CLASS_DVR, vc.functionBtnBox, vc, target, classes)
				.attr( {
					"title": "Sprung zur aktuellen Stelle des Livestreams [(Strg +) K]",
					"tabindex": "0",
					"onClick": "this.blur(); return false;"
				})
				.hideWithClass()
				.off(vc.clickEventName)
				.on(vc.clickEventName, function (event) {
					vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_BACK_TO_LIVE);
					vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_BACK_TO_LIVE);

					vc.player
						.seekToLive();

					vc.dvrBacktoLiveButton
						.hideWithClass();

					// Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
					vc.tabFadePrevention = false;

					return false;
				})

                // Mouseover Handling
                .on('mouseover mouseout touchstart touchend', function (event) {
                    event.preventDefault();
                    $(event.target).toggleClass('hover');
                });

			return vc.dvrBacktoLiveButton;
		}
		return null;
	};

	/**
	 * Erstellt das volumeContainer-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateSoundContainer
	 * @public
	 * @param vc. Typ: ViewController. ViewController dem das volumeContainer-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.volumeContainer. Typ: volumeContainer-Objekt
	 **/
	function generateSoundContainer(vc, target, classes) {
		vc.volumeContainer = generateDiv(ViewController.CLASS_VOLUME_CONTAINER, vc.functionBtnBox, vc, target, classes)
			.hover(function () {

				if ( vc.volumeslider &&
					!vc.optionsControlDiv)
				{
                    TweenLite.killTweensOf(vc.volumeslider);
                    TweenLite.to(vc.volumeslider, 0.4, {
                        opacity:1,
                        onStart:function () {
                            vc.volumeslider.css("display", "inline-block")
                        }
                    });
				}

			}, function () {
				if (vc.volumeslider) {
                    TweenLite.killTweensOf(vc.volumeslider);
                    TweenLite.to(vc.volumeslider, 0.4, {
                        opacity:0,
                        onComplete:function () {
                            vc.volumeslider.css("display", "none")
                        }
                    });
				}
			})
			.click(function () {
                TweenLite.killTweensOf(vc.volumeslider);
                TweenLite.to(vc.volumeslider, 0.4, {
                    opacity:1,
                    onStart:function () {
                        vc.volumeslider.css("display", "inline-block")
                    }
                });
			});

		return vc.volumeContainer;
	};

	/**
	 * Erstellt das volume-div-btn-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateSound
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das volume-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.volume. Typ: volume-Objekt
	 **/
	function generateSound(vc, target, classes) {
		vc.volume = vc.generateButton (ViewController.CLASS_VOLUME, vc.volumeContainer, vc, target, classes)
			.attr({
				"title": "Lautstärke einstellen [Pfeiltasten hoch/runter (bzw. STRG + B/V)].\nTon an/aus [STRG + M]",
				"role": "menuitem",
				"tabindex": "0",
				"aria-pressed":"false",
				"onClick": "this.blur(); return false;"
			});

		return vc.volume;
	};

	/**
	 * Erstellt das volumeslider-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateSoundSlider
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das volumeslider-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.volumeslider. Typ: volumeslider-Objekt
	 **/
	function generateSoundSlider(vc, target, classes) {

		var g = ns.GlobalModel.getInstance();

        var volumeslider, volumeRange, mouseDown;

		volumeslider = vc.volumeslider = $('<div class="ardplayer-sound-slider" aria-disabled="false" role="application" style="opacity: 0">')
            .appendTo(vc.volumeContainer)
            .hide()

            .mousedown(function (e) {
                mouseDown = true;
            })

            .mouseup(function (e) {
                mouseDown = false;

                vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_VOLUME_CHANGE, true, {volume: vc.player.getCtrl().getVolume()});
                vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_VOLUME_CHANGE, true, {volume: vc.player.getCtrl().getVolume()});
            })

            .on("mousemove", function (event) {
                if (!mouseDown)
                    return;

                var offY = $.crossbrowserPosition(event, volumeslider[0]).top;
                var percent = offY/volumeslider.height();

                volumeRange.css("height", percent*100 + "%");

                // invert
                percent = 1-percent;

                if (vc.player.getCtrl()) {

                    vc.player.getCtrl().setVolume(percent);

                    if (g && g.getMuted()) {
                        vc.player.getCtrl().toggleMuteState();
                    }

                    // Visual mute state based on #5445
                    vc.showMutedState( percent < 0.05);
                }

                // Fix 4233
                vc.tabFadePrevention = false;
            })

            .on("click", function (event) {

                var offY = $.crossbrowserPosition(event, volumeslider[0]).top;
                var percent = offY/volumeslider.height();
                volumeRange.css("height", percent*100 + "%");

                // invert
                percent = 1-percent;

                if (vc.player.getCtrl()) {

                    vc.player.getCtrl().setVolume(percent);

                    if (g && g.getMuted()) {
                        vc.player.getCtrl().toggleMuteState();
                    }

                    // Visual mute state based on #5445
                    vc.showMutedState( percent < 0.05);
                }

                // Fix 4233
                vc.tabFadePrevention = false;
            });

        volumeRange = $('<div class="ardplayer-sound-slider-range" style="height: 50%;"></div>')
            .appendTo(volumeslider);

		return vc.volumeslider;
	};

	/**
	 * Erstellt das fullscreen-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateFullscreen
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das fullscreen-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.fullscreen. Typ: fullscreen-Objekt
	 **/
	function generateFullscreen(vc, target, classes) {

		var pl = vc.player,
			g = ns.GlobalModel.getInstance();

		if (!(g.isWindowsPhone || g.isIPhoneDevice ||  g.isIPodDevice )) {

            var handleKeyDown = function (event) {

                if ( event.keyCode == 13 )
                {
                    event.preventDefault();
                    return handleClick(event, false);
                }

            }.bind(this);

            var handleClick = function (event, allowBlur) {

                // 5739
                if ( !(allowBlur === false) )
                {
                    // IE11- Try-Catch #5798
                    try {
                        vc.fullscreen.blur();
                    } catch (err) {}
                }

                // Options dialog
                if (vc.optionsControlDiv) {
                    vc.optionsControlDiv.remove();
                    vc.optionsControlDiv = null;
                }

                if ( vc._fullscreenEnabled )
                {
                    pl.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_FULLSCREEN_DEACTIVATION_BUTTON);
                } else
                {
                    pl.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_FULLSCREEN_ACTIVATION_BUTTON);
                }

                vc.toggleFullscreen();

                // Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
                vc.tabFadePrevention = false;

                return false;
            }.bind(this);

			vc.fullscreen  = vc.generateButton(ViewController.CLASS_FULLSCREEN, vc.functionBtnBox, vc, target, classes)
				.attr({
					"title": "Vollbildmodus an [aus mit ESC]",
					"aria-pressed": "false",
					"role": "menuitem",
					"tabindex": "0"
				})
                .on(vc.clickEventName, handleClick)

                // Mouseover Handling
                .on('mouseover mouseout touchstart touchend', function (event) {
                    event.preventDefault();
                    $(event.target).toggleClass('hover');
                });

            // IE11 does not allow entering fullscreen by keyboard event.
            if ( !ns.GlobalModel.getInstance().browserIsIE11 )
            {
                vc.fullscreen
                    .on("keydown", handleKeyDown)
            }

			return vc.fullscreen;
		}

		return null;
	};

	/**
	 * Wechselt zwischen Vollbild- und Normalmodus.
	 * Fallback, falls nativer Vollbild nicht untersützt wird.
	 */
	p.toggleFullscreen = function () {

		this.hideAllDialogs();

		if ( BigScreen.enabled || BigScreen.videoEnabled(this.mediacanvas[0]) )
		{
			var g = ns.GlobalModel.getInstance();

			var onEnter = function (element)
			{
				this.viewport.focus();

				this.fullscreen.attr("aria-pressed", true );
                this.fullscreen.attr("title", "Vollbildmodus aus [ESC]" );
				this._fullscreenEnabled = true;
				this.tabFadePrevention = false; //Opera
				this.fullscreen.addClass ("toggle");

                // Update Controlbar
                if ( this.mainTimelineSlider )
                    this.mainTimelineSlider.refresh();

				this.measureControlbarDimension();

				this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_FULLSCREEN_ACTIVATION);
				this.player.dispatchCustomEvent(ns.Player.TOGGLE_FULLSCREEN, {fullscreen: true});
			}.bind(this);

			var onExit = function () {
				this.fullscreen.attr("aria-pressed", false );
                this.fullscreen.attr("title", "Vollbildmodus an [aus mit ESC]" );
				this._fullscreenEnabled = false;
				this.fullscreen.removeClass ("toggle");

                // Update Controlbar
                if ( this.mainTimelineSlider )
                    this.mainTimelineSlider.refresh();

				this.measureControlbarDimension();

				if ( this.player.pixelController ) // Kann bei dynamischen Disposement bereits verworfen sein.
					this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_FULLSCREEN_DEACTIVATION);
				this.player.dispatchCustomEvent(ns.Player.TOGGLE_FULLSCREEN, {fullscreen: false});

                this.updateDVRSlider(this._lastPosition, this._lastDuration);
				this._mouseOverCtrlBar = false;

			}.bind(this);

			// Das onEnter - Event wird nicht auf iOS-Geräten aufgerufen. Dafür
			// wird dieser Workaround benötigt, der das Event wrapped.
			if (g.isIOSDevice)
			{
				BigScreen.onchange = function (element)
				{
					// Deregistrierung, da globales Event.
					BigScreen.onchange = function () {};

					onEnter(element);
				}
			}

			// Nativer Fullscreen
			// Mobile wird das Video-Element genutzt, andernfalls der gesamte Player.
			BigScreen.toggle( g.isMobileDevice ? this.mediacanvas[0] : this.playerDiv[0], onEnter, onExit );

			this.fadeInCtrlBar();

		}
		else {
			// DIV-Fullscreen
			if ( this.playerDiv.css("position")  == "fixed" )
			{
				this.playerDiv.removeAttr("style");
				this._fullscreenEnabled = false;
				this.onUserActivity(true);
				this.fullscreen.removeClass ("toggle");

                // Update Controlbar
                if ( this.mainTimelineSlider )
                    this.mainTimelineSlider.refresh();

				this.measureControlbarDimension();

                this.updateDVRSlider(this._lastPosition, this._lastDuration);

				this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_FULLSCREEN_DEACTIVATION);
				this.player.dispatchCustomEvent(ns.Player.TOGGLE_FULLSCREEN, {fullscreen: false});
			}
			else {
				this.playerDiv.css(
					{
						position: "fixed",
						top: "0",
						bottom: "0",
						left: "0",
						right: "0",
						zIndex: "20000"
					}
				);

				this._fullscreenEnabled = true;
				this.fullscreen.addClass ("toggle");

                // Update Controlbar
                if ( this.mainTimelineSlider )
                    this.mainTimelineSlider.refresh();

				this.measureControlbarDimension();

				this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_FULLSCREEN_ACTIVATION);
				this.player.dispatchCustomEvent(ns.Player.TOGGLE_FULLSCREEN, {fullscreen: true});
			}

			this.fullscreen.attr("aria-pressed", this._fullscreenEnabled );
			this.fadeInCtrlBar();
		}
	};

    p.handleLeaveFullscreenEmulation = function () {
        // Nur für Fallback per DIV
        if ( !(BigScreen.enabled || BigScreen.videoEnabled(this.mediacanvas[0])) )
        {
            this.exitFullscreen();
        }
    };

	p.exitFullscreen = function () {
		if ( this._fullscreenEnabled ) {
			this.onUserActivity(true);
			this.toggleFullscreen();
		} else
		if ( ns.GlobalModel.getInstance().isIPhoneDevice || ns.GlobalModel.getInstance().isIPodDevice )
		{
			// iPhones spielen immer im Vollbild. In diesem Fall ist die normale FS-Logik
			// nicht erforderlich.
			BigScreen.exit()
		}
	};

	p.onUserActivity = function (isActive) {
		if ( isActive )
		{
			this.fadeInCtrlBar();
		} else
		{
			this.fadeOutCtrlBar();
		}
	};

	/*
	 * Erstellt das timeControls-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateTimelineContainer
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das timeControls-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.timeControls. Typ: timeControls-Objekt
	 **/
	function generateTimelineContainer(vc, target, classes) {

        vc.sliding = false;

        var timelineContainer = generateDiv(ViewController.CLASS_TIME_CONTROLS, vc.mainControlbar, vc, target, classes);

        var g = ns.GlobalModel.getInstance();
        if (g.isMobileDevice)
            timelineContainer.addClass("mobile");

        vc.mainTimelineSlider = new ardplayer.TimelineSlider(vc, timelineContainer);

        $(vc.mainTimelineSlider).on("change", function (event) {

            var previousTime = vc.player.getCtrl().getCurrenttime();
            var targetTime = vc.player.getCtrl().setTimeByPercent(event.value);

            callTrackingPixels(vc, targetTime, previousTime, vc.player.getCtrl().mc.getIsLive());

            vc.mainTimelineSlider.setBufferPercent(0);

            var g = ns.GlobalModel.getInstance();
            if (g.isMobileDevice) {
                vc.onUserActivity(true);
            }

        });

        return vc.mainTimelineSlider;
	};

	function callTrackingPixels(vc, currentPos, previousPos, isLive) {
		var px = vc.player.pixelController;

		// Calculate dvr timings
		var dvrRelativeFrom = 0,
			dvrRelativeTo = 0;

		if (vc._dvrEnabledAndRequested) {
			dvrRelativeFrom = Math.min(vc._lastDuration - previousPos, vc._lastDuration);
			dvrRelativeTo = Math.min(vc._lastDuration - currentPos, vc._lastDuration);
		}

		var data = { seekto: currentPos, current: previousPos, dvrRelativeFrom:dvrRelativeFrom, dvrRelativeTo:dvrRelativeTo };

		if (currentPos >= previousPos) {
			px.triggerCustomPixel(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD, false, data);
			px.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_SCRUBBAR_CHANGE_POSITION_FORWARD, false, data);
		}
		else {
			if (isLive == false) {
				px.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_SCRUBBAR_CHANGE_POSITION_REWIND, false, data);
			}
			else {
				px.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_SCRUBBAR_CHANGE_POSITION_REWIND_TIMESHIFT, false, data);
			}
			px.triggerCustomPixel(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND, false, data);
		}
	};

	p.formatTimestring = function (sec, showHour) {
		var minute;
		var hour;
		var second;

		sec = sec >> 0;

		hour = (sec / 3600) >> 0;
		if (sec % 3600 == 0) {
			minute = 0;
			second = 0;
		}
		else {
			minute = ((sec - (hour * 3600)) / 60) >> 0;
			if ((sec - (hour * 3600)) % 60 == 0) {
				second = 0;
			}
			else {
				second = Math.round((sec - (hour * 3600)) % 60);
			}
		}

		if (minute < 10)
			minute = "0" + minute;
		if (second < 10)
			second = "0" + second;

		if (hour > 0 || showHour) {
			return hour + ":" + minute + ":" + second;
		} else {
			return minute + ":" + second;
		}
	};

	p.updateSliderBarsUI = function (startSeconds, currentSeconds, duration, percentBuffered) {
		var currentPercent = currentSeconds / duration * 100;
        if ( this.mainTimelineSlider && !this.sliding)
        {
            this.mainTimelineSlider.updateDVRSlider(currentSeconds, duration);
            this.mainTimelineSlider.setWatchedPercent(currentPercent);
            this.mainTimelineSlider.setBufferPercent(percentBuffered);
        }
	};

	/**
	 * Führt eine Neuberechnung der Controlbar-Dimension durch. Dabei wird festgelegt,
	 * wie viele Funktionsschaltflächen, unter Berücksichtigung der verfügbaren Fläche,
	 * angezeigt werden.
	 * Nach einem manuellen Setzen einer neuen Größe für das toplevel Player-Div sollte
	 * diese Funktion einmalig aufgerufen werden.
	 */
	p.measureControlbarDimension = function () {

		if( !this.mainControlbarBox )
			return;

		// #7674 Größenänderungen überwachen und meta-CSS entsprechend generieren
		var leftBarOffset = 170,
			buttonSize = 45;

		// Falls es sich nicht um einen DVR Clip handelt, muss kein Platz für den
		// "BackToLive" Button freigehalten werden.
		// Sonderfall Audio: Hier wird - optional - ein Equalizer angezeigt.
		if ( !this._dvrEnabledAndRequested && (!this.equalizeContainer || this.equalizeContainer.isHiddenByClass) )
			leftBarOffset -= buttonSize;

		var barWidth = this.mainControlbarBox.width() - leftBarOffset,
			nbrOfButtons = Math.max((barWidth - barWidth%buttonSize)/buttonSize, 0);

		// ab 2: falls Optionsbutton ausgeblendet ist, darf ein anderer nachrücken.
		if ( nbrOfButtons>2 && (!this.optionsButton || this.optionsButton.isHiddenByClass()) )
			nbrOfButtons++;

		this.mainControlbarBox
			.removeClassPrefix("max-buttons-")
			.addClass("max-buttons-" + nbrOfButtons);
	};

	/**
	 * Erstellt das playPause-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generatePlayPause
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das playPause-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.playPause. Typ: playPause-Objekt
	 **/
	function generatePlayPause(vc, target, classes) {
		vc.playPause = vc.generateButton(ViewController.CLASS_PLAY_PAUSE, vc.transportbox, vc, target, classes)
			.attr({
				"title": "Abspielen/Pause [(STRG +) Leertaste].\nVorspulen: [Pfeil links (bzw. STRG + Punkt)].\nZurückspulen: [Pfeil rechts (bzw. STRG + Komma)]",
				"role": "menuitem",
				"tabindex": "0"
			});

        return vc.playPause;
	};

	/**
	 * Erstellt das Equalizer-div-Objekt.
	 * @method generateEqualizer
	 * @public
	 * @param vc. Typ: ViewController
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden sollen
	 * @return vc.playPause. Typ: playPause-Objekt
	 **/
	function generateEqualizer(vc, target, classes) {
		vc.equalizeContainer = generateDiv(ViewController.CLASS_EQUALIZE, vc.transportbox, vc, target, classes);
		addGeneratedElemetToList(vc, ViewController.CLASS_EQUALIZE_SHORT, ViewController.CLASS_EQUALIZE, vc.equalizeContainer, classes, false, false, false, false, false, true);
		return vc.equalizeContainer.hideWithClass();
	};

	/**
	 * Erstellt das playagain-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generatePlayAgain
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das playagain-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.playagain. Typ: playagain-Object
	 **/
	function generatePlayAgain(vc, target, classes) {
		vc.playagain = vc.generateButton(ViewController.CLASS_PLAY_AGAIN, vc.transportbox, vc, target, classes)
			.attr({
				"title": "Erneut abspielen [Leertaste (bzw. STRG + E)]",
				"tabindex": "0",
				"onClick": "this.blur(); return false;"
			})
			.hideWithClass();

		return vc.playagain;
	};

	/**
	 * Erstellt das mainControls-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateMainCtrls
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das mainControls-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.mainControls. Typ: mainControls-Objekt
	 **/
	function generateMainCtrls(vc, target, classes) {
		vc.mainControls = generateDiv(ViewController.CLASS_MAINCONTROLS, vc.mainControlbarBox, vc, target, classes);

		vc.mainControls
			.removeClass()
			.addClass(ViewController.CLASS_MAINCONTROLS + " ardplayer-" + vc.getStateSuffix());

		return vc.mainControls;
	};

	/**
	 * Erstellt das mainControlbar-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateMainControlbar
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das mainControlbar-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.mainControlbar. Typ: mainControlbar-Objekt
	 **/
	function generateMainControlbar(vc, target, classes) {
		vc.canFadeIn = true;
		vc.mainControlbar = generateDiv(ViewController.CLASS_MAINCONTROLBAR, vc.viewport, vc, target, classes);

		vc.mainControlbar.css("opacity", 0);
		vc.mainControlbar.css("bottom", -100);

        vc.mainControlbar.addClass(vc.getStateSuffix());

		vc.mainControlbar
			.mouseover(
			function () {
				vc._mouseOverCtrlBar = true;
			}
		)
			.mouseout(
			function () {
				vc._mouseOverCtrlBar = false;
			}
		);

		return vc.mainControlbar;
	};

	/**
	 * Erstellt das mainControlbarBox-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateMainControlbarBox
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das mainControlbarBox-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.mainControlbarBox. Typ: mainControlbarBox-Objekt
	 **/
	function generateMainControlbarBox(vc, target, classes) {
		vc.mainControlbarBox = generateDiv(ViewController.CLASS_MAINCONTROLBAR_BOX, vc.mainControlbar, vc, target, classes);
		return vc.mainControlbarBox;
	};

	/**
	 * Erstellt das transportbox-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateButtonTransportBox
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das transportbox-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.transportbox. Typ: transportbox-Objekt
	 **/
	function generateButtonTransportBox(vc, target, classes) {
		var transportBoxName = "";
		transportBoxName += ViewController.CLASS_TRANSPORTBOX;
		transportBoxName += " ardplayer-" + vc.getStateSuffix();
		vc.transportbox = generateDiv(transportBoxName, vc.mainControls, vc, target, classes);
		addGeneratedElemetToList(vc, transportBoxName, transportBoxName, vc.transportbox, classes, false, false, false, false, false, true);
		return vc.transportbox;
	};

	/**
	 * Erstellt das functionBtnBox-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateFunctionButtonBox
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das functionBtnBox-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.functionBtnBox. Typ: functionBtnBox-Object
	 **/
	function generateFunctionButtonBox(vc, target, classes) {
		vc.functionBtnBox = generateDiv(ViewController.CLASS_PLAYER_FUNKTION_BOX, vc.mainControls, vc, target, classes);
		return vc.functionBtnBox;
	};

	/**
	 * Erstellt das functionBtnBox-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateImageTag
	 * @public
	 * @param img_vc. Typ: ViewController.
	 * @param img_propertyname. Typ: String. Eigenschaftsname des bildes
	 * @param img_classname. Typ: String. ViewController-Klassenkonstantenname
	 * @param img_src. Typ: String. Quelle zu dem Bild
	 * @param img_target. Typ: Die Klasse die hinzugefügt werden soll, zu dem target oder dem img_vc.viewport
	 * @param img_classes. Typ: css-Klassen, die zu dem targetClass hinzugefügt werden soll
	 * @param img_vc.viewport. Typ: Das div-Object an dem es angeähngt werden kann.
	 * @returnimg. Typ: img-Object
	 **/
	function generateImageTag(img_vc, img_propertyname, img_classname, img_src, img_target, img_classes) {
		if (!$.isBlank(img_propertyname)) {

			if (!$.isBlank(img_classname)) {
				var img = img_vc [img_propertyname] = $('<img alt="">')//' + img_propertyname + '
						.appendTo(img_target || img_vc.viewport)
						.addClass(img_classname + (img_classes ? (" " + img_classes) : ''))
						.attr("src", img_src );
						
				$(img).on("error",ns.Delegate.create(this, onImgError));
				return img;
			}
		}
		return null;
	};

	function onImgError(err) {
		var errorCtrl = ns.ErrorController.getInstance();
		errorCtrl.throwError(ns.ErrorController.IMG_SRC_IS_WRONG, ns.ErrorController.IS_CRITICAL_NO, err.currentTarget.src);
	};

	/**
	 * Erstellt das audioframe-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateAudioframe
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das audioframe-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.audioframe. Typ: audioframe-Objekt
	 **/
	function generateAudioframe(vc, target, classes) {

		var m = vc.player.model,
			pc = m.playerConfig,
			mc = m.mediaCollection;

		var imageMap = null;
		var confImg = mc.getAudioImage();

		if ( confImg )
		{
			var nwImageMap = {};
			if ( confImg.hasOwnProperty("s") )
			{
				nwImageMap.s = confImg.s;
			}
			if ( confImg.hasOwnProperty("m") )
			{
				nwImageMap.m = confImg.m;
			}
			if ( confImg.hasOwnProperty("l") )
			{
				nwImageMap.l = confImg.l;
			}
			if ( confImg.hasOwnProperty("xl") )
			{
				nwImageMap.xl = confImg.xl;
			}
			if ( nwImageMap.s || nwImageMap.m || nwImageMap.l || nwImageMap.xl )
			{
				imageMap = nwImageMap;
			} else
			{
				if ( !$.isBlank(confImg) )
				{
					imageMap = {};
					imageMap.m = confImg;
				}
			}
		}

		vc.audioframe = undefined;

        if (imageMap) {
			vc.dragging = false;

            vc.audioFrame = vc ["audioframe"] = generateDiv(ViewController.CLASS_AUDIO_FRAME, null, vc, target, classes)
                .hideWithClass()
				.on(vc.clickEventName, function (event) {

					if (vc.dragging) return;

					vc.player.getCtrl().togglePlay();

					if (vc.player.getCtrl().isPlaying()) {
						vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PAUSE_VIEWPORT);
						vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PAUSE);
					} else {
						vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_VIEWPORT);
						vc.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PLAY);
					}

					// Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
					vc.tabFadePrevention = false;
				})
				// Verhindert ein togglePlay bei touchmove
				.on("touchmove", function(){
					vc.dragging = true;
				})
				.on("touchstart", function(){
					vc.dragging = false;
				});
            vc.audioImg = generateImageTag(vc, "audioimage", ViewController.CLASS_AUDIO_FRAME_IMAGE, "", target, classes)
                .appendTo(vc.audioFrame);


            vc.audioImgResponsive = new ns.ResponsiveImage(imageMap, vc.audioImg[0], pc.getRepresentationClass());
        }

		return vc.audioframe;
	};

	/**
	 * Erstellt das buffering-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateBufferingIndicator
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das buffering-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return vc.buffering. Typ: buffering-Object
	 **/
	function generateBufferingIndicator(vc, target, classes) {
		vc.buffering = generateDiv(ViewController.CLASS_BUFFERING_INDICATOR, null, vc, target, classes);
		vc.buffering.hideWithClass();

		return vc.buffering;
		//return addGeneratedElemetToList(vc, "buffering", ViewController.CLASS_BUFFERING_INDICATOR, vc.buffering, "", false, false, false, false, false, true);
	};

	/**
	 * Erstellt das buffering-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generatePosterframe
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das buffering-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return div-object. Typ: Div-Object, das die addGeneratedElemetToList-Methode liefert.
	 **/
	function generatePosterframe(vc, target, classes) {

		var m = vc.player.model,
			pc = m.playerConfig,
			mc = m.mediaCollection;

		var imageMap = {
			m : pc.getBaseUrl() + "base/img/posterframe-m.jpg"
		};

		var confImg = mc.getPreviewImage();
		if ( confImg )
		{
			var nwImageMap = {};
			if ( confImg.hasOwnProperty("xs") )
			{
				nwImageMap.xs = confImg.xs;
			}
			if ( confImg.hasOwnProperty("s") )
			{
				nwImageMap.s = confImg.s;
			}
			if ( confImg.hasOwnProperty("m") )
			{
				nwImageMap.m = confImg.m;
			}
			if ( confImg.hasOwnProperty("l") )
			{
				nwImageMap.l = confImg.l;
			}
			if ( confImg.hasOwnProperty("xl") )
			{
				nwImageMap.xl = confImg.xl;
			}
			if ( nwImageMap.s || nwImageMap.m || nwImageMap.l || nwImageMap.xl )
			{
				imageMap = nwImageMap;
			} else
			{
				if ( !$.isBlank(confImg) )
				{
					imageMap = {};
					imageMap.m = confImg;
				}
			}
		}

		var posterDiv = generateDiv(ViewController.CLASS_POSTERFRAME_TARGET_CLASS, target);
		var posterImg = generateImageTag(vc, "posterframe-img", "ardplayer-posterimage", "", posterDiv);
		vc.posterImg = posterImg;
		vc.posterframe = posterDiv;

		vc.posterImgResponsive = new ns.ResponsiveImage(imageMap, posterImg[0], pc.getRepresentationClass());

		return addGeneratedElemetToList(vc, ViewController.CLASS_POSTERFRAME_TARGET_CLASS, ViewController.CLASS_POSTERFRAME, posterDiv, "", false, false, false, false, false, true);
	};

	/**
	 * Erstellt das posterControl-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generatePosterControl
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das posterControl-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return posterControl-object.  Typ: posterControl-Object
	 **/
	function generatePosterControl(vc, target, classes) {
		var posterControlDiv = generateButton(ViewController.CLASS_POSTER_CONTROL, target);
		addGeneratedElemetToList(vc, "postercontrol", ViewController.CLASS_POSTER_CONTROL, posterControlDiv, "", false, false, false, false, false, true);
		posterControlDiv.
			attr({
				"tabindex": "0",
				"onClick": "this.blur(); return false;",
				"title": "ARD-Player. Abspielen"
			})
			.removeAttr("href");
		vc.posterControl = posterControlDiv;

		return posterControlDiv;
	};

	/**
	 * Erstellt das viewport-div-Objekt, das dem übergebenen Viewcontroller übergeben wird.
	 * @method generateViewport
	 * @public
	 * @param vc. Typ: ViewController. ViewController dass das viewport-Objekt zugewiesen werden soll
	 * @param target. Typ: Das div-Objekt.
	 * @param classes. Typ: css-Klassen, die zu dem target hinzugefügt werden soll
	 * @return viewport-object.  Typ: viewport-Object
	 **/
	function generateViewport(vc, target, classes) {
		vc.viewport = generateDiv(ViewController.CLASS_VIEWPORT, vc.playerDiv, vc, target, classes);
		addGeneratedElemetToList(vc, "viewport", ViewController.CLASS_VIEWPORT, vc.viewport, classes, false, false, false, false, false, true);
		return vc.viewport;
	};

	/**
	 * Registriert und fügt peraddGeneratedElemetToList()-Methode das div-object auf die stage.
	 * @method registerMediaCanvas
	 * @public
	 * @param jQueryObj. Typ: Object. Div-Object das registriert werden soll und per addGeneratedElemetToList()-Methode auf die stage gelegt wird.
	 * @return void
	 **/
	p.registerMediaCanvas = function (jQueryObj) {
		if (jQueryObj) {
			if (!jQueryObj.attr || typeof jQueryObj.attr != "function")
				jQueryObj = $(jQueryObj);
			this.mediacanvas = jQueryObj;

            addGeneratedElemetToList(this, "mediacanvas", ViewController.CLASS_MEDIA_CANVAS, jQueryObj, "", false, false, false, false, false, true);

			var g = ns.GlobalModel.getInstance();
			if (g.isIPhoneDevice || g.isIPodDevice)
			{
				if ( !this.mediacanvas.hasClass("ios-touchfix") )
					this.mediacanvas.addClass("ios-touchfix");
			}

			this.bindMediaCanvas();
		}
		else {
			var errorCtrl = ns.ErrorController.getInstance();
			errorCtrl.throwError(ns.ErrorController.MC_COULD_NOT_REGISTERED, ns.ErrorController.IS_CRITICAL_YES);
		}
	};

	/**
	 * WEchselt zu dem als String-Parameter übergebenen Plugin
	 * @method changePluginSelection
	 * @public
	 * @param plugInID. Typ: String. Wert zeigt an, ob der Ctrl das Flash-Plugin steuert.
	 * @return void
	 **/
	p.changePluginSelection = function (plugInID, rememberCurrentTime) {

		var p = this.player,
			m = p.model,
			pc = m.playerConfig,
			mc = m.mediaCollection;

		// Positionsuebernahme bei Qualitaetswechsel
		if ( rememberCurrentTime )
		{
			if (pc.getRememberCurrentTime() )
				pc.setInitialPlayhead(p.getCtrl().getCurrenttime());
		}

		if (mc.getType() == "audio") {
			if (this.equalizeContainer)
				this.equalizeContainer.hideWithClass();
		}

		m.currentPluginID = plugInID;
	};

	/**
	 * Aktiviert das FLash-Plugin
	 * @method activateFlash
	 * @public
	 * @return void
	 **/
	p.activateFlash = function () {
		var fnc = this.player.model.playerConfig.getOnPluginChangeFunction();
		if (fnc != undefined && typeof fnc == "function") {
			fnc(ns.GlobalModel.FLASH);
		}

        this.player.dispatchCustomEvent(
            ns.Player.EVENT_PLUGIN_CHANGE, {plugin:ns.GlobalModel.FLASH} );

		this.player.model.pluginChangeInProgress = true;
		this.player.model.playerConfig.setAutoPlay(true);

		this.player.setForcedPlugin(ns.GlobalModel.FLASH);

		// Neuer Callstack
		var that = this;
		setTimeout(function () {
			that.player._ready();
		},1);
	};

	/* Aktiviert das HTML-Plugin
	 * @method activateFlash
	 * @public
	 * @param void
	 * @return void
	 **/
	p.activateHTML = function () {
		var fnc = this.player.model.playerConfig.getOnPluginChangeFunction();
		if (fnc != undefined && typeof fnc == "function") {
			fnc(ns.GlobalModel.HTML5);
		}

		this.player.dispatchCustomEvent(
			ns.Player.EVENT_PLUGIN_CHANGE, {plugin:ns.GlobalModel.HTML5} );

		this.player.model.pluginChangeInProgress = true;
		this.player.model.playerConfig.setAutoPlay(true);

		this.player.setForcedPlugin(ns.GlobalModel.HTML5);

		// Neuer Callstack
		var that = this;
		setTimeout(function () {
			that.player._ready();
		},1);
	};

	/* Aktualisiert die Progressbar (Buffering)
	 * @method updateProgress
	 * @public
	 * @param value. Typ: Number. Wert der der Progressbar übergeben wird.
	 * @return void
	 **/
	p.updateProgress = function (value) {
		if ( this.mainTimelineSlider && !this.sliding)
			this.mainTimelineSlider.setBufferPercent(value);
	};

	/* Aktualisiert die timeline
	 * @method updateTimeline
	 * @public
	 * @param time. Typ: Number. aktueller zeitwert der der timeline übergeben wird.
	 * @param duration. Typ: Number. max-Wert des abzuspielenden mediums der der timeline übergeben wird.
	 * @return void
	 **/
	p.updateTimeline = function (time, duration) {
		if (this.mainTimelineSlider && !this.sliding) {
			var pc = this.player.getCtrl();
			this.updateSliderBarsUI(
				pc.getPlayheadStart(),
				time,
				duration,
				pc.getPercentBuffered()
			);
		}
	};

	/*
	 * Bindet das klick event auf den playpause btn.
	 * Hier das klick evnet, um die play-methode aufzurufen
	 * @method bindPlayPause
	 * @public
	 * @param void
	 * @return void
	 **/
	p.bindPlayPause = function () {
		if (this.playPause) {

            var handleKeyDown = function (event) {

                if ( event.keyCode == 13 )
                {
                    event.preventDefault();
                    return handleClick(event, false);
                }

            }.bind(this);

            var handleClick = function (event, allowBlur) {

                // 5739
                if ( !(allowBlur === false) )
                {
                    // IE11- Try-Catch #5798
                    try {
                        this.playPause.blur();
                    } catch (err) {}
                }

                this.player.getCtrl().togglePlay();

                if (this.player.getCtrl().isPlaying()) {
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PAUSE_BUTTON);
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PAUSE);
                } else {
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_BUTTON);
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PLAY);
                }

                // Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
                this.tabFadePrevention = false;

                return false;
            }.bind(this);

			this.playPause
                .off()
				.on("keydown", handleKeyDown)
				.on(this.clickEventName, handleClick)

                // Mouseover Handling
                .on('mouseover mouseout touchstart touchend', function (event) {
                    event.preventDefault();
                    $(event.target).toggleClass('hover');
                });
		}
	};

	/*
	 * Bindet das klick event auf den mute btn.
	 * Hier das klick event, um die mute-methode aufzurufen
	 * @method bindMute
	 * @public
	 * @param void
	 * @return void
	 **/
	p.bindMute = function () {
		if (this.volume) {

            var handleKeyDown = function (event) {

                if ( event.keyCode == 13 )
                {
                    event.preventDefault();
                    return handleClick(event, false);
                }

            }.bind(this);

            var handleClick = function (event, allowBlur) {

                // 5739
                if ( !(allowBlur === false) )
                {
                    // IE11- Try-Catch #5798
                    try {
                        this.volume.blur();
                    } catch (err) {}
                }

                var g = ns.GlobalModel.getInstance();
                if (g.getMuted()) {
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_VOLUME_UNMUTE);
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_VOLUME_UNMUTE);
                } else {
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_VOLUME_MUTE);
                    this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_VOLUME_MUTE);
                }

                // Do not act if volume is lt 0.05 - #5445
                if (g.getMuted() && g.getVolume() < 0.05 )
                    return false;

                this.player.getCtrl().toggleMuteState();

				// Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
				this.tabFadePrevention = false;

                return false;
            }.bind(this);

			this.volume
                .off("keydown")
                .off(this.clickEventName)
                .on("keydown", handleKeyDown)
                .on(this.clickEventName, handleClick)

                // Mouseover Handling
                .off('mouseover mouseout touchstart touchend')
                .on('mouseover mouseout touchstart touchend', function (event) {
                    event.preventDefault();
                    $(event.target).toggleClass('hover');
                });
		}
	};

	/*
	 * Bindet das klick event auf den mediacanvas.
	 * Hier das klick event, um den klick und den doppelklick darauf abzufangen.
	 * DAmit man mittels doppelklick zum fullscreen toggeln kann --> im flash player.
	 * @method bindMediaCanvas
	 * @public
	 * @param void
	 * @return void
	 **/
	p.bindMediaCanvas = function () {
		if (this.getMediaCanvas()) {
			var that = this;
			this.getMediaCanvas()
				.off(this.clickEventName)
				.off("dblclick")
				.off("touchmove")
				.on("touchmove", function (event) {
                    that.clickEventIsMove = true;
				})
				.on(this.clickEventName, function (event) {

					// #11266 - Bei Klick ausserhalb der Settings sollen diese geschlossen werden
					// dabei soll das Abspielverhalten unterdrückt werden.
                    if (that.optionsControlDiv)
						return;

					// #11222 - Beim Swipen über ein laufendes Video wird das Video pausiert
					if ( that.clickEventName === 'touchend' && that.clickEventIsMove )
					{
						that.clickEventIsMove = false;
						return;
					}

					if (that.player.getCtrl().useBindClickOnStage()) {
						var d = new Date(),
							n = d.getTime();
						if (dbClickTimeoutID) {
							clearTimeout(dbClickTimeoutID);
							dbClickTimeoutID = undefined;
						}
						if (n - lastClick > 250) {
							dbClickTimeoutID = setTimeout(function () {

								// Mobile
								if (ns.GlobalModel.getInstance().isMobileDevice) {
									if ( that.controlbarShowing )
									{
										that.player.getCtrl().togglePlay();
										if (that.player.getCtrl().isPlaying() === true) {
											that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PAUSE_VIEWPORT);
											that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PAUSE);
										}
										else if (that.player.getCtrl().isPlaying() === false) {
											if (that.player.getCtrl().isAtEnd === false) {
												that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_VIEWPORT);
												that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PLAY);
											}
											else {
												that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_AGAIN_VIEWPORT);
											}
										}
									}
									that.fadeInCtrlBar();
								}
								else {
									// Desktop
									that.player.getCtrl().togglePlay();
									if (that.player.getCtrl().isPlaying() === true) {
										that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PAUSE_VIEWPORT);
										that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PAUSE);
									}
									else if (that.player.getCtrl().isPlaying() === false) {
										if (that.player.getCtrl().isAtEnd === false) {
											that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_VIEWPORT);
											that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PLAY);
										}
										else {
											that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_AGAIN_VIEWPORT);
										}
									}
								}

							}, 250);
						}
						else {

							if ( that._fullscreenEnabled )
							{
								that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_FULLSCREEN_DEACTIVATION_VIEWPORT);
							} else
							{
								that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_FULLSCREEN_ACTIVATION_VIEWPORT);
							}

							that.toggleFullscreen();
						}

						lastClick = n;
					}

				});
		}
	};

	/*
	 * Bindet das klick event auf das posterControl div.
	 * Hier das klick event, um die posterframeClickHandler-methode aufzurufen
	 * @method bindPosterControl
	 * @public
	 * @param void
	 * @return void
	 **/
	p.bindPosterControl = function () {
		this.showPosterControl();
		if (this.posterControl) {
			var that = this;
			this.posterControl
				.off("click")
				.on("click", function (event) {
					var g = ns.GlobalModel.getInstance();
					if (g.isIPhoneDevice || g.isIPodDevice)
					{
						if ( that.mediacanvas.hasClass("ios-touchfix") )
							that.mediacanvas.removeClass("ios-touchfix");
					}

					var temp_ctrl = that.player.getCtrl();
					temp_ctrl.posterframeClickHandler();

					if (that.player.getCtrl().isPlaying() == false) {
						that.player.pixelController.triggerTrackingPixelPlay(ns.PlayerPixelController.INTERACTION_INITIAL_PLAY);
						that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PLAY);
					}
				});
		}
	};

	/*
	 * Entfernt das klick event auf das posterControl div.
	 * Hier das klick event, um die posterframeClickHandler-methode aufzurufen
	 * @method unbindPosterControl
	 * @public
	 * @param void
	 * @return void
	 **/
	p.unbindPosterControl = function () {
		if (this.posterControl) {
			this.posterControl
				.off("click");
		}
	};

	/*
	 * Bindet das klick event auf das bindPosterframe div.
	 * Hier das klick event, um die posterframeClickHandler-methode aufzurufen
	 * @method bindPosterframe
	 * @public
	 * @param void
	 * @return void
	 **/
	p.bindPosterframe = function () {

		this.showPosterFrame();

		if (this.posterframe) {
			var that = this;
			this.posterframe
				.off("click")
				.on("click", function (event) {

					that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_AGAIN_VIEWPORT);

					var temp_ctrl = that.player.getCtrl();
					if (that.player.isPlaylistPlayer() && !that.player._playlistController._hasNext())
					{
						that.player.replayPlaylist();
					} else
					{
						temp_ctrl.posterframeClickHandler();
					}

				});
		}
	};

	/*
	 * Entfernt das klick event auf das posterframe div.
	 * Hier das klick event, um die posterframeClickHandler-methode aufzurufen
	 * @method unbindPosterControl
	 * @public
	 * @param void
	 * @return void
	 **/
	p.unbindPosterframe = function () {
		if (this.posterframe) {
			this.posterframe
				.off("click");
		}
	};

	/*
	 * Beim Aufruf der Funktion wird der buffering auf hidden gestellt.
	 * @method hideBufferingIndicator
	 * @public
	 * @param void
	 * @return void
	 **/
	p.hideBufferingIndicator = function () {
		if (this.buffering)
			this.buffering.hideWithClass();
	};

	/*
	 * Beim Aufruf der Funktion wird der buffering auf show gestellt.
	 * @method showBufferingIndicator
	 * @public
	 * @param void
	 * @return void
	 **/
	p.showBufferingIndicator = function () {
		if (this.buffering) {
			this.buffering.showWithClass();
		}
	};

	/*
	 * Beim Aufruf der Funktion wird der playagain-div auf hide gestellt.
	 * @method hidePlayAgain
	 * @public
	 * @param void
	 * @return void
	 **/
	p.hidePlayAgain = function () {
		if (this.playagain) {

			if (this.playPause)
				this.playPause.showWithClass();

			this.playagain
				.off(this.clickEventName)
				.hideWithClass();
		}
	};

	/*
	 * Beim Aufruf der Funktion wird der playagain-div auf show gestellt.
	 * @method hidePlayAgain
	 * @public
	 * @param void
	 * @return void
	 **/
	p.showPlayAgain = function () {
		if (this.playagain) {
			var that = this;

			if (this.playPause)
				this.playPause.hideWithClass();

			this.playagain
				.off(this.clickEventName)
				.on(this.clickEventName, function (event) {

					// Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
					that.tabFadePrevention = false;

                    that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_PLAY_AGAIN_BUTTON);

                    if (that.player.isPlaylistPlayer())
                    {
                        that.player.replayPlaylist();
                    } else
                    {
                        var temp_ctrl = that.player.getCtrl();
                        that.setCtrlBarFading(true);
                        temp_ctrl.restartMedia();
                    }
				})
				.showWithClass()

                // Mouseover Handling
                .on('mouseover mouseout touchstart touchend', function (event) {
                    event.preventDefault();
                    $(event.target).toggleClass('hover');
                });
		}
	};

	/*
	 * Beim Aufruf der Funktion wird der posterControl-div auf hide gestellt.
	 * @method hidePosterControl
	 * @public
	 * @param void
	 * @return void
	 **/
	p.hidePosterControl = function () {
		if (this.posterControl)
			this.posterControl.hideWithClass();
	};

	/*
	 * Beim Aufruf der Funktion wird der posterControl-div auf show gestellt.
	 * @method showPosterControl
	 * @public
	 * @param void
	 * @return void
	 **/
	p.showPosterControl = function () {
		if (this.posterControl)
			this.posterControl.showWithClass();
	};

	/*
	 * Beim Aufruf der Funktion wird der posterFrame-div auf hide gestellt.
	 * @method hidePosterFrame
	 * @public
	 * @param void
	 * @return void
	 **/
	p.hidePosterFrame = function () {

		// 3128
		this.mainControlbar.showWithClass();

		if (this.posterframe)
			this.posterframe.hideWithClass();
	};

	/*
	 * Beim Aufruf der Funktion wird der posterframe-div auf show gestellt.
	 * @method showPosterFrame
	 * @public
	 * @param void
	 * @return void
	 **/
	p.showPosterFrame = function () {
		if (this.posterframe)
			this.posterframe.showWithClass();
		this.showPosterControl();
	};

	/*
	 * Beim Aufruf der Funktion wird der equalizeContainer-div auf show gestellt.
	 * @method showEqualizerPlaying
	 * @public
	 * @param void
	 * @return void
	 **/
	p.showEqualizerPlaying = function () {
		if (this.equalizeContainer) {
			this.equalizeContainer.empty();
			var src = this.player.model.playerConfig.getBaseUrl() + "base/img/soundaddon.gif";
			generateImageTag(this, "equalizeimg", "ardplayer-equalizeimg", src, this.equalizeContainer, null);
			this.equalizeContainer.showWithClass();
		}

		// Aktualisierung der Controlbar-Dimension
		this.measureControlbarDimension();
	};

	/*
	 * Beim Aufruf der Funktion wird der equalizeContainer-div auf show gestellt.
	 * @method showEqualizerStopping
	 * @public
	 * @param void
	 * @return void
	 **/
	p.showEqualizerStopping = function () {
		if (this.equalizeContainer) {
			$(this.equalizeContainer).empty();
			var src = this.player.model.playerConfig.getBaseUrl() + "base/img/soundaddon_off.gif";
			generateImageTag(this, "equalizeimg", "ardplayer-equalizeimg", src, this.equalizeContainer, null);
			this.equalizeContainer.showWithClass();
		}

		// Aktualisierung der Controlbar-Dimension
		this.measureControlbarDimension();
	};

	/*
	 * Beim Aufruf der Funktion wird der audioframe-div auf hide gestellt.
	 * @method hideAudioFrame
	 * @public
	 * @param void
	 * @return void
	 **/
	p.hideAudioFrame = function () {
		if (this.audioframe)
			this.audioframe.hideWithClass();
	};

	/*
	 * Beim Aufruf der Funktion wird der audioframe-div auf show gestellt.
	 * @method showAudioFrame
	 * @public
	 * @param void
	 * @return void
	 **/
	p.showAudioFrame = function () {
		if (this.audioframe)
			this.audioframe.showWithClass();
	};

	/*
	 * Hier wird der State des playpause button gewechselt.
	 * Genauer, die passende CSS-Klasse wird hinzugefügt oder entfernt
	 * @method showPlayPauseState
	 * @public
	 * @param state. :Typ: String. State zu dem der playpause button wechseln soll.
	 * @return void
	 **/
	p.showPlayPauseState = function (state) {

		var gm = ns.GlobalModel.getInstance();

		switch (state) {
			case "pause":
				if (this.playPause) {
					this.playPause
						.removeClass("toggle");
				}

                // 7090
				if (this.player.model.mediaCollection.getType() == "video" && (gm.isIPhoneDevice || gm.isIPodDevice))
				{
					if ( !this.mediacanvas.hasClass("ios-touchfix") )
						this.mediacanvas.addClass("ios-touchfix");
					this.bindPosterframe();
				}

				break;

			case "play":
				if (this.playPause) {
					this.playPause
						.addClass("toggle");
				}

				if (gm.isIPhoneDevice || gm.isIPodDevice)
				{
					if ( this.mediacanvas.hasClass("ios-touchfix") )
						this.mediacanvas.removeClass("ios-touchfix");
				}

				break;
		}
	};

	/*
	 * Setzt den Mute-Zustand des Mute-Buttons.
	 * @method showMutedState
	 * @public
	 * @param isVisible. :Typ: Boolean. Boolean-Wert
	 * @return void
	 **/
	p.showMutedState = function (state) {
		if (this.volume) {
			if (state) {
				this.volume.addClass("toggle");
				this.volumeslider.addClass("toggle");
				this.volume
					.attr({
						"title": "Lautstärke einstellen [Pfeiltasten hoch/runter (bzw. STRG + B/V)].\nTon an [STRG + M]",
						"aria-pressed": "true"
					});
			}
			else {
				this.volume.removeClass("toggle");
				this.volumeslider.removeClass("toggle");
				this.volume
					.attr("title", "Lautstärke einstellen [Pfeiltasten hoch/runter (bzw. STRG + B/V)].\nTon aus [STRG + M] ")
					.attr("aria-pressed","false");
			}
		}
	};

	/*
	 * Beim Aufruf der Funktion wird das übergebene jQueryDisplayObj-object auf hide gestellt.
	 * @method hideIfExist
	 * @public
	 * @param jQueryDisplayObj. :Typ: Object. jQueryDisplayObj das auf hidden gestellt werden soll.
	 * @return void
	 **/
	p.hideIfExist = function (jQueryDisplayObj) {
		if (jQueryDisplayObj)
			jQueryDisplayObj.hideWithClass();
	};

	/*
	 * Beim Aufruf der Funktion wird das übergebene jQueryDisplayObj-object entfernt.
	 * @method removeIfExist
	 * @public
	 * @param jQueryDisplayObj. :Typ: Object. jQueryDisplayObj das auf entfernt werden soll.
	 * @return void
	 **/
	p.removeIfExist = function (jQueryDisplayObj) {
		if (jQueryDisplayObj) {
			jQueryDisplayObj.remove();
			jQueryDisplayObj = undefined;
		}
	};

	/*
	 * Beim Aufruf der Funktion wird der aktuelle Zeitwert in Sekunden aktualisiert und angezeigt
	 * @method updateTime
	 * @public
	 * @param seconds. :Typ: Number. Zeit in Sekunden
	 * @return void
	 **/
	p.updateTime = function (seconds) {
		this._lastPosition = seconds;

		//this.updateTimeline(this._lastPosition, this._lastDuration);

		var useAdditionalTimeClass = false;
		var timeClass = "multiple";

		var html = "";

        this.updateDVRSlider(this._lastPosition, this._lastDuration);

		if (this._dvrEnabledAndRequested) {

			if (this._dvrIsLive) {
				html = "LIVE";
				useAdditionalTimeClass = false;
			} else {
				var delta = this._lastDuration - seconds;
				html = "<span>LIVE</span><span></span><span>-" + this.formatTimestring(delta) + "</span>"
				useAdditionalTimeClass = true;
			}

			if (this.player.model.mediaCollection.getType() == "audio" &&
				this.player.model.playerConfig.getShowEqualizer()) {
				if (!this.timeContainer.hasClass(ViewController.CLASS_EQUALIZE_SHORT)) {
					this.timeContainer.addClass(ViewController.CLASS_EQUALIZE_SHORT);
				}
			}

		} else {

			if (this.player.model.mediaCollection.getIsLive()) {
				html = "LIVE";
				useAdditionalTimeClass = false;
			} else {
				var fT = ns.DateUtils.getFormatedTime(seconds * 1000);
				var fD = ns.DateUtils.getFormatedTime(this._lastDuration * 1000);
				//html = "<span>" + fT + "</span><span> / </span><span>" + fD + "</span>"
				html = "<span>" + fT + "</span><span>" + fD + "</span>"
				useAdditionalTimeClass = true;
			}
		}

		// Hilfsklasse für DVR - Vertikale Ausrichtung der Zeitanzeige
		if (useAdditionalTimeClass) {
			if (!this.timeContainer.hasClass(timeClass)) {
				this.timeContainer.addClass(timeClass);
			}
		} else {
			if (this.timeContainer.hasClass(timeClass)) {
				this.timeContainer.removeClass(timeClass);
			}
		}

		if (this.timeContainer)
			this.timeContainer.html(html);
	};

	/*
	 * Beim Aufruf der Funktion wird die gesamtzeit in Sekunden aktualisiert und angezeigt
	 * @method updateTotalTime
	 * @public
	 * @param seconds. :Typ: Number. Zeit in Sekunden
	 * @return void
	 **/
	p.updateTotalTime = function (seconds) {
		this._lastDuration = seconds;
		if (this._lastPosition == undefined) {
			this._lastPosition = seconds;
		}

		//this.updateTime(this._lastPosition);
	};

	p.fadeInCtrlBarByMouseover = function () {
		if (this.allowFadeInByMouseOver) {
			this.fadeInCtrlBar();
		}
	};

	p.fadeOutComplete = function () {
		this.allowFadeInByMouseOver = true;
		this.controlbarShowing = false;

		if (this.player && this.player.getCtrl())
			this.player.getCtrl().requestMouseOverEvent();

		this.player.dispatchCustomEvent(ns.Player.EVENT_CTRLBAR_FADEOUT_END, {controller: this, viewport: this.viewport, container: this.mainControlbar});
	};

	p.fadeInComplete = function (tween) {
		//this.allowFadeInByMouseOver = true;
		this.controlbarShowing = true;

		if (this.player && this.player.getCtrl())
			this.player.getCtrl().requestMouseOverEvent();

		// Notify any Addons about the fade process
		this.player.dispatchCustomEvent(ns.Player.EVENT_CTRLBAR_FADEIN_END, {controller: this, viewport: this.viewport, container: this.mainControlbar});
	};

	p.fadeInOutStep = function (tween) {

        var bottom;

        bottom = tween.target[0].style.bottom;
        bottom = bottom.replace("px", "");

        // Fixme performance
        var height = this.mainControlbar.height() + parseInt(bottom);
        height = height.toFixed(0);
        if (this.lastFadeInOutStep !== height) {
            this.lastFadeInOutStep = height;

            this.player.dispatchCustomEvent(ns.Player.VIEW_CTRLBAR_MOVE, {ctrlBarHeight: height});
        }
	};

	/*
	 * Beim Aufruf der Funktion, wird die CtrlBar eingeblendet
	 * @method fadeInCtrlBar
	 * @public
	 * @param void
	 * @return void
	 **/
	p.fadeInCtrlBar = function () {

		if (!this.mainControlbar || this.tabFadePrevention)
			return;

		if (!this.canFadeIn)
			return;

		var animationProperties = {};
		animationProperties.opacity = 1;

        animationProperties.onUpdate = this.fadeInOutStep;
        animationProperties.onUpdateParams = ["{self}", this.mainControlbar];
        animationProperties.onUpdateScope = this;
        animationProperties.onComplete = this.fadeInComplete;
        animationProperties.onCompleteParams = ["{self}"];
        animationProperties.onCompleteScope = this;
        animationProperties.bottom = "0px";

		// Notify any Addons about the fade process
		this.player.dispatchCustomEvent(ns.Player.EVENT_CTRLBAR_FADEIN_START, {controller: this, viewport: this.viewport, container: this.mainControlbar});

		this.allowFadeInByMouseOver = false;

        TweenLite.killTweensOf(this.mainControlbar);
        TweenLite.to(this.mainControlbar, 0.4, animationProperties);

		// Handle
        if ( this.mainTimelineSlider )
            this.mainTimelineSlider.showHandle();

        // show cursor
        if ( this.mediacanvas )
            this.mediacanvas.removeClass("hideCursor");
        if ( this.player.isFlashCtrl() )
            this.player.getCtrl().setUserIdle(false);

        // pre postroll
        if (this.prerollInfoBox)
            this.prerollInfoBox.addClass("active");
        if (this.prerollSkipBox)
            this.prerollSkipBox.addClass("active")
	};

    p.fadeoutPrerollInfoBanner = function () {
        if (this.prerollInfoBox) {
            setTimeout(function () {
                if (this.prerollInfoBox) {
                    this.prerollInfoBox.css("opacity", 0);
                    this.prerollInfoBox = null;
                }
            }.bind(this), 5000, this.prerollInfoBox);
        }
    };

	/*
	 * Beim Aufruf der Funktion, wird die CtrlBar ausgeblendet
	 * @method fadeInCtrlBar
	 * @public
	 * @param void
	 * @return void
	 **/
	p.fadeOutCtrlBar = function () {
		if (!this.mainControlbar)
			return;

		if (this.sliding)
			return;

		if (this.forceCtrlbarVisible)
			return;

		if (this.tabFadePrevention)
			return;

		if (this._mouseOverCtrlBar && !ns.GlobalModel.getInstance().isMobileDevice)
			return;

		//neuer code-teil, wegen Ticket #1492 Neues Vehalten des Players im Pause-, bzw. Stop-Modus: die Playerleiste bleibt stehen - es wird kein zusätzlicher Play-Button angezeigt
		if (this.player && this.player.getCtrl()) {
			if (!this.player.getCtrl().isPlaying() || this.player.getCtrl().isAtEnd)
				return;
		}
		// Ticket #1378
		if (this.player &&
			this.player.model &&
			this.player.model.playerConfig &&
			this.player.model.playerConfig.getForceControlBarVisible())
			return;

        if (!this.player || !this.player.model || !this.player.model.mediaCollection)
            return;

		/*
		 * Control-Bar
		 */
		var animationProperties = {};
        var mc = this.player.model.mediaCollection;
        var btmOffset = 0;
        if ( !mc.getIsLive() && !this._dvrEnabledAndRequested )
            btmOffset = 8;

        animationProperties.bottom = (this.mainControlbar.outerHeight() * -1 +btmOffset) + "px";
        if ( this._fullscreenEnabled ) // #5781
            animationProperties.bottom = ( this.mainControlbar.outerHeight() * -1 ) + "px";

        animationProperties.onUpdate = this.fadeInOutStep;
        animationProperties.onUpdateParams = ["{self}", this.mainControlbar];
        animationProperties.onUpdateScope = this;
        animationProperties.onComplete = this.fadeOutComplete;
        animationProperties.onCompleteParams = ["{self}"];
        animationProperties.onCompleteScope = this;

		// Notify any Addons about the fade process
		this.player.dispatchCustomEvent(ns.Player.EVENT_CTRLBAR_FADEOUT_START, {controller: this, viewport: this.viewport, container: this.mainControlbar});

		this.allowFadeInByMouseOver = false;
        TweenLite.killTweensOf(this.mainControlbar);
        TweenLite.to(this.mainControlbar, 0.4, animationProperties);

        // hide cursor
		if ( this._fullscreenEnabled )
		{
			if ( this.player.isFlashCtrl() )
				this.player.getCtrl().setUserIdle(true);
			else
				this.mediacanvas.addClass("hideCursor");
		}

		// Mobile Zeitanzeige ausblenden
		if (ns.GlobalModel.getInstance().isMobileDevice && this.mainTimelineSlider)
            this.mainTimelineSlider.hideTimeHover();

        if ( this.mainTimelineSlider )
            this.mainTimelineSlider.hideHandle();

        if (this.prerollInfoBox)
            this.prerollInfoBox.removeClass("active")
        if (this.prerollSkipBox)
            this.prerollSkipBox.removeClass("active")
	};

	/*
	 * Beim Aufruf der Funktion, wird per Parameter erlaubt oder verhindert, ob die CtrlBar eingeblendet wird.
	 * @method setCtrlBarFading
	 * @public
	 * @param canFadeIn. Typ:Boolean.
	 * @return void
	 **/
	p.setCtrlBarFading = function (canFadeIn) {
		this.canFadeIn = canFadeIn;
		if (!canFadeIn)
			this.fadeOutCtrlBar();
	};

	/*
	 * Beim Aufruf der Funktion, wird per Parameter gezwungen, ob die CtrlBar ein- oder ausgeblendet werden soll.
	 * @method setForceCtrlBarVisible
	 * @public
	 * @param forced. Typ:Boolean.
	 * @return void
	 **/
	p.setForceCtrlBarVisible = function (forced, preventFade) {
		this.forceCtrlbarVisible = forced;

		if (preventFade === false || preventFade === undefined) {
			if (forced)
				this.fadeInCtrlBar();
			else
				this.fadeOutCtrlBar();
		}
	};

	/*
	 * Beim Aufruf der Funktion, der aktuelle mediacanvas-Object zurückgegeben
	 * @method getMediaCanvas
	 * @public
	 * @param void
	 * @return this.mediacanvas. Typ: Object.
	 **/
	p.getMediaCanvas = function () {
		return this.mediacanvas;
	};

	// Aufruf durch Keyboard Ctrl
	p.setQualityByQualValue = function (qual) {
		var isQualityAvailable = this.player.model.mediaCollection.checkStreamIsAvailable(qual, this.player.model.currentPluginID, this.player);
		if (isQualityAvailable == false)
			return;

		this.setQualityIndex(qual);
	};

	p.setQualityIndex = function (newQualityInd) {

		if (newQualityInd == this.representationQuality) {
			return;
		}

		var oldQuality = this.representationQuality;
		this.representationQuality = newQualityInd;

        // Letzte Qualität im Cookie sichern
		ns.GlobalModel.getInstance().setLastQuality(newQualityInd);

        // Für Mobilegeräte die neue Qualität selektieren
        if ( this.nativeOptionDropdown )
        {
            this.nativeOptionDropdown.val(newQualityInd);
        }

		// Flag sichern, damit der Wiedergabezustand erhalten bleibt.
		this.player.model.pluginChangeInProgress = true;

		// Rueckmeldung an den aktiven Controller, das sich die Ansicht geaendert hat.
		this.player.getCtrl().representationChanged();

		if (this.player.model.playerConfig.getOnQualityChangeFunction()) {
			this.player.model.playerConfig.getOnQualityChangeFunction()(newQualityInd);
		}

        this.player.dispatchCustomEvent(
            ns.Player.EVENT_QUALITY_CHANGE, {fromQuality:oldQuality, toQuality:newQualityInd} );
	};

	/*
	 * Hier wird der Player auf die neue Representationseinstellung aus der PlayerConfiguration-Einstellung gesetzt
	 * @method setRepresentationsClasses
	 * @public
	 * @param clazz. Typ: String. Die neue, zusetzende Repräsentationsklasse.
	 * @return void
	 **/
	p.setRepresentationsClasses = function (clazz) {

		clazz = (clazz || "m").toLowerCase();

		if ( this.representationClass == clazz )
			return;
		this.representationClass = clazz;

		var mc = this.player.model.mediaCollection;
		this.playerDiv
				.removeClass()
				.addClass("ardplayer")
				.addClass("ardplayer-" + mc.getType())// Ausprägung, z.B. ardplayer-video oder -audio
				.addClass("ardplayer-" + clazz); // Repräsentationsklasse, z.B. ardplayer-m oder -s

		if ( this.posterImgResponsive )
			this.posterImgResponsive.switchRepresentation(clazz);

		if ( this.audioImgResponsive )
			this.audioImgResponsive.switchRepresentation(clazz);

		this.measureControlbarDimension();
	};

	/*
	 * Hier wird der Typ des aktuellen Players zurückgegeben
	 * @method getStateSuffix
	 * @public
	 * @param void
	 * @return String. Typ des aktuellen Players
	 **/
	p.getStateSuffix = function () {
		if (this.player.model.mediaCollection.getIsLive() && !this.player.model.mediaCollection.getDVREnabled()) {
			return "live";
		} else {
			return "vod";
		}
	};

	/*
	 * Mit dieser Funktion wird sichergestellt, dass der VolumeSlider die richtige CSS-Klasse erhählt.
	 * @method getStateSuffix
	 * @public
	 * @param volVal. Typ Number.
	 * @return void
	 **/
	p.setVolumeSliderCssValue = function (volVal) {
		if (volVal < 0)
			return;

		if (volVal > 1)
			volVal = volVal / 100;

		try {
            this.volumeslider.children().first().css("height", (1-volVal)*100 + "%");
		}
		catch (e) {
		}
	};

	/** DVR spezifische Anpassungen **/
	p.updateDVRSlider = function (time, duration) {
        if ( this.mainTimelineSlider )
        {
            this.mainTimelineSlider.updateDVRSlider(time, duration);
        }
	};

    p.onDVRCallback = function (dvrEnabled, dvrWindow, dvrIsLive) {

        var oldDVRValue = this._dvrIsLive;

        this._dvrEnabled = dvrEnabled;
        this._dvrIsLive = dvrIsLive;
        this._dvrWindow = dvrWindow;
        this._dvrEnabledAndRequested = dvrEnabled && this.player.model.mediaCollection.getDVREnabled();

		// Akt. nach Änderung der DVR Fähigkeit
		this.measureControlbarDimension();

        if (this._dvrEnabledAndRequested) {

            var that = this;
            clearTimeout(this._dvrDelayedCallTrigger);
            if (oldDVRValue != dvrIsLive && !dvrIsLive && this.player.getCtrl().isPlaying()) {
                this._dvrDelayedCallTrigger = setTimeout(function () {
                    if (!that.player.getCtrl().__seeking) {
                        that.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_DVR_ACTIVE, false);
                    }
                }, 500);
            }

            if (this.mainTimelineSlider)
                this.mainTimelineSlider.show();
            this.mainControlbar
                .removeClass("live")
                .addClass("vod");

            if (dvrIsLive) {
                this.dvrBacktoLiveButton.hideWithClass();
            } else {
                this.dvrBacktoLiveButton.showWithClass();
            }

            this.updateTime(this._lastPosition);
        } else {
            if (this.player.model.mediaCollection.getIsLive() && this.mainTimelineSlider) {
                this.mainTimelineSlider.hide();
                this.mainControlbar
                    .removeClass("vod")
                    .addClass("live");
            }

            if (this.dvrBacktoLiveButton)
                this.dvrBacktoLiveButton.hideWithClass();
        }

    };

	/** ERROR HANDLING BEGINS **/
	ViewController.CLASS_ERR_MSG_VIEW = "error";

	p.writeNotification = function (msg, type) {
		if (!this.isErrorState) {
			this.playerDiv.empty();
			this.isErrorState = true;
		}

        if (!this.errorDiv)
            this.errorDiv = generateDiv(ViewController.CLASS_ERR_MSG_VIEW, this.playerDiv, this);
        this.errorDiv.empty();

        $("<h2>")
            .html(ns.ErrorController.ERROR_TITLE)
            .appendTo(this.errorDiv);

        var errImgPath = "base/img/error.png";
        if ( this.player &&
             this.player.model &&
             this.player.model.playerConfig )
        {
            errImgPath = this.player.model.playerConfig.getBaseUrl() + "base/img/error.png";
        }

        $("<div>")
            .addClass("error-img")
            .append(
                $("<img>")
                    .attr("src", errImgPath)
                    .attr("alt", "Streamfehler")
            )
            .appendTo(this.errorDiv);

        $("<p>")
            .html(msg)
            .appendTo(this.errorDiv);

		// #9509 - Verweis auf externer Player
		// Show raw stream urls if possible
		var mc = this.player.model.mediaCollection;
		var flatBackup = mc._fullFlatMediaArrayBackup,
			linkList = "",
			i = 0;

		// First try html, otherwise fall back to flash;
		var useFallbackList = flatBackup[ns.GlobalModel.HTML5];
		if (!useFallbackList)
			useFallbackList = flatBackup[ns.GlobalModel.FLASH];

		if (useFallbackList) {
			var defaultOrder = mc.getDefaultQuality();
			for (var j = 0; j <= defaultOrder.length; j++) {
				var curOrder = defaultOrder[j];

				if (useFallbackList[curOrder]) {
					var q = useFallbackList[curOrder];
					useFallbackList[curOrder] = null;

					if (linkList != "")
						linkList += " ";

					var streamStr = "";
					if (q.getServer())
						streamStr += q.getServer();

					var stream = q.getStream();
					if (typeof stream == 'string') {
						streamStr += stream;
					} else {
						if (stream.hasOwnProperty('length') && stream.length > 0) {
							streamStr = stream[0];
						}
					}

					linkList += '<a class="ardplayer-error-button" href="' + streamStr + '" target="_blank">' + q.getLabel() + '</a>';

					if (++i == 3)
						break;
				}
			}

			if (linkList != "") {
				$('<p class="ardplayer-q-select">')
					.html("Qualitätsauswahl für externen Player:<br/>" + linkList )//+ "<br/><br/>Weitere Hinweise finden Sie auf der Hilfeseite.")
					.appendTo(this.errorDiv);
			}
		}

		// Optionaler Zusatzlink im Footer
        if (!$.isBlank(ns.ErrorController.ERROR_FOOTER_LINK))
        {
            try {
                $(ns.ErrorController.ERROR_FOOTER_LINK)
                    .appendTo(this.errorDiv);
            } catch ( ex ) {
				console.log(ex)
			}
        }
	};

	p.writeNotificationInstallFlash = function () {

		// Standardnachricht die auch angezeigt wird, falls die Regeln nicht geladen werden konnten.
		var message = 'Um den Clip abspielen zu k&ouml;nnen, ben&ouml;tigen Sie das Flash-Plug-in ab Version 10.2. Dieses k&ouml;nnen Sie <a href="http://get.adobe.com/de/flashplayer/" onclick="window.open(this.href); return false;">hier</a> kostenlos herunterladen.';
		var uAgent = navigator.userAgent;

		var rules = ns.Player.pluginDetectionRules;
		if (rules) {
			var currentCase, currentTest, hitMessage;
			for (var i = 0; i < rules.cases.length; i++) {
				currentCase = rules.cases[i];

				for (var j = 0; j < currentCase.tests.length; j++) {
					currentTest = currentCase.tests[j];

					if (uAgent.match(new RegExp(currentTest))) {
						hitMessage = currentCase.message;
						break;
					}
				}

				if (hitMessage)
					break;
			}

			message = hitMessage || rules.defaultMessage;
		}

		this.writeNotification(message, "plugin");

        if ( this.player )
            this.player.dispatchCustomEvent(ns.Player.EVENT_ERROR, {isCritical:true, message:message});
	};

	p.writeNotificationInstallHTML5 = function () {
		this.writeNotification('Es ist notwendig, dass Ihr Browser den HTML5-Player unterst&uuml;tzt,<br>um den Clip abspielen zu k&ouml;nnen.', "plugin");
	};

	/** ERROR HANDLING ENDS **/

	/**
	 * Viewport CSS Class name
	 * @public
	 * @static
	 */
	ViewController.CLASS_VIEWPORT = "ardplayer-viewport";
	/**
	 * Posterframe CSS Class Name
	 * @public
	 * @static
	 */
	ViewController.CLASS_POSTERFRAME = "ardplayer-posterframe";
	/**
	 * Posterframe CSS Class Name
	 * @public
	 * @static
	 */
	ViewController.CLASS_POSTERFRAME_TARGET_CLASS = "posterframe";
	/**
	 * Posterframe CSS Class Name
	 * @public
	 * @static
	 */
	ViewController.CLASS_POSTER_CONTROL = "ardplayer-postercontrol";

	/**
	 * Buffering Indicator CSS Class Name
	 * @public
	 * @static
	 */
	ViewController.CLASS_BUFFERING_INDICATOR = "ardplayer-buffering";

	/**
	 * Play Again CSS Class Name
	 * @public
	 * @static
	 */
	ViewController.CLASS_PLAY_AGAIN = "ardplayer-btn-playagain";

	/**
	 * Posterframe CSS Class Name
	 * @public
	 * @static
	 */
	ViewController.CLASS_AUDIO_FRAME = "ardplayer-audioframe";
	/**
	 * Posterframe CSS Class Name (Image)
	 * @public
	 * @static
	 */
	ViewController.CLASS_AUDIO_FRAME_IMAGE = "ardplayer-audioimage";

	/**
	 * MediaCanvas CSS Class Name
	 * @public
	 * @static
	 */
	ViewController.CLASS_MEDIA_CANVAS = "ardplayer-mediacanvas";
	/**
	 * Main Controlbar Class
	 * @public
	 * @static
	 */
	ViewController.CLASS_MAINCONTROLBAR = "ardplayer-controlbar";

	/**
	 * Main Controlbar Box Class
	 * @public
	 * @static
	 */
	ViewController.CLASS_MAINCONTROLBAR_BOX = "ardplayer-controlbar-controls";

	/**
	 * Preroll info Box Class
	 * @public
	 * @static
	 */
	ViewController.CLASS_PREROLL_INFO = "ardplayer-preroll-info";

	/**
	 * Preroll skip Box Class
	 * @public
	 * @static
	 */
	ViewController.CLASS_PREROLL_SKIP = "ardplayer-preroll-skip";

	/**
	 * CSS Classn Name der gesamte Hauptleiste
	 * @public
	 * @static
	 */
	ViewController.CLASS_MAINCONTROLS = "ardplayer-transportbox";
	/**
	 * CSS Class Name des gesamter Containers für die Zeit
	 * @public
	 * @static
	 */
	ViewController.CLASS_TIME_CONTAINER = "ardplayer-time";
    /**
     * CSS Class Name des Versionslabels
     * @public
     * @static
     */
    ViewController.CLASS_VERSIONLABEL = "ardplayer-versionlabel";
	/**
	 * CSS Class Name für PlayPause Btn
	 * @public
	 * @static
	 */
	ViewController.CLASS_PLAY_PAUSE = "ardplayer-btn-playpause";
	/**
	 * CSS Class Name für Platzhater Optionen-Steuerung
	 * @public
	 * @static
	 */
	ViewController.CLASS_OPTIONS_DIALOG = "ardplayer-optioncontrols";
	/**
	 * CSS Class für Container aller Sound Elemente
	 * @public
	 * @static
	 */
	ViewController.CLASS_VOLUME_CONTAINER = "ardplayer-sound-container";
	/**
	 * CSS Class für Lautstärke Btn
	 * @public
	 * @static
	 */
	ViewController.CLASS_VOLUME = "ardplayer-btn-sound";
	/**
	 * CSS Class für Lautstärke Slider
	 * @public
	 * @static
	 */
	ViewController.CLASS_VOLUME_SLIDER = "ardplayer-sound-slider";
	/**
	 * CSS Class Name für Settings Btn
	 * @public
	 * @static
	 */
	ViewController.CLASS_SETTINGS = "ardplayer-btn-videosettings";
	/**
	 * CSS Class Name für Vollbild Btn
	 * @public
	 * @static
	 */
	ViewController.CLASS_FULLSCREEN = "ardplayer-btn-fullscreen";
	/**
	 * CSS Class Name für den gesamte Zeitleisten Container
	 * @public
	 * @static
	 */
	ViewController.CLASS_TIME_CONTROLS = "ardplayer-controlbar-slider";
	/**
	 * CSS Class Name für DVR Back to Live Schaltfläche
	 * @public
	 * @static
	 */
	ViewController.CLASS_DVR = "ardplayer-btn-dvr";

	/**
	 * CSS Class Name für Options-Dialog Schaltfläche
	 * @public
	 * @static
	 */
	ViewController.CLASS_OPTIONS = "ardplayer-btn-settings";

	/**
	 * CSS Class Name für Equalizer
	 * @public
	 * @static
	 */
	ViewController.CLASS_EQUALIZE = "ardplayer-equalize";
	/**
	 * CSS Class Name für timeContainer
	 * @public
	 * @static
	 */
	ViewController.CLASS_EQUALIZE_SHORT = "equalize";
	/**
	 * CSS Class Name für die Transportbox
	 * @public
	 * @static
	 */
	ViewController.CLASS_TRANSPORTBOX = "ardplayer-transportbox";
	/**
	 * CSS Class Name für die functionBtnBox
	 * @public
	 * @static
	 */
	ViewController.CLASS_PLAYER_FUNKTION_BOX = "ardplayer-player-funktion";

	ns.ViewController = ViewController;

})(ardplayer, ardplayer.jq, ardplayer.console);
