qx.Class.define("inventario.comp.windowBaja",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (appMain, id_bien)
	{
	this.base(arguments);
	
	this.set({
		caption: "Baja de bien",
		width: 450,
		height: 220,
		showMinimize: false,
		showMaximize: false
	});
	
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		slbTipo_baja.focus();
	});
	
	
	
	var model;
	
	var form = new qx.ui.form.Form();
	
	var slbTipo_baja = new qx.ui.form.SelectBox();
	slbTipo_baja.setRequired(true);
	slbTipo_baja.setWidth(300);
	form.add(slbTipo_baja, "Tipo baja", null, "id_tipo_baja");
	
	var txtObserva_baja = new qx.ui.form.TextArea("");
	form.add(txtObserva_baja, "Observaciones", null, "observa_baja");

	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0})
	
	

	
	var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
	try {
		var resultado = rpc.callSync("leer_parametros_inicio");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x in resultado.tipo_baja) {
		slbTipo_baja.add(new qx.ui.form.ListItem(resultado.tipo_baja[x].descrip, null, resultado.tipo_baja[x].id_tipo_baja));
	}
	
	
	var controller = new qx.data.controller.Form(null, form);
	
	
	
	var p = {};
	p.id_bien = id_bien;
	var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
	try {
		var resultado = rpc.callSync("leer_bien", p);
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	model = qx.data.marshal.Json.createModel(resultado.model);
	controller.setModel(model);

	

	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(model);
			p.model.id_oas_usuario_baja = appMain.rowOrganismo_area.id_oas_usuario;
			p.model.estado = 0;
			
			delete p.model.fecha_baja;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
			try {
				var resultado = rpc.callSync("baja_bien", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			this.fireDataEvent("aceptado", p.model.id_bien);
			btnCancelar.execute();
		} else {
			var items = form.getItems();
			for (var item in items) {
				if (!items[item].isValid()) {
					items[item].focus();
					break;
				}
			}
		}
	}, this);
	this.add(btnAceptar, {left: 100, bottom: 0});
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	this.add(btnCancelar, {left: 200, bottom: 0});


	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});