sap.ui.define([
	"com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
	"com/bozankaya/ZBZ_MALZEME_NAKIL/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, formatter, Filter, FilterOperator, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("com.bozankaya.ZBZ_MALZEME_NAKIL.controller.TesviyeTeyit", {
		formatter: formatter,

		onInit: function () {
			var oView = this.getView();
			oView.addEventDelegate({
				onAfterShow: function (oEvent) {
					oView.getModel().refresh();
				}
			}, oView);
		},

		onNavBack: function () {
			//history.go(-1);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Menu");
		},

		onPressTeyitBtn: function (oEvent) {
			var that = this;

			var serviceUrl = this.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["ZBZ_MALZEME_NAKIL_SRV"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			oModel.setHeaders({
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token": "Fetch"
			});

			var oObject = oEvent.getSource().getBindingContext().getObject();
			var sPath = "/TesviyeTeyitSet('" + oObject.Formno + "')";
			var oEntry = {};
			oEntry.Formno = oObject.Formno;
			oEntry.Ismik = oObject.Ismik;

			sap.ui.core.BusyIndicator.show();
			oModel.update(sPath, oEntry, {
				success: function (data, oResponse) {
					// that.showMessage("sucMsg");
					var sCompleteMessage = oResponse.headers["sap-message"];
					var oMessage = JSON.parse(sCompleteMessage);
					// MessageBox.success(oMessage.message, {
					// 	onClose: function (sAction) {
							
					// 	}
					// });
					
					var aMessage = oMessage.message.split("-");
					var msg = "";
					for (var k = 0; k < aMessage.length; k++) {
						msg = msg + aMessage[k] + "\n";
					}

					MessageBox.success(msg);
					that.getView().getModel().refresh(true, false);
					that.getView().getModel().resetChanges();
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oError) {
					// var sErrorMessage = JSON.parse(oError.responseText).error.message.value;
					// that.showErrorMessage("loginErrorTitle", sErrorMessage);
					that._errorMessages(oError, that);
					sap.ui.core.BusyIndicator.hide();
				}

			});
		},

		_errorMessages: function (oError, that) {
			var oMessage = JSON.parse(oError.responseText).error.innererror.errordetails;
			var aMockMessages = [];

			if (oMessage.length > 0) {

				for (var i = 0; i < oMessage.length; i++) {
					var sMsg = oMessage[i].message;

					var oArray = {
						type: sap.ui.core.MessageType.Error,
						title: sMsg
					};
					aMockMessages.push(oArray);
				}
				that.getOwnerComponent().oMessageDialog.open(that, aMockMessages);

			}
		}

	});

});