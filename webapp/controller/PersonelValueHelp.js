sap.ui.define(
  [
    "com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend(
      "com.bozankaya.ZBZ_MALZEME_NAKIL.controller.PersonelValueHelp",
      {
        open: function (oView, oController, pSource) {
          var oDialog = this._getDialog();
          this.oView = oView;
          this.oController = oController;
          this.Input = pSource;
          jQuery.sap.syncStyleClass(
            this.getOwnerComponent().getContentDensityClass(),
            oView,
            oDialog
          );

          oController.getView().addDependent(oDialog);
          oDialog.open();
        },

        _getDialog: function () {
          if (!this.oPersonelValueHelp) {
            this.oPersonelValueHelp = sap.ui.xmlfragment(
              "com.bozankaya.ZBZ_MALZEME_NAKIL.view.fragments.PersonelValueHelp",
              this
            );
          }
          return this.oPersonelValueHelp;
        },
        onCloseDialog: function () {
          this._getDialog().close();
        },
        onDialogAfterClose: function () {
          this.oPersonelValueHelp.destroy();
          this.oPersonelValueHelp = undefined;
        },

        onPersonelItemSelect: function (oEvent) {
          var that = this;
          var oItem = oEvent.getSource();
          var oObject = oItem.getBindingContext().getObject();
          oObject.Pernr = that.parseToInt(oObject.Pernr);

          if (this.Input) {
            //Login ekranından çağrılıyor
            this.Input.setValue(oObject.Pernr);
            this.Input.setValueState(sap.ui.core.ValueState.None);
          } else {
            //Create ticket ekranından çağrılıyor
            sap.ui.getCore().byId("talepEdenPernr").setValue(oObject.Pernr);
            sap.ui
              .getCore()
              .byId("talepEdenPernr")
              .setValueState(sap.ui.core.ValueState.None);
            sap.ui.getCore().byId("talepEdenEname").setText(oObject.Ename);
          }

          this._getDialog().close();
        },
        onPersonelTableSearch: function (oEvent) {
          var sQuery = oEvent.getParameter("query");
          if (sQuery) {
            var oFilter = new Filter(
              [
                new Filter("Pernr", FilterOperator.EQ, sQuery),
                new Filter("Ename", FilterOperator.Contains, sQuery),
              ],
              true
            );
          }

          // if (sQuery) {
          // 	var oFilter = [];
          // 	oFilter.push(new Filter("Pernr", FilterOperator.EQ, sQuery));
          // 	oFilter.push(new Filter("Ename", FilterOperator.Contains, sQuery));
          // }
          var oTable = sap.ui.getCore().byId("personelVHTable");
          oTable.getBinding("items").filter(oFilter, "Application");
          // oEvent.getSource().getParent().getParent().getBinding("items").filter(oFilter, "Application");
        },
      }
    );
  }
);
