qx.Class.define("inventario.comp.windowUni_presu",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (caption, icon)
	{
	this.base(arguments);
	
	this.set({
		width: 350,
		height: 250,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListener("appear", function(e){
		txtDescrip.focus();
		txtDescrip.selectAllText();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	
	
	
	var form = new qx.ui.form.Form();
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.setMinWidth(200);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtDescrip, "Descripción", null, "descrip");
	
	var txtRazon = new qx.ui.form.TextField("");
	txtRazon.setMinWidth(200);
	txtRazon.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtRazon, "Jefe unidad", null, "jefe_unidad");
	
	
	
	var controllerForm = this.controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	

	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
	
				this.fireDataEvent("aceptado", data.result);
				btnCancelar.execute();
			}, this);
			
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				if (data.message == "descrip") {
					txtDescrip.setInvalidMessage("Descripción duplicada");
					txtDescrip.setValid(false);
					txtDescrip.focus();
				}
			}, this);
			
			rpc.callAsyncListeners(true, "alta_modifica_uni_presu", p);
			
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		txtDescrip.setValid(true);
		
		this.close();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},
	members : 
	{
		open : function(rowData)
		{
			var aux;
			
			if (rowData == null) {
				this.setCaption("Nueva unidad presupuestaria");
		
				aux = qx.data.marshal.Json.createModel({id_uni_presu: "0", descrip: "", jefe_unidad: ""}, true);
				
				this.controllerForm.setModel(aux);
			
				this.show();
				this.setActive(true);
				this.focus();
			} else {
				this.setCaption("Modificar unidad presupuestaria");
				
				var p = rowData;
				
				var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
				rpc.addListener("completed", function(e){
					var data = e.getData();

					aux = qx.data.marshal.Json.createModel(data.result, true);
					
					this.controllerForm.setModel(aux);

					this.show();
					this.setActive(true);
					this.focus();
				}, this);
				
				rpc.callAsyncListeners(true, "leer_uni_presu", p);
			}

		}
	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});