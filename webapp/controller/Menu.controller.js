sap.ui.define(
  [
    "com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/bozankaya/ZBZ_MALZEME_NAKIL/model/formatter",
  ],
  function (
    BaseController,
    JSONModel,
    BusyIndicator,
    Filter,
    FilterOperator,
    formatter
  ) {
    "use strict";

    return BaseController.extend(
      "com.bozankaya.ZBZ_MALZEME_NAKIL.controller.Menu",
      {
        formatter: formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Menu
         */
        onInit: function () {},
        onReadBarcode: function () {
          this.getOwnerComponent().oBarcodeInput.open(this.getView(), this);
        },

        onDisplayList: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("FormList");

          // var oObject = oEvent.getSource().getBindingContext("Formno").getObject();
          // var oFormno = oEvent.getSource().getSelectedItem().getBindingContext().getObject().Formno;
          var that = this;
          // var oModelJson = new sap.ui.model.json.JSONModel();

          // var oFilters = [];
          var oModel = this.getView().getModel();
          var oViewModel = new JSONModel({
            busy: true,
            delay: 0,
          });

          sap.ui.core.BusyIndicator.show();

          oModel.read("/FormnoListSet", {
            success: function (oData, oResponse) {
              var jsonForm = new sap.ui.model.json.JSONModel();
              jsonForm.setData(oData);
              jsonForm.setSizeLimit(999999);

              // sap.ui.getCore().setModel(jsonForm, "Item");
              that.getOwnerComponent().setModel(jsonForm, "List");
              // oViewModel.setProperty("/busy", false);
              // var oItem = that.getOwnerComponent().getModel("Item").oData;
            },
            error: function (oData, oResponse) {
              //execute in case of call fail

              var obj = JSON.parse(oData.response.body);
              var msg = obj.error.message.value;
              sap.m.MessageBox.show(msg, {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: "Error",
                actions: [sap.m.MessageBox.Action.OK],
              });
              // oViewModel.setProperty("/busy", false);
            },
          });

          sap.ui.core.BusyIndicator.hide();
        },
        //Added by Solen Dogan-22.02.2022
        onPressYapıstırmaSika: function () {
          let oModelLgort = this.getOwnerComponent().getModel();
          let Toplam = 0,
            ToplamSure = 0,
            KalanSure = 0;
          debugger;
          let _successHandler = function (oData, oResponse) {
            $.each(oData.results, function (index, data) {
              Toplam = Toplam + parseInt(data.YapistirmaMik);
              ToplamSure = ToplamSure + parseInt(data.Toplamsure);
              KalanSure = KalanSure + parseInt(data.Kalansure);
            });

            var oHeaderModel = new JSONModel({
              ToplamKalan: Toplam,
              ToplamSure: ToplamSure,
              KalanSure: KalanSure,
            });
            this.getOwnerComponent().setModel(oHeaderModel, "HeaderY");
          };

          let _errorHandler = function (oError) {
            var sErrorMessage = JSON.parse(oError.responseText).error.message
              .value;
            this.showErrorMessage("Hata", sErrorMessage);
          };

          oModelLgort.read("/YapistirSikaSet", {
            success: _successHandler.bind(this),
            error: _errorHandler.bind(this),
          });

          this.getRouter().navTo("YapistirmaSika");
        },
        //Demo code on calling ODATA action
        _onPressCallFunctionGetWerks: function () {
          var that = this;
          var oModelLgort = this.getOwnerComponent().getModel();
          var Toplam = 0;
          var ToplamSure = 0,
            KalanSure = 0;
          const sWerks = "GRBO";
          let sPath = "/getTeyitSetByWerks?Werks='" + sWerks + "'";

          oModelLgort.callFunction("/getTeyitSetByWerks", {
            // function import name
            method: "GET", // http method
            urlParameters: {
              Werks: sWerks,
            }, // function import parameters
            sucess: function (oData, response) {}, // callback function for success
            error: function (oError) {}, // callback function for error
          });
        },
        onPressKaynakTeyit: function () {
          var that = this;
          var oModelLgort = this.getOwnerComponent().getModel();
          var Toplam = 0;
          var ToplamSure = 0,
            KalanSure = 0;

          oModelLgort.read("/TeyitSet", {
            success: function (oData, oResponse2) {
              var jsonForm = new sap.ui.model.json.JSONModel();
              jsonForm.setData(oData);
              jsonForm.setSizeLimit(999999);

              if (oData.results.length > 0) {
                for (var i = 0; i < oData.results.length; i++) {
                  Toplam = Toplam + parseInt(oData.results[i].KynkMik);
                  ToplamSure =
                    ToplamSure + parseInt(oData.results[i].Toplamsure);
                  KalanSure = KalanSure + parseInt(oData.results[i].Kalansure);
                }
                var oHeaderModel = new JSONModel({
                  ToplamKalan: Toplam,
                  ToplamSure: ToplamSure,
                  KalanSure: KalanSure,
                });
                that.getOwnerComponent().setModel(oHeaderModel, "HeaderK");
              }
            },
            error: function (oError) {
              var sErrorMessage = JSON.parse(oError.responseText).error.message
                .value;
              that.showErrorMessage("Hata", sErrorMessage);
            },
          });

          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("KaynakTeyit");
        },
        onPressTesviyeTeyit: function () {
          var that = this;
          var oModelLgort = this.getOwnerComponent().getModel();
          var Toplam = 0;

          oModelLgort.read("/TesviyeTeyitSet", {
            success: function (oData, oResponse2) {
              var jsonForm = new sap.ui.model.json.JSONModel();
              jsonForm.setData(oData);
              jsonForm.setSizeLimit(999999);

              if (oData.results.length > 0) {
                for (var i = 0; i < oData.results.length; i++) {
                  Toplam = Toplam + parseInt(oData.results[i].TesMik);
                }
                var oHeaderModel = new JSONModel({
                  ToplamKalan: Toplam,
                });
                that.getOwnerComponent().setModel(oHeaderModel, "HeaderT");
              }
            },
            error: function (oError) {
              var sErrorMessage = JSON.parse(oError.responseText).error.message
                .value;
              that.showErrorMessage("Hata", sErrorMessage);
            },
          });

          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("TesviyeTeyit");
        },
        onPressMontaj: function () {
          var that = this;
          var oModelLgort = this.getOwnerComponent().getModel();
          var Toplam = 0;

          oModelLgort.read("/MontajSet", {
            success: function (oData) {
              var jsonForm = new sap.ui.model.json.JSONModel();
              jsonForm.setData(oData);
              jsonForm.setSizeLimit(999999);

              if (oData.results.length > 0) {
                for (var i = 0; i < oData.results.length; i++) {
                  Toplam = Toplam + parseInt(oData.results[i].MonMik);
                }
                var oHeaderModel = new JSONModel({
                  ToplamKalan: Toplam,
                });
                that.getOwnerComponent().setModel(oHeaderModel, "HeaderM");
              }
            },
            error: function (oError) {
              var sErrorMessage = JSON.parse(oError.responseText).error.message
                .value;
              that.showErrorMessage("Hata", sErrorMessage);
            },
          });

          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("Montaj");
        },

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Menu
         */
        //	onBeforeRendering: function() {
        //
        //	},

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Menu
         */
        //	onAfterRendering: function() {
        //
        //	},

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.Menu
         */
        //	onExit: function() {
        //
        //	}
      }
    );
  }
);
