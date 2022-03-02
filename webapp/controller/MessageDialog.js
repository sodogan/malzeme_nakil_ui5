sap.ui.define(
  [
    "com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseController, Filter, FilterOperator, JSONModel) {
    "use strict";

    return BaseController.extend(
      "com.bozankaya.ZBZ_MALZEME_NAKIL.controller.MessageDialog",
      {
        _getDialog: function () {
          if (!this.MessageDialog) {
            this.MessageDialog = sap.ui.xmlfragment(
              this.oView.getId(),
              "com.bozankaya.ZBZ_MALZEME_NAKIL.view.fragments.MessageDialog",
              this
            );
          }
          return this.MessageDialog;
        },

        open: function (oController, aMockMessages) {
          this.oView = oController.getView();
          this.oController = oController;

          var oTempModel = new JSONModel();
          // var iLength = aMockMessages.length - 1;
          // aMockMessages.splice(iLength, 1);
          oTempModel.setData(aMockMessages);

          var oDialog = this._getDialog();

          oDialog.setModel(oTempModel, "message");
          oController.getView().addDependent(oDialog);

          oDialog.open();
        },

        onCloseDialog: function () {
          this._getDialog().close();
        },

        onDialogAfterClose: function () {
          this.MessageDialog.destroy();
          this.MessageDialog = undefined;
        },
      }
    );
  }
);
