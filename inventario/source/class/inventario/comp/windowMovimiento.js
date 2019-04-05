qx.Class.define("inventario.comp.windowMovimiento",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (appMain, rowActual)
	{
	this.base(arguments);
	
	this.set({
		caption: "Movimiento",
		width: 500,
		height: 200,
		showMinimize: false,
		showMaximize: false
	});
	
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		cboOAS.focus();
	});
	
	
	
	this.add(new qx.ui.basic.Label("Origen: "), {left: 0, top: 3});
	this.add(new qx.ui.basic.Label(rowActual.destino), {left: 55, top: 3});
	
	//var cboOAS = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Inventario", "autocompletarOAS", {organismo_area_id: appMain.rowOrganismo_area.organismo_area_id});
	var cboOAS = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Inventario", methodName: "autocompletarOAS"}, {organismo_area_id: appMain.rowOrganismo_area.organismo_area_id});
	cboOAS.setWidth(400);
	var lstOAS = cboOAS.getChildControl("list");
	
	this.add(cboOAS, {left: 50, top: 30});
	
	this.add(new qx.ui.basic.Label("Destino:"), {left: 0, top: 33});
	
	
	
	

	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (lstOAS.isSelectionEmpty()) {
			cboOAS.setInvalidMessage("Debe seleccionar un destino correcto")
			cboOAS.setValid(false);
			cboOAS.focus();
		} else if (rowActual.id_organismo_area_servicio_destino==lstOAS.getModelSelection().getItem(0)) {
			cboOAS.setInvalidMessage("Debe seleccionar destino distinto a origen");
			cboOAS.setValid(false);
			cboOAS.focus();
		} else {
			var p = {};
			p.id_bien = rowActual.id_bien;
			p.id_organismo_area_servicio_origen = rowActual.id_organismo_area_servicio_destino;
			p.id_organismo_area_servicio_destino = lstOAS.getModelSelection().getItem(0);
			p.id_oas_usuario_movimiento = appMain.rowOrganismo_area.id_oas_usuario;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
			try {
				var resultado = rpc.callSync("alta_movimiento", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}

			this.fireDataEvent("aceptado", p.id_bien);
			btnCancelar.execute();
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