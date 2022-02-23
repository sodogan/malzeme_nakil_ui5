/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	'sap/m/MessageBox',
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, History, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.bozankaya.ZBZ_MALZEME_NAKIL.controller.BaseController", {

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("menu", {}, true);
			}
		},

		getPropFromViewElemntBinding: function (pProperty) {
			return this.getView().getElementBinding().getBoundContext().getProperty(pProperty);
		},

		getBindObjectFromView: function () {
			return this.getView().getElementBinding().getBoundContext().getObject();
		},

		parseToFloat: function (pFloat) {
			return pFloat === "" ? 0.0 : parseFloat(pFloat).toFixed(2);
		},

		parseToInt: function (pInt) {
			return pInt === "" ? 0 : parseInt(pInt);
		},

		showMessage: function (pMsg, pVals) {
			var sTempMessage = this.getResourceBundle().getText(pMsg, pVals);
			MessageToast.show(sTempMessage, {
				duration: 3000,
				closeOnBrowserNavigation: false,
				width: "25em"
			});
		},

		showSuccessMessage: function (pTitle, pMsg) {
			var bCompact = this.getOwnerComponent().getContentDensityClass() === "sapUiSizeCompact";
			var pMBTitle = this.getView().getModel("i18n").getResourceBundle().getText(pTitle);
			var pMBMessage = this.getView().getModel("i18n").getResourceBundle().getText(pMsg);
			if (!pMBMessage) {
				pMBMessage = pMsg;
			}
			MessageBox.confirm(
				pMBMessage, {
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					title: pMBTitle,
					icon: sap.m.MessageBox.Icon.SUCCESS,
					actions: [sap.m.MessageBox.Action.OK]
				}
			);
		},

		showErrorMessage: function (pTitle, pMsg) {
			var bCompact = this.getOwnerComponent().getContentDensityClass() === "sapUiSizeCompact";
			var pMBTitle = this.getView().getModel("i18n").getResourceBundle().getText(pTitle);
			var pMBMessage = this.getView().getModel("i18n").getResourceBundle().getText(pMsg);
			if (!pMBMessage) {
				pMBMessage = pMsg;
			}
			MessageBox.confirm(
				pMBMessage, {
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					title: pMBTitle,
					icon: sap.m.MessageBox.Icon.ERROR,
					actions: [sap.m.MessageBox.Action.OK]
				}
			);
		},

		showConfirmationDialog: function (sConfMsg, fAccptFunction) {
			var bCompact = this.getOwnerComponent().getContentDensityClass() === "sapUiSizeCompact";
			var pMBMessage = this.getView().getModel("i18n").getResourceBundle().getText(sConfMsg);
			var pMBTitle = this.getView().getModel("i18n").getResourceBundle().getText("warnTitle");
			var that = this;
			MessageBox.confirm(
				pMBMessage, {
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					title: pMBTitle,
					icon: sap.m.MessageBox.Icon.WARNING,
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: fAccptFunction.bind(that)
				}
			);
		},

		getModelAndSetHeaders: function (pDataSource) {
			var oModel, sServiceUrl;
			if (pDataSource) {
				sServiceUrl = this.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources[pDataSource].uri;
				oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
			} else {
				oModel = this.getView().getModel();
			}
			oModel.setHeaders({
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token": "Fetch"
			});
			return oModel;
		},

		getValueAndSetValueState: function (pId) {
			var oInput = sap.ui.getCore().byId(pId);
			var sValue = oInput.getValue();
			if (sValue) {
				oInput.setValueState(sap.ui.core.ValueState.None);
			} else {
				oInput.setValueState(sap.ui.core.ValueState.Error);
			}
			return sValue;
		},

		setJson: function (aData) {

			var jsonForm = new sap.ui.model.json.JSONModel();
			jsonForm.setData(aData);
			jsonForm.setSizeLimit(999999);

			// sap.ui.getCore().setModel(jsonForm, "Item");
			this.getView().setModel(jsonForm, "Item");

			var oItem = this.getView().getModel("Item").oData;

			if (oItem.results.length > 0) {
				var oDetailHeaderModel = new JSONModel({
					Formno: oItem.results[0].Formno,
					Lgort: oItem.results[0].Lgort,
					Rsnum: oItem.results[0].Rsnum
				});
				this.getView().setModel(oDetailHeaderModel, "Header");
				var oHeader = this.getView().getModel("Header").oData;

			}
		},

		_bindDetailTable: function (that, oFormno, bNavFlag) {
			var oFilters = [];
			var oModel = this.getView().getModel();

			oFilters.push(new Filter("Formno", FilterOperator.EQ, oFormno));
			oModel.read("/DetailSet", {
				filters: oFilters,
				success: function (oData, oResponse) {

					var jsonForm = new sap.ui.model.json.JSONModel();
					jsonForm.setData(oData);
					jsonForm.setSizeLimit(999999);

					// sap.ui.getCore().setModel(jsonForm, "Item");
					that.getOwnerComponent().setModel(jsonForm, "Item");

					var oItem = that.getOwnerComponent().getModel("Item").oData;
					
					if (oItem.results.length > 0) {
						var oDetailHeaderModel = new JSONModel({
							Formno: oItem.results[0].Formno,
							Lgort: oItem.results[0].Lgort,
							Rsnum: oItem.results[0].Rsnum,
							LgortK: oItem.results[0].LgortK,
							MatnrS: oItem.results[0].MatnrS,
							Aciliyet: oItem.results[0].Aciliyet,
							Rpsmng: oItem.results[0].RpsmngGncl,
							RpsmngTmp: oItem.results[0].Rpsmng,
							RpsmngGncl: oItem.results[0].RpsmngGncl // oAkalan

						});
						that.getOwnerComponent().setModel(oDetailHeaderModel, "Header");
						// var oHeader = that.getView().getModel("Header").oData;

						if (bNavFlag) {
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							var oNavModel = new JSONModel({
								Nav: "2"
							});
							that.getOwnerComponent().setModel(oNavModel, "Nav");
							oRouter.navTo("Detail");
						}
						var bSel = oItem.results[0].Aciliyet;
						var oDetailModel = new JSONModel({
							Aciliyet: bSel,
						});
						that.getOwnerComponent().setModel(oDetailModel, "AcilModel");
					}

				},
				error: function (oData, oResponse) {
					//execute in case of call fail
					var obj = JSON.parse(oData.response.body);
					var msg = obj.error.message.value;
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK]
					});
				}
			});

		},
		

	});

});