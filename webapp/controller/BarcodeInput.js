sap.ui.define([
	"com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.bozankaya.ZBZ_MALZEME_NAKIL.controller.BarcodeInput", {

		_getDialog: function () {
			if (!this.oBarcodeInput) {
				this.oBarcodeInput = sap.ui.xmlfragment("com.bozankaya.ZBZ_MALZEME_NAKIL.view.BarcodeInput", this);
			}
			return this.oBarcodeInput;
		},
		open: function (oView, oController) {
			var oDialog = this._getDialog();
			this.oView = oView;
			this.oController = oController;
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
		},
		onCloseBarcodeInputDialog: function () {
			this._getDialog().close();
		},
		onDialogAfterClose: function () {

			this.oBarcodeInput.destroy();
			this.oBarcodeInput = undefined;
		},
		onChangeBarcodeInput: function (oEvent) {

			var barcode = oEvent.getSource().getValue();

			// var oBarcodeModel = new JSONModel({
			// 	barcode: barcode
			// });
			// this.getView().setModel(oBarcodeModel, "Barcode");
			this._getDialog().close();
			this.onDialogAfterClose();

			// this._clearDialog();

			// var oModel = this.getModelAndSetHeaders();
			var that = this;
			// var oModelJson = new sap.ui.model.json.JSONModel();

			var oFilters = [];
			var oModel = this.getView().getModel();

			oFilters.push(new Filter("Formno", FilterOperator.EQ, barcode));
			oModel.read("/DetailSet", {
				filters: oFilters,
				success: function (oData, oResponse) {

					var jsonForm = new sap.ui.model.json.JSONModel();
					jsonForm.setData(oData);
					jsonForm.setSizeLimit(999999);

					// sap.ui.getCore().setModel(jsonForm, "Item");
					that.getOwnerComponent().setModel(jsonForm, "Item");
					that.getOwnerComponent().setModel(jsonForm, "List");
					var oItem = that.getOwnerComponent().getModel("Item").oData;

					if (oItem.results.length > 0) {
						var oDetailHeaderModel = new JSONModel({
							Formno: oItem.results[0].Formno,
							Lgort: oItem.results[0].Lgort,
							Rsnum: oItem.results[0].Rsnum,
							LgortK: oItem.results[0].LgortK,
							MatnrS: oItem.results[0].MatnrS
						});
						that.getOwnerComponent().setModel(oDetailHeaderModel, "Header");
						// var oHeader = that.getView().getModel("Header").oData;
						
						// var oNav = that.getOwnerComponent().getModel("Nav").oData;
						// oNav.Nav = "1".
						// that.getOwnerComponent().setModel(oNav, "Nav");
						var oNavModel = new JSONModel({
							Nav: "1"
						});
						that.getOwnerComponent().setModel(oNavModel, "Nav");
						var oRouter = sap.ui.core.UIComponent.getRouterFor(that);

						oRouter.navTo("Detail");
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

		_clearDialog: function () {

		},

		onSelectShowBarcodeInput: function (oEvent) {

		}

	});

});