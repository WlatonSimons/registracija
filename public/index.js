sap.ui.define(["sap/ui/core/mvc/XMLView"], 

function (XMLView) {
	"use strict";

	if(window.location.pathname == "/"){
		XMLView.create({viewName: "Slowstart.app"}).then(function (oView) {
			oView.placeAt("content");
		});
	}else if(window.location.pathname == "/register"){
		XMLView.create({viewName: "Slowstart.app2"}).then(function (oView) {
			oView.placeAt("content");
		});
	}
});
