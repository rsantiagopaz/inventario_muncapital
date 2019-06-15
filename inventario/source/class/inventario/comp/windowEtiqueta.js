qx.Class.define("inventario.comp.windowEtiqueta",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Parámetros etiqueta",
		width: 700,
		height: 350,
		showMaximize: false,
		allowMaximize: false,
		showMinimize: false
	});
	
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtFilas.focus();
	});
	
	
	
	var application = qx.core.Init.getApplication();
	
	
	
	
	var gbxGral = new qx.ui.groupbox.GroupBox();
	gbxGral.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxGral, {left: 0, top: 0});
	
	var gbxBarra = new qx.ui.groupbox.GroupBox("código Barra");
	gbxBarra.setLayout(new qx.ui.layout.Grow());
	gbxGral.add(gbxBarra, {left: 0, top: 100});
	
	var gbxQr = new qx.ui.groupbox.GroupBox("código Qr");
	gbxQr.setLayout(new qx.ui.layout.Grow());
	gbxGral.add(gbxQr, {left: 350, top: 100});
	
	
	

	var form = new qx.ui.form.Form();
	
	var txtFilas = new qx.ui.form.Spinner();
	txtFilas.setNumberFormat(application.numberformatEntero);
	form.add(txtFilas, "Filas", null, "filas", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 3}});
	
	var txtMargenIzq = new qx.ui.form.Spinner();
	txtMargenIzq.setNumberFormat(application.numberformatMontoEn);
	txtMargenIzq.setSingleStep(0.01);
	txtMargenIzq.setPageStep(0.10);
	form.add(txtMargenIzq, "Margen izq.(mm)", null, "margen_izq", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 3}});
	
	var txtMargenSup = new qx.ui.form.Spinner();
	txtMargenSup.setNumberFormat(application.numberformatMontoEn);
	txtMargenSup.setSingleStep(0.01);
	txtMargenSup.setPageStep(0.10);
	form.add(txtMargenSup, "Margen sup.(mm)", null, "margen_sup", null, {grupo: 1, item: {row: 1, column: 5, colSpan: 3}});
	
	var txtAnchoEtiq = new qx.ui.form.Spinner();
	txtAnchoEtiq.setNumberFormat(application.numberformatMontoEn);
	txtAnchoEtiq.setSingleStep(0.01);
	txtAnchoEtiq.setPageStep(0.10);
	form.add(txtAnchoEtiq, "Ancho etiq.(mm)", null, "ancho_etiq", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 3}});
	
	var txtAltoEtiq = new qx.ui.form.Spinner();
	txtAltoEtiq.setNumberFormat(application.numberformatMontoEn);
	txtAltoEtiq.setSingleStep(0.01);
	txtAltoEtiq.setPageStep(0.10);
	form.add(txtAltoEtiq, "Alto etiq.(mm)", null, "alto_etiq", null, {grupo: 1, item: {row: 2, column: 5, colSpan: 3}});
	

	
	var txtBarraCantidad = new qx.ui.form.Spinner();
	txtBarraCantidad.setNumberFormat(application.numberformatEntero);
	form.add(txtBarraCantidad, "Columnas", null, "barra_cantidad", null, {grupo: 2, item: {row: 0, column: 1, colSpan: 3}});
	
	var txtBarraPadIzq = new qx.ui.form.Spinner();
	txtBarraPadIzq.setNumberFormat(application.numberformatMontoEn);
	txtBarraPadIzq.setSingleStep(0.01);
	txtBarraPadIzq.setPageStep(0.10);
	form.add(txtBarraPadIzq, "Pad izq.(mm)", null, "barra_pad_izq", null, {grupo: 2, item: {row: 1, column: 1, colSpan: 3}});
	
	var txtBarraPadSup = new qx.ui.form.Spinner();
	txtBarraPadSup.setNumberFormat(application.numberformatMontoEn);
	txtBarraPadSup.setSingleStep(0.01);
	txtBarraPadSup.setPageStep(0.10);
	form.add(txtBarraPadSup, "Pad sup.(mm)", null, "barra_pad_sup", null, {grupo: 2, item: {row: 1, column: 5, colSpan: 3}});
	
	var chkBarraAncho = new qx.ui.form.CheckBox("Ancho (mm):");
	chkBarraAncho.setValue(true);
	chkBarraAncho.setIconPosition("right");
	chkBarraAncho.addListener("changeValue", function(e){
		var data = e.getData();
		
		txtBarraAncho.setEnabled(data);
	});
	form.add(chkBarraAncho, null, null, "chk_barra_ancho");
	
	var txtBarraAncho = new qx.ui.form.Spinner();
	txtBarraAncho.setNumberFormat(application.numberformatMontoEn);
	txtBarraAncho.setSingleStep(0.01);
	txtBarraAncho.setPageStep(0.10);
	form.add(txtBarraAncho, "Ancho (mm)", null, "barra_ancho", null, {grupo: 2, item: {row: 2, column: 1, colSpan: 3}});
	
	var chkBarraAlto = new qx.ui.form.CheckBox("Alto (mm):");
	chkBarraAlto.setValue(true);
	chkBarraAlto.setIconPosition("right");
	chkBarraAlto.addListener("changeValue", function(e){
		var data = e.getData();
		
		txtBarraAlto.setEnabled(data);
	});
	form.add(chkBarraAlto, null, null, "chk_barra_alto");
	
	var txtBarraAlto = new qx.ui.form.Spinner();
	txtBarraAlto.setNumberFormat(application.numberformatMontoEn);
	txtBarraAlto.setSingleStep(0.01);
	txtBarraAlto.setPageStep(0.10);
	form.add(txtBarraAlto, "Alto (mm)", null, "barra_alto", null, {grupo: 2, item: {row: 2, column: 5, colSpan: 3}});
	
	

	var txtQrCantidad = new qx.ui.form.Spinner();
	txtQrCantidad.setNumberFormat(application.numberformatEntero);
	form.add(txtQrCantidad, "Columnas", null, "qr_cantidad", null, {grupo: 3, item: {row: 0, column: 1, colSpan: 3}});
	
	var txtQrPadIzq = new qx.ui.form.Spinner();
	txtQrPadIzq.setNumberFormat(application.numberformatMontoEn);
	txtQrPadIzq.setSingleStep(0.01);
	txtQrPadIzq.setPageStep(0.10);
	form.add(txtQrPadIzq, "Pad izq.(mm)", null, "qr_pad_izq", null, {grupo: 3, item: {row: 1, column: 1, colSpan: 3}});
	
	var txtQrPadSup = new qx.ui.form.Spinner();
	txtQrPadSup.setNumberFormat(application.numberformatMontoEn);
	txtQrPadSup.setSingleStep(0.01);
	txtQrPadSup.setPageStep(0.10);
	form.add(txtQrPadSup, "Pad sup.(mm)", null, "qr_pad_sup", null, {grupo: 3, item: {row: 1, column: 5, colSpan: 3}});
	
	var chkQrAncho = new qx.ui.form.CheckBox("Ancho (mm):");
	chkQrAncho.setValue(true);
	chkQrAncho.setIconPosition("right");
	chkQrAncho.addListener("changeValue", function(e){
		var data = e.getData();
		
		txtQrAncho.setEnabled(data);
	});
	form.add(chkQrAncho, null, null, "chk_qr_ancho");
	
	var txtQrAncho = new qx.ui.form.Spinner();
	txtQrAncho.setNumberFormat(application.numberformatMontoEn);
	txtQrAncho.setSingleStep(0.01);
	txtQrAncho.setPageStep(0.10);
	form.add(txtQrAncho, "Ancho (mm)", null, "qr_ancho", null, {grupo: 3, item: {row: 2, column: 1, colSpan: 3}});
	
	var chkQrAlto = new qx.ui.form.CheckBox("Alto (mm):");
	chkQrAlto.setValue(true);
	chkQrAlto.setIconPosition("right");
	chkQrAlto.addListener("changeValue", function(e){
		var data = e.getData();
		
		txtQrAlto.setEnabled(data);
	}, this);
	form.add(chkQrAlto, null, null, "chk_qr_alto");
	
	var txtQrAlto = new qx.ui.form.Spinner();
	txtQrAlto.setNumberFormat(application.numberformatMontoEn);
	txtQrAlto.setSingleStep(0.01);
	txtQrAlto.setPageStep(0.10);
	form.add(txtQrAlto, "Alto (mm)", null, "qr_alto", null, {grupo: 3, item: {row: 2, column: 5, colSpan: 3}});
	
	
	

	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	
	var formViewGral = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 10, 25, 1);
	gbxGral.add(formViewGral, {left: 0, top: 0});
	
	var formViewBarra = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 10, 25, 2);
	formViewBarra._remove(formViewBarra._getLayout().getCellWidget(2, 0));
	formViewBarra._add(chkBarraAncho, {row: 2, column: 0});
	formViewBarra._remove(formViewBarra._getLayout().getCellWidget(2, 4));
	formViewBarra._add(chkBarraAlto, {row: 2, column: 4});
	gbxBarra.add(formViewBarra);
	
	var formViewQr = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 10, 25, 3);
	formViewQr._remove(formViewQr._getLayout().getCellWidget(2, 0));
	formViewQr._add(chkQrAncho, {row: 2, column: 0});
	formViewQr._remove(formViewQr._getLayout().getCellWidget(2, 4));
	formViewQr._add(chkQrAlto, {row: 2, column: 4});
	gbxQr.add(formViewQr);
	
	
	
	
	
	var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_parametros_etiqueta");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	var aux = qx.data.marshal.Json.createModel(resultado, true);
	controllerForm.setModel(aux);
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		var p = {};
		p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
		
		//alert(qx.lang.Json.stringify(p, null, 2));
		
		var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			btnCancelar.execute();
		}, this);
		rpc.callAsyncListeners(true, "escribir_parametros_etiqueta", p);
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	
	

	chkBarraAncho.setTabIndex(9);
	chkBarraAlto.setTabIndex(11);
	
	chkQrAncho.setTabIndex(16);
	chkQrAlto.setTabIndex(18);
	
	btnAceptar.setTabIndex(22);
	btnCancelar.setTabIndex(23);
	
	
	},
	members : 
	{

	}
});