sap.ui.define([], function () {
	"use strict";

	return {
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		// determineTicketDurumVisibility: function(pDurum) {
		// 	// console.log(pDurum);
		// 	// debugger;
		// 	// return pDurum === "Testte" ? true : false;

		// 	if (pDurum === "Testtte") {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// },
		convertToEdmTime: function (dTime) {
			var oTimeFormat = sap.ui.core.format.DateFormat
				.getTimeInstance({
					pattern: dTime
				});
			var aTempTimeArray = oTimeFormat.format(new Date(dTime)).split(":");
			if (aTempTimeArray.length === 3) {
				dTime = aTempTimeArray[0] + aTempTimeArray[1] + aTempTimeArray[2];
			} else {
				dTime = null;
			}
			return dTime;
		},

		convertDurumToState: function (pDurum) {

			if (pDurum === "4") {
				return sap.ui.core.ValueState.Error;
			} else if (pDurum === "2") {
				return sap.ui.core.ValueState.Warning;
			} else if (pDurum === "3") {
				return sap.ui.core.ValueState.Error;
			} else if (pDurum === "1") {
				return sap.ui.core.ValueState.Success;
			} else {
				return sap.ui.core.ValueState.None;
			}

		},

		convertDurumToIcon: function (pDurum) {

			if (pDurum === "1") {
				return 'sap-icon://alert';
			} else if (pDurum === "2") {
				return 'sap-icon://alert';
			} else if (pDurum === "3") {
				return 'sap-icon://alert';
			} else if (pDurum === "4") {
				return 'sap-icon://alert';
			} else {
				return 'sap-icon://alert';
			}

		},

		convertToLowerCase: function (pValue) {
			if (pValue) {
				pValue = pValue.toLowerCase();
				var firstLetter = pValue.substring(0, 1).toUpperCase();
				pValue = pValue.slice(1);
				return firstLetter + pValue;
			}
		},

		convertOncelikToState: function (pOncelik) {

			if (pOncelik === "ACIL" || pOncelik === "ACİL" || pOncelik === "acil" || pOncelik === "Acil" || pOncelik === "acıl") {
				return sap.ui.core.ValueState.Error;
			} else if (pOncelik === "YUKSEK" || pOncelik === "YÜKSEK" || pOncelik === "yüksek" || pOncelik === "Yüksek" || pOncelik === "yuksek") {
				return sap.ui.core.ValueState.Warning;
			} else if (pOncelik === "ORTA" || pOncelik === "orta" || pOncelik === "Orta") {
				return sap.ui.core.ValueState.None;
			} else if (pOncelik === "DÜŞÜK" || pOncelik === "DUŞUK" || pOncelik === "DÜSÜK" || pOncelik === "DUSUK" || pOncelik === "dusuk" ||
				pOncelik === "düsük" || pOncelik === "düşük" || pOncelik === "Düşük" || pOncelik === "Düsük") {
				return sap.ui.core.ValueState.Success;
			} else {
				return sap.ui.core.ValueState.Error;
			}

		},

		convertOncelikToIcon: function (pOncelik) {

			if (pOncelik === "ACIL" || pOncelik === "ACİL" || pOncelik === "acil" || pOncelik === "Acil" || pOncelik === "acıl") {
				return 'sap-icon://status-error';
			} else if (pOncelik === "YUKSEK" || pOncelik === "YÜKSEK" || pOncelik === "yüksek" || pOncelik === "Yüksek" || pOncelik === "yuksek") {
				return 'sap-icon://status-critical';
			} else if (pOncelik === "ORTA" || pOncelik === "orta" || pOncelik === "Orta") {
				return 'sap-icon://status-inactive';
			} else if (pOncelik === "DÜŞÜK" || pOncelik === "DUŞUK" || pOncelik === "DÜSÜK" || pOncelik === "DUSUK" || pOncelik === "dusuk" ||
				pOncelik === "düsük" || pOncelik === "düşük" || pOncelik === "Düşük" || pOncelik === "Düsük") {
				return 'sap-icon://status-positive';
			} else {
				return 'sap-icon://bell';
			}

		},

		determineEditBtnEnabled: function (pDurum) {
			return pDurum === "Tamamlandı" ? false : true;
		},

		convAciliyetToState: function (bAciliyet) {
			return bAciliyet ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.Success;
		},
		yetkiVarmi: function(bYetki){
			if (!bYetki){
				return sap.m.LoadState.Disabled;	
			}
		}

	};

});