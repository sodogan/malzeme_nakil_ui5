sap.ui.define([
	"com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/ui/core/mvc/Controller",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/ButtonType",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
	// "sap/ui/core/routing/History"
], function (BaseController, Filter, FilterOperator, Button, Dialog, Label, MessageToast, Text, TextArea, Controller, HorizontalLayout,
	VerticalLayout, ButtonType, BusyIndicator, JSONModel) {
	"use strict";

	return BaseController.extend("com.bozankaya.ZBZ_MALZEME_NAKIL.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Detail
		 */
		onInit: function () {
			var oViewModel = new JSONModel({
				enabled: false
			});
			this.getView().setModel(oViewModel, "detailView");
			
			
		},
		
		onSelectAciliyet: function(){
			var arr = this.getOwnerComponent().getModel("AcilModel").oData;
			
			var oViewModel = this.getView().getModel("detailView");
			
			var bSelAft = this.getView().byId("acilyetCb").getSelected();
			var bSelBef = arr.Aciliyet;
			
			if (bSelAft !== bSelBef){
				oViewModel.setProperty("/enabled", true);
			}else{
				oViewModel.setProperty("/enabled", false);
			}
			
			
		},
		onNakil: function () {

			var oItem = this.getView().getModel("Item").oData;

			var jsonData = JSON.stringify(oItem);
			var encodedString = btoa(unescape(encodeURIComponent(jsonData)));

			var sValue = this.getView().byId("rpsmngInput").getValue();
			
			var oHeader = this.getView().getModel("Header").oData;
			
			var sRpsmng_gncl = oHeader.RpsmngGncl;
			
			if ( sValue !== sRpsmng_gncl ){
				this.showErrorMessage("Uyarı", "Lütfen nakil işleminden önce kaydedin!");
				return;
			}
			this.oCreateArray = {};

			this.oCreateArray.String = encodedString;
			this.oCreateArray.Method = "2";
			this.oCreateArray.Rpsmng = sValue;
			this._saveData(this.oCreateArray);
		},
		onDelete: function () {

			var oItem = this.getView().getModel("Item").oData;
			var jsonData = JSON.stringify(oItem);
			var encodedString = btoa(unescape(encodeURIComponent(jsonData)));
			var that = this;

			var oDialog = new Dialog({
				//title: 'Form Numarası Sil',
				type: 'Message',
				content: new Text({
					text: 'Form numarası silinecektir. Emin misiniz?'
				}),
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: 'Evet',
					press: function () {

						that.oCreateArray = {};

						that.oCreateArray.String = encodedString;
						that.oCreateArray.Method = "3";
						that._saveData(that.oCreateArray);
						oDialog.close();
						// var oRouter = sap.ui.core.UIComponent.getRouterFor(that);

						// var oNav = that.getOwnerComponent().getModel("Nav").oData;

						// if (oNav.Nav === "1") {
						// 	oRouter.navTo("Menu");
						// } else {
						// 	oRouter.navTo("FormList");
						// }
					}
				}),
				endButton: new Button({
					text: 'Hayır',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();

			// this.oCreateArray = {};

			// this.oCreateArray.String = encodedString;
			// this.oCreateArray.Method = "3";
			// this._saveData(this.oCreateArray);

		},
		onReverse: function () {

			var oItem = this.getView().getModel("Item").oData;
			var jsonData = JSON.stringify(oItem);

			var encodedString = btoa(unescape(encodeURIComponent(jsonData)));

			this.oCreateArray = {};

			this.oCreateArray.String = encodedString;
			this.oCreateArray.Method = "4";
			this._saveData(this.oCreateArray);

			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			// var oNav = this.getOwnerComponent().getModel("Nav").oData;

			// if (oNav.Nav === "1") {
			// 	oRouter.navTo("Menu");
			// } else {
			// 	oRouter.navTo("FormList");
			// }

		},
		onPrint: function () {

			var oItem = this.getView().getModel("Item").oData;
			var jsonData = JSON.stringify(oItem);

			var encodedString = btoa(unescape(encodeURIComponent(jsonData)));

			this.oCreateArray = {};

			this.oCreateArray.String = encodedString;
			this.oCreateArray.Method = "5";
			this._saveData(this.oCreateArray);
		},
		onBarcode: function (){
			var oItem = this.getView().getModel("Item").oData;
			var jsonData = JSON.stringify(oItem);
			
			var oHeader = this.getOwnerComponent().getModel("Header").oData;

			var encodedString = btoa(unescape(encodeURIComponent(jsonData)));

			this.oCreateArray = {};

			this.oCreateArray.String = encodedString;
			this.oCreateArray.Method = "6";
			this.oCreateArray.Rpsmng = oHeader.Rpsmng;
			this._saveData(this.oCreateArray);
		},
		onSave: function () {

			var oItem = this.getView().getModel("Item").oData;
			var jsonData = JSON.stringify(oItem);

			var encodedString = btoa(unescape(encodeURIComponent(jsonData)));
			
			var sValue = this.getView().byId("rpsmngInput").getValue();
			var oHeader = this.getOwnerComponent().getModel("Header").getData();
			var Ismik_tp = oHeader.RpsmngTmp;
			
			var Ismik_gn = oHeader.RpsmngGncl;

			var regex = /^[0-9]+$/;
			if (!sValue.match(regex)) {
				this.showErrorMessage("loginErrorTitle", "Lütfen miktar alanına tamsayı giriniz.");
				return;
			}
			sValue = parseInt(sValue);
			if (sValue === 0 || !sValue) {
				this.showErrorMessage("loginErrorTitle", "İşlem miktarı 0 olamaz");
				return;
			} else if (sValue > Ismik_tp) {
				this.showErrorMessage("loginErrorTitle", "Rezervasyon miktarından daha fazla çıkış yapamazsınız");
				return;
			}
			if ( Ismik_gn === 0){
				sValue = parseInt( Ismik_tp );
			}
			var oViewModel = this.getView().getModel("detailView");
			oViewModel.setProperty("/enabled", false);
			
			this.oCreateArray = {};

			this.oCreateArray.String = encodedString;
			this.oCreateArray.Method = "1";
			this.oCreateArray.Aciliyet = this.getView().byId("acilyetCb").getSelected();
			this.oCreateArray.Rpsmng = sValue;
			this._saveData(this.oCreateArray);

		},

		_saveData: function (pData) {
			sap.ui.core.BusyIndicator.show();
			var that = this;

			var serviceUrl = this.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["ZBZ_MALZEME_NAKIL_SRV"].uri;

			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			oModel.setHeaders({
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token": "Fetch"
			});

			oModel.create("/DetailTableSet", pData, {
				success: function (oData, oResponse) {

					var sCompleteMessage = oResponse.headers["sap-message"];
					if (sCompleteMessage) {
						var oMessage = JSON.parse(sCompleteMessage);
						that.showSuccessMessage("", oMessage.message);
					}

					sap.ui.core.BusyIndicator.hide();

					var oHeader = that.getOwnerComponent().getModel("Header").oData;
					var oFormno = oHeader.Formno;
					that._bindDetailTable(that, oFormno, false);

				},
				error: function (oError) {
					var sErrorMessage = JSON.parse(oError.responseText).error.message.value;
					that.showErrorMessage("loginErrorTitle", sErrorMessage);
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		onNavBack: function () {

			// history.go(-1);
			// var list = this.getView().byId("idProductsTable");

			// var binding = list.getBinding("items");
			// sap.ui.getCore().byId("idProductsTable").getModel().refresh(true);
			// this.getRouter().initialize();
			// binding.refresh(true);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var oNav = this.getOwnerComponent().getModel("Nav").oData;

			if (oNav.Nav === "1") {
				oRouter.navTo("Menu");
			} else {
				var that = this;
				// var oModelJson = new sap.ui.model.json.JSONModel();

				// var oFilters = [];
				var oModel = this.getView().getModel();

				// oFilters.push(new Filter("Formno", FilterOperator.EQ, oFormno));
				oModel.read("/FormnoListSet", {
					success: function (oData, oResponse) {

						var jsonForm = new sap.ui.model.json.JSONModel();
						jsonForm.setData(oData);
						jsonForm.setSizeLimit(999999);

						// sap.ui.getCore().setModel(jsonForm, "Item");
						that.getOwnerComponent().setModel(jsonForm, "List");

						// var oItem = that.getOwnerComponent().getModel("Item").oData;
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

				oRouter.navTo("FormList");
			}
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("Menu");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Detail
		 */
		onBeforeRendering: function () {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Detail
		 */
		onAfterRendering: function () {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Detail
		 */
		onExit: function () {},

		onSubmitRpsmng: function (oEvent) {
			var sValue = this.getView().byId("rpsmngInput").getValue();
			var oJSON = this.getOwnerComponent().getModel("Item");
			var aData = oJSON.getData().results;
			var ismik = 0;

			var oHeader = this.getOwnerComponent().getModel("Header").getData();
			var Ismik_tp = oHeader.RpsmngTmp;

			var regex = /^[0-9]+$/;
			if (!sValue.match(regex)) {
				this.showErrorMessage("loginErrorTitle", "Lütfen miktar alanına tamsayı giriniz.");
				return;
			}

			sValue = parseInt(sValue);
			if (sValue === 0 || !sValue) {
				this.showErrorMessage("loginErrorTitle", "İşlem miktarı 0 olamaz");
				return;
			} else if (sValue > Ismik_tp) {
				this.showErrorMessage("loginErrorTitle", "Rezervasyon miktarından daha fazla çıkış yapamazsınız");
				return;
			}
			var oViewModel = this.getView().getModel("detailView");
			oViewModel.setProperty("/enabled", true);
			
			var oHeaderData = this.getOwnerComponent().getModel("Header").getData();
			var oFilters = [];
			var oModel = this.getView().getModel();
			oFilters.push(new Filter("Formno", FilterOperator.EQ, oHeaderData.Formno));
			oFilters.push(new Filter("Rpsmng", FilterOperator.EQ, sValue));

			sap.ui.core.BusyIndicator.show();
			var that = this;
			oModel.read("/DetailSet", {
				filters: oFilters,
				success: function (oData, oResponse) {
					var jsonForm = new sap.ui.model.json.JSONModel();
					jsonForm.setData(oData);
					jsonForm.setSizeLimit(999999);
					that.getOwnerComponent().setModel(jsonForm, "Item");
				},
				error: function (oData, oResponse) {
					var obj = JSON.parse(oData.response.body);
					var msg = obj.error.message.value;
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK]
					});
				}
			});
			sap.ui.core.BusyIndicator.hide();
		}

		// onSubmitRpsmng: function (oEvent) {
		// 	var sValue = this.getView().byId("rpsmngInput").getValue();
		// 	// var oJSON = this.getOwnerComponent().getModel("Item");
		// 	// var aData = oJSON.getData().results;
		// 	// var Ismik_tp = 0,
		// 	// 	ismik = 0;

		// 	// var oHeader = this.getOwnerComponent().getModel("Header");

		// 	var regex = /^[0-9]+$/;
		// 	if (!sValue.match(regex)) {
		// 		this.showErrorMessage("loginErrorTitle", "Lütfen miktar alanına tamsayı giriniz.");
		// 		return;
		// 	}

		// 	var oItem = this.getView().getModel("Item").oData;
		// 	var jsonData = JSON.stringify(oItem);

		// 	var encodedString = btoa(unescape(encodeURIComponent(jsonData)));

		// 	this.oCreateArray = {};
		// 	this.oCreateArray.String = encodedString;
		// 	this.oCreateArray.Method = "6";
		// 	this.oCreateArray.Rpsmng = sValue;
		// 	this._saveData(this.oCreateArray);
		// }

	});

});