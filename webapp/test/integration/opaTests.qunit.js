/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/bozankaya/ZBZ_MALZEME_NAKIL/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});