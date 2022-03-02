sap.ui.define(
  [
    "com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
    "com/bozankaya/ZBZ_MALZEME_NAKIL/model/formatter",
    "sap/m/MessageBox",
  ],
  function (BaseController, formatter, MessageBox) {
    "use strict";

    return BaseController.extend(
      "com.bozankaya.ZBZ_MALZEME_NAKIL.controller.YapistirmaSika",
      {
        formatter: formatter,
        onInit: function () {
          var oView = this.getView();
          oView.addEventDelegate(
            {
              onAfterShow: function (oEvent) {
                oView.getModel().refresh();
              },
            },
            oView
          );
        },

        onNavBack: function () {
          //history.go(-1);
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("Menu");
        },

        onPressTeyitBtn: function (oEvent) {
          var that = this;
          debugger;
          var serviceUrl = this.getOwnerComponent()
            .getMetadata()
            .getManifestEntry("sap.app").dataSources[
            "ZBZ_MALZEME_NAKIL_SRV"
          ].uri;
          var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
          oModel.setHeaders({
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/atom+xml",
            DataServiceVersion: "2.0",
            "X-CSRF-Token": "Fetch",
          });

          var oObject = oEvent.getSource().getBindingContext().getObject();
          var sPath = "/YapistirSikaSet('" + oObject.Formno + "')";
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
            },
          });
        },

        _errorMessages: function (oError, that) {
          var oMessage = JSON.parse(oError.responseText).error.innererror
            .errordetails;
          var aMockMessages = [];

          if (oMessage.length > 0) {
            for (var i = 0; i < oMessage.length; i++) {
              var sMsg = oMessage[i].message;

              var oArray = {
                type: sap.ui.core.MessageType.Error,
                title: sMsg,
              };
              aMockMessages.push(oArray);
            }
            that.getOwnerComponent().oMessageDialog.open(that, aMockMessages);
          }
        },
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.view.YapistirmaSika
         */
        //	onInit: function() {
        //
        //	},

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.view.YapistirmaSika
         */
        //	onBeforeRendering: function() {
        //
        //	},

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.view.YapistirmaSika
         */
        //	onAfterRendering: function() {
        //
        //	},

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf com.bozankaya.ZBZ_MALZEME_NAKIL.view.view.YapistirmaSika
         */
        //	onExit: function() {
        //
        //	}
      }
    );
  }
);
