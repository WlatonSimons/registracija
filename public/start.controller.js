sap.ui.define( ["sap/ui/core/mvc/Controller",
				"sap/m/MessageToast",
				'sap/ui/model/json/JSONModel',
				'sap/ui/core/format/DateFormat',
				'sap/ui/core/Fragment'], 

function (Controller, MessageToast, JSONModel, DateFormat, Fragment) {
	"use strict";
	return Controller.extend("Slowstart.start", {
		oFormatYyyymmdd: null,
		onInit: function() {
			this.oFormatYyyymmdd = DateFormat.getInstance({style: "short", pattern : "yyyy-MM-dd"});

			var oModel = new JSONModel();
			oModel.setData({
				minDate: new Date(),
				maxDate: new Date(new Date().getFullYear(), 11, 31)
			});
			this.getView().setModel(oModel);
		},

		table: function (){
			var oTable = this.byId("ins");
			
			if(oTable.$().is(':visible')==true){
				oTable.setVisible(false);
			}else{
				function return_first(){
					var tmp = null;
					$.ajax({
						'async': false,
						'type': "POST",
						'global': false,
						'dataType': 'html',
						 url: "./table",
						'data': { 'request': "", 'target': 'arrange_url', 'method': 'method_target' },
						'success': function (data) {
							tmp = data;
						}
					});
					return tmp;
				};
	
				
				this._data = JSON.parse(return_first());
				this.jModel = new sap.ui.model.json.JSONModel();
				this.jModel.setData(this._data);
				this.byId('ins').setModel(this.jModel);	
				oTable.setVisible(true);
			}
		},


		handleSendDate : function () {
			var oName = this.byId("name");
			var oLname = this.byId("lname");
			var oDate = this.byId("selectedDate");
			var oTime = this.byId("T1");

			if(oName.getValue()==""||oLname.getValue()==""||oDate.getText()=="-"||oTime.getText()=="-"){
				MessageToast.show("Neužpildyta registracijos forma");
			}else{
				$.ajax({
					type: "POST",
					url: "./register",
					data: {name: oName.getValue(),lname: oLname.getValue(), date: oDate.getText(), time: oTime.getText()}
				}).done(function(data,status, jqxhr){
					if(data=="Registracija baigta"){
						MessageToast.show("Registracija sekminga");
						window.location.replace("http://localhost:8080"); 
					}else{
						MessageToast.show(data);
					}
				});
			}


		},
		registerDirect : function () {
			window.location.replace("http://localhost:8080/register");
		},
		handleCalendarSelect: function(oEvent) {
			var oCalendar = oEvent.getSource();
			var s = oCalendar.getSelectedDates();
			if (s.length > 0) {
				var h = s[0].getStartDate().getDay();
				if (h === 6 || h === 0) {
					sap.m.MessageToast.show('Išeiginėmis nedirbame');
					return;
				}else{
					var oText = this.byId("selectedDate"),
					oDate = s[0].getStartDate();
					oText.setText(this.oFormatYyyymmdd.format(oDate));
				}
			}
		},
		validateKey: function(oEvent){

		var box = oEvent.getSource();
		var text = box.getValue();

			if (window.event) {
				text = text.replace(/[^A-Za-z]/, "");
				box.setValue(text);
			}
		},
		onExit : function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
		handleOpenDialog: function () {
			// create popover
			if (!this._oDialog) {
				Fragment.load({
					id: "fragment",
					name: "Slowstart.TimePickerSlidersDialog",
					controller: this
				}).then(function(oDialog){
					this._oDialog = oDialog;
					this.getView().addDependent(this._oDialog);
					this._oDialog.attachAfterOpen(function () {
						var oTP = Fragment.byId("fragment", "TPS2");

						this._sOldValue = oTP.getValue();
					}.bind(this));
					this._oDialog.open();
				}.bind(this));
			} else {
				this._oDialog.open();
			}
		},
		handleOKPress: function () {
			var oText = this.byId("T1"),
				oTP = Fragment.byId("fragment", "TPS2");
			this._oDialog.close();
			oText.setText(oTP.getValue());
		},
		handleCancelPress: function () {
			var oTP = Fragment.byId("fragment", "TPS2");
			oTP.setValue(this._sOldValue);
			this._oDialog.close();
		},
	});
});