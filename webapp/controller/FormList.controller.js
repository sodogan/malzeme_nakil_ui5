sap.ui.define([
	"com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
	"com/bozankaya/ZBZ_MALZEME_NAKIL/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.bozankaya.ZBZ_MALZEME_NAKIL.controller.FormList", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.FormList
		 */
		onInit: function () {

		},
		onSearch: function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Formno", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("idProductsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onDetailPress: function (oEvent) {

			var oObject = oEvent.getSource().getBindingContext("Formno").getObject();
			// from this object, you can do oObject.CustomerID
		},
		onSelectionChange: function (oEvent) {

			// var oObject = oEvent.getSource().getBindingContext("Formno").getObject();
			var oFormno = "500032"; //.getSource().getSelectedItem().getBindingContext().getObject().Formno;
			var oView = this.getView();
			var o = oView.byId("idProductsTable").getSelectedItem().getBindingContext("List").getObject();
			var oFormno = o.Formno;
			var that = this;
			// var oModelJson = new sap.ui.model.json.JSONModel();

			// var oFilters = [];
			// var oModel = this.getView().getModel();

			// oFilters.push(new Filter("Formno", FilterOperator.EQ, oFormno));
			// oModel.read("/DetailSet", {
			// 	filters: oFilters,
			// 	success: function (oData, oResponse) {

			// 		var jsonForm = new sap.ui.model.json.JSONModel();
			// 		jsonForm.setData(oData);
			// 		jsonForm.setSizeLimit(999999);

			// 		// sap.ui.getCore().setModel(jsonForm, "Item");
			// 		that.getOwnerComponent().setModel(jsonForm, "Item");

			// 		var oItem = that.getOwnerComponent().getModel("Item").oData;

			// 		if (oItem.results.length > 0) {
			// 			var oDetailHeaderModel = new JSONModel({
			// 				Formno: oItem.results[0].Formno,
			// 				Lgort: oItem.results[0].Lgort,
			// 				Rsnum: oItem.results[0].Rsnum,
			// 				LgortK: oItem.results[0].LgortK,
			// 				MatnrS: oItem.results[0].MatnrS,
			// 				Aciliyet: oItem.results[0].Aciliyet,
			// 				Rpsmng: oItem.results[0].Rpsmng

			// 			});
			// 			that.getOwnerComponent().setModel(oDetailHeaderModel, "Header");
			// 			// var oHeader = that.getView().getModel("Header").oData;

			// 			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			// 			var oNavModel = new JSONModel({
			// 				Nav: "2"
			// 			});
			// 			that.getOwnerComponent().setModel(oNavModel, "Nav");
			// 			oRouter.navTo("Detail");

			// 		}

			// 	},
			// 	error: function (oData, oResponse) {
			// 		//execute in case of call fail
			// 		var obj = JSON.parse(oData.response.body);
			// 		var msg = obj.error.message.value;
			// 		sap.m.MessageBox.show(msg, {
			// 			icon: sap.m.MessageBox.Icon.ERROR,
			// 			title: "Error",
			// 			actions: [sap.m.MessageBox.Action.OK]
			// 		});
			// 	}
			// });
			that._bindDetailTable(that, oFormno, true);
		},

		onNavBack: function () {
			//history.go(-1);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Menu");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.FormList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.FormList
		 */
		onAfterRendering: function () {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.FormList
		 */
		onExit: function () {

		}

	});

});