sap.ui.define([
	"com/bozankaya/ZBZ_MALZEME_NAKIL/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, MessageBox, History) {
	"use strict";

	return BaseController.extend("com.bozankaya.ZBZ_MALZEME_NAKIL.controller.Login", {

		onInit: function() {

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				routeLen: 0
			});
			this.getView().setModel(oViewModel, "loginView");
		},

		onLoginBtn: function() {
			var that = this;
			var sPernr = this.getView().byId("pernr");
			var sPassword = this.getView().byId("password");
			var sPernrValue = sPernr.getValue();
			var sPasswordValue = sPassword.getValue();
			var sMessageStrip = this.getView().byId("loginWarningMsg");
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			// 				oRouter.navTo("Menu");
			if (!sPernrValue) {
				sPernr.setValueState(sap.ui.core.ValueState.Error);
				sMessageStrip.setVisible(true);
			}
			if (!sPasswordValue) {
				sPassword.setValueState(sap.ui.core.ValueState.Error);
				sMessageStrip.setVisible(true);
			}
			if (sPernrValue && sPasswordValue) {

				sPernr.setValueState(sap.ui.core.ValueState.None);
				sPassword.setValueState(sap.ui.core.ValueState.None);
				sMessageStrip.setVisible(false);

				var oViewModel = this.getView().getModel("loginView");
				oViewModel.setProperty("/busy", true);

				var oModel = that.getModelAndSetHeaders();
				var sPath = "/loginSet(Pernr='" + sPernrValue + "',Password='" + sPasswordValue + "')";
				
				this._checkPersonelYetki(sPernrValue);
				
				oModel.read(sPath, {
					success: function(oData) {
						var oDataModel = new JSONModel({
							superKul: oData.Superkul ? true : false,
							pernr: oData.Pernr,
							fullname : oData.EFullname
						});
						that.getOwnerComponent().setModel(oDataModel, "statuModel");

						if (oData.EResult === "1") {

							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("Menu");
							
							// that._checkPersonelYetki(oData.Pernr);

							oViewModel.setProperty("/busy", false);
							oViewModel.refresh(true);
						} else if (oData.EResult === "2") {
							that.showErrorMessage("loginErrorTitle", "loginError2");
							oViewModel.setProperty("/busy", false);
							oViewModel.refresh(true);

						} else if (oData.EResult === "9") {
							that.showErrorMessage("loginErrorTitle", "loginError9");
							oViewModel.setProperty("/busy", false);
							oViewModel.refresh(true);

						} else if (oData.EResult === "3") {
							that.getOwnerComponent().oNewPassword.open(that.getView(), that, oData);
							oViewModel.setProperty("/busy", false);
							oViewModel.refresh(true);
						}

					},
					error: function(oError) {
						var sErrorMessage = JSON.parse(oError.responseText).error.message.value;
						that.showErrorMessage("loginErrorTitle", sErrorMessage);
						oViewModel.setProperty("/busy", false);
						oViewModel.refresh(true);
					}
				});

			}

		},

		loginLiveChange: function(oEvent) {
			var oInputId = oEvent.getSource().getId();
			var _oInput = oEvent.getSource();

			if (oInputId.indexOf('pernr') > -1) {
				this.getView().byId("pernr").setValueState(sap.ui.core.ValueState.None);
				var val = _oInput.getValue();
				val = val.replace(/[^\d]/g, '');
				_oInput.setValue(val);
			} else if (oInputId.indexOf('password') > -1) {
				this.getView().byId("password").setValueState(sap.ui.core.ValueState.None);
			}

		},
		onPressUserDialog: function(oEvent) {
			this.getOwnerComponent().oPersonelValueHelp.open(this.getView(), this, oEvent.getSource());
		},
		_checkPersonelYetki: function (sPernr) {
			// var oModel = that.getView().getModel();
			// // var oModel = that.getModelAndSetHeaders();
			var serviceUrl = this.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["ZBZ_MALZEME_NAKIL_SRV"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			oModel.setHeaders({
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token": "Fetch"
			});
			var that = this;
			
			var oDataModel = new JSONModel();
			oDataModel.setSizeLimit(999999);

			var sPath = "/yetkiSet(Pernr='" + sPernr + "')";
			oModel.read(sPath, {
				success: function (oData) {
					oDataModel.setData(oData);
					that.getOwnerComponent().setModel(oDataModel, "Yetki");
				
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
		}

	});
});