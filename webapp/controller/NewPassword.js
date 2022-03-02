sap.ui.define(
  [
    "com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend(
      "com.bozankaya.ZBZ_MALZEME_NAKIL.controller.NewPassword",
      {
        _getDialog: function () {
          if (!this.oNewPassword) {
            this.oNewPassword = sap.ui.xmlfragment(
              "com.bozankaya.ZBZ_MALZEME_NAKIL.view.fragments.NewPassword",
              this
            );
          }
          return this.oNewPassword;
        },
        open: function (oView, oController, aData) {
          var oDialog = this._getDialog();
          this.oView = oView;
          this.oController = oController;
          this.aData = aData;
          jQuery.sap.syncStyleClass(
            this.getOwnerComponent().getContentDensityClass(),
            oView,
            oDialog
          );
          oController.getView().addDependent(oDialog);
          oDialog.open();
        },
        onCloseNewPassDialog: function () {
          this._getDialog().close();
        },
        onDialogAfterClose: function () {
          this.oNewPassword.destroy();
          this.oNewPassword = undefined;
        },
        onSaveNewPass: function () {
          var that = this;
          var currrentPass = sap.ui.getCore().byId("currentPass").getValue();
          var newPass1Value = sap.ui.getCore().byId("newPass1").getValue();
          var newPass2Value = sap.ui.getCore().byId("newPass2").getValue();
          var sErrMsg = "";

          if (!newPass1Value || !newPass2Value || !currrentPass) {
            sErrMsg = this.getView()
              .getModel("i18n")
              .getResourceBundle()
              .getText("fillPassValues");
            sap.ui.getCore().byId("newPassWarningMsg").setText(sErrMsg);
            sap.ui.getCore().byId("newPassWarningMsg").setVisible(true);
            return;
          }

          if (currrentPass !== this.aData.Password) {
            sErrMsg = this.getView()
              .getModel("i18n")
              .getResourceBundle()
              .getText("checkCurrPass");
            sap.ui.getCore().byId("newPassWarningMsg").setText(sErrMsg);
            sap.ui.getCore().byId("newPassWarningMsg").setVisible(true);
            return;
          }

          if (newPass1Value !== newPass2Value) {
            sErrMsg = this.getView()
              .getModel("i18n")
              .getResourceBundle()
              .getText("nePassValues");
            sap.ui.getCore().byId("newPassWarningMsg").setText(sErrMsg);
            sap.ui.getCore().byId("newPassWarningMsg").setVisible(true);
            return;
          }

          var oModel = that.getModelAndSetHeaders("mainService");
          var sPernr = this.oView.byId("pernr").getValue();
          var oArray = {};
          oArray.Pernr = sPernr;
          oArray.Password = newPass1Value;
          oArray.Oldpassword = currrentPass;

          oModel.create("/loginSet", oArray, {
            success: function (oData) {
              that.showSuccessMessage("successDataTitle", "succsUpdatedPass");
            },
            error: function (oError) {
              var sErrorMessage = JSON.parse(oError.responseText).error.message
                .value;
              that.showErrorMessage("loginErrorTitle", sErrorMessage);
            },
          });
          this.onDialogAfterClose();
          // this._clearDialog();
          this._getDialog().close();
        },

        _clearDialog: function () {
          sap.ui.getCore().byId("currentPass").setValue("");
          sap.ui.getCore().byId("newPass1").setValue("");
          sap.ui.getCore().byId("newPass2").setValue("");
          sap.ui.getCore().byId("newPassWarningMsg").setVisible(false);
        },

        onSelectShowPassSel: function (oEvent) {
          var bSelected = oEvent.getParameters("selected");
          if (bSelected.selected) {
            sap.ui.getCore().byId("currentPass").setType(sap.m.InputType.Text);
            sap.ui.getCore().byId("newPass1").setType(sap.m.InputType.Text);
            sap.ui.getCore().byId("newPass2").setType(sap.m.InputType.Text);
            return;
          }
          sap.ui
            .getCore()
            .byId("currentPass")
            .setType(sap.m.InputType.Password);
          sap.ui.getCore().byId("newPass1").setType(sap.m.InputType.Password);
          sap.ui.getCore().byId("newPass2").setType(sap.m.InputType.Password);
        },
      }
    );
  }
);
