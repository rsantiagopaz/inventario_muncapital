qx.Class.define("inventario.comp.pagePrincipal",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
		this.base(arguments);
		
		var application = qx.core.Init.getApplication();
		
/*
		var rpc = this._rpc = new qx.io.remote.Rpc("services/")
		rpc.setTimeout(10000);
		rpc.setServiceName("pediatras.Principal");
		try {
			var resultado = rpc.callSync("leer_principal");
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
*/
		
		this.setLabel('Principal');
		this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(e){
		functionActualizar();
		//tbl.focus();
	});
	
	
	var rowActual;
	var boolSuspenderActualizar = false;
	var numberformatMontoEs = new qx.util.format.NumberFormat("es").set({groupingUsed: false, maximumFractionDigits: 2, minimumFractionDigits: 2});
	
	
	var functionActualizar = function(id_bien) {
		if (! boolSuspenderActualizar) {
			tbl.setFocusedCell();
			btnModifica.setEnabled(false);
			btnMovimiento.setEnabled(false);
			btnBaja.setEnabled(false);
			btnHistorial.setEnabled(false);
			btnImprimir.setEnabled(false);
			
			var p = {};
			p.buscar = txtBuscar.getValue().trim();
			p.organismo_area_id = application.rowOrganismo_area.organismo_area_id;
			p.estado = rgpVer.getSelection()[0].getModel();
	
			var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
			try {
				var resultado = rpc.callSync("leer_bienes", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			//alert(qx.lang.Json.stringify(resultado, null, 2));
			
			tableModel.setDataAsMapArray(resultado, true);
			if (id_bien) {
				tbl.buscar("id_bien", id_bien);
			}
		}
	}
	
	
	this.add(new qx.ui.basic.Label("Filtrar:"), {left: 0, top: 3});
	
	var txtBuscar = new qx.ui.form.TextField("");
	txtBuscar.setLiveUpdate(true);
	txtBuscar.setWidth(300);
	this.add(txtBuscar, {left: 40, top: 0});
	txtBuscar.addListener("changeValue", function(e){
		functionActualizar();
	});
	
	
	var rbtAltas = new qx.ui.form.RadioButton("Altas");
	rbtAltas.setModel("1");
	this.add(rbtAltas, {left: 400, top: 3});
	var rbtBajas = new qx.ui.form.RadioButton("Bajas");
	rbtBajas.setModel("0");
	this.add(rbtBajas, {left: 450, top: 3});
	var rbtTodos = new qx.ui.form.RadioButton("Todos");
	rbtTodos.setModel("");
	this.add(rbtTodos, {left: 500, top: 3});
	
	var rgpVer = new qx.ui.form.RadioGroup(rbtAltas, rbtBajas, rbtTodos);
	rgpVer.addListener("changeSelection", function(e){
		functionActualizar();
	});
	
	
		//Tabla

		
		var tableModel = new qx.ui.table.model.Simple();
		tableModel.setColumns(["Descripción", "Tipo", "Nro.serie", "Ubicación", "Estado"], ["descrip", "tipo_bien_descrip", "nro_serie", "destino", "estado_descrip"]);
		//tableModel.setDataAsMapArray(resultado.contacto, true);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = this._tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleShowCellFocusIndicator();
		tbl.toggleStatusBarVisible();

		tbl.addListener("cellDbltap", function(e){

		});
		
		
		var tableColumnModel = tbl.getTableColumnModel();
		
		var renderer = new qx.ui.table.cellrenderer.Number();
		renderer.setNumberFormat(numberformatMontoEs);
		//tableColumnModel.setDataCellRenderer(4, renderer);

		
		
	
		//tableColumnModel.setColumnVisible(0, false);
      // Obtain the behavior object to manipulate
		var resizeBehavior = tableColumnModel.getBehavior();
		resizeBehavior.set(0, {width:"30%", minWidth:100});
		resizeBehavior.set(1, {width:"20%", minWidth:100});
		resizeBehavior.set(2, {width:"10%", minWidth:100});
		resizeBehavior.set(3, {width:"20%", minWidth:100});
		resizeBehavior.set(4, {width:"10%", minWidth:100});

		
		
		
		
		var selectionModel = tbl.getSelectionModel();
		selectionModel.addListener("changeSelection", function(){
			var bool = (! selectionModel.isSelectionEmpty());
			if (bool) {
				rowActual = tableModel.getRowData(tbl.getFocusedRow());
				
				if (rowActual.estado == "1") {
					btnModifica.setEnabled(true);
					btnMovimiento.setEnabled(true);
					btnBaja.setEnabled(application.rowOrganismo_area.perfiles["039002"]!=null);
					btnImprimir.setEnabled(true);
				} else {
					btnModifica.setEnabled(false);
					btnMovimiento.setEnabled(false);
					btnBaja.setEnabled(false);
					btnImprimir.setEnabled(false);
				}
				btnHistorial.setEnabled(application.rowOrganismo_area.perfiles["039003"]!=null);
			}
		});
		
		
		
		this.add(tbl, {left: 0, top: 27, right: 0, bottom: 30});
		
		

		
	var btnAlta = new qx.ui.form.Button("Alta");
	btnAlta.addListener("execute", function(e){
		var win = new inventario.comp.windowBien(application, "0");
		win.addListener("aceptado", function(e){
			var data = e.getData();
			boolSuspenderActualizar = true;
			txtBuscar.setValue("");
			rbtAltas.setValue(true);
			boolSuspenderActualizar = false;
			functionActualizar(data[data.length - 1]);
			tbl.focus();

			data = qx.lang.Json.stringify(data);
			window.open("services/class/comp/Impresion.php?rutina=imprimir_codigo&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=" + data);
			window.open("services/class/comp/Impresion.php?rutina=hoja_de_alta&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=" + data);
			window.open("services/class/comp/Impresion.php?rutina=hoja_de_cargo&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=" + data);
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.open();
		win.center();		
	});
	this.add(btnAlta, {left: 50, bottom: 0});
	if (application.rowOrganismo_area.id_organismo_area_servicio_destino==null) {
		btnAlta.setEnabled(false);
		dialog.Dialog.error("El servicio de bienes patrimoniales del Org/Area no está definido. No se podrán hacer altas.", function(e){
			
		});
	}
	
	
	var btnModifica = new qx.ui.form.Button("Modifica");
	btnModifica.addListener("execute", function(e){
		var win = new inventario.comp.windowModifica(application, rowActual.id_bien);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			boolSuspenderActualizar = true;
			txtBuscar.setValue("");
			boolSuspenderActualizar = false;
			functionActualizar(data);
			tbl.focus();

			window.open("services/class/comp/Impresion.php?rutina=imprimir_codigo&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=[" + data + "]");
			window.open("services/class/comp/Impresion.php?rutina=hoja_de_alta&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=[" + data + "]");
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.open();
		win.center();		
	});
	this.add(btnModifica, {left: 250, bottom: 0});
	
	
	var btnMovimiento = new qx.ui.form.Button("Movimiento");
	btnMovimiento.addListener("execute", function(e){
		var win = new inventario.comp.windowMovimiento(application, rowActual);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			functionActualizar(data);
			tbl.focus();
			
			window.open("services/class/comp/Impresion.php?rutina=hoja_de_cargo&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=[" + data + "]");
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.open();
		win.center();		
	});
	this.add(btnMovimiento, {left: 350, bottom: 0});
	
	
	var btnBaja = new qx.ui.form.Button("Baja");
	btnBaja.addListener("execute", function(e){
		var win = new inventario.comp.windowBaja(application, rowActual.id_bien);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			boolSuspenderActualizar = true;
			txtBuscar.setValue("");
			rbtBajas.setValue(true);
			boolSuspenderActualizar = false;
			functionActualizar(data);
			tbl.focus();
			
			window.open("services/class/comp/Impresion.php?rutina=hoja_de_baja&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=" + data);
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.open();
		win.center();		
	});
	this.add(btnBaja, {left: 450, bottom: 0});

	var btnImprimir = new qx.ui.form.Button("Imprimir");
	btnImprimir.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=imprimir_codigo&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=[" + rowActual.id_bien + "]");
		window.open("services/class/comp/Impresion.php?rutina=hoja_de_alta&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=[" + rowActual.id_bien + "]");
		window.open("services/class/comp/Impresion.php?rutina=hoja_de_cargo&id_oas_usuario=" + application.rowOrganismo_area.id_oas_usuario + "&id_bien=[" + rowActual.id_bien + "]");		
	});
	this.add(btnImprimir, {left: 550, bottom: 0});
	
	var btnHistorial = new qx.ui.form.Button("Historial");
	btnHistorial.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=historial&id_bien=" + rowActual.id_bien);
	});
	this.add(btnHistorial, {left: 650, bottom: 0});
	
	

	
	
	
	//tbl.setFocusedCell(0, 0, true);
	
	
	txtBuscar.setTabIndex(1);
	rbtAltas.setTabIndex(1);
	rbtBajas.setTabIndex(1);
	rbtTodos.setTabIndex(1);
	tbl.setTabIndex(1);
	btnAlta.setTabIndex(1);
	btnModifica.setTabIndex(1);
	btnMovimiento.setTabIndex(1);
	btnBaja.setTabIndex(1);
	btnImprimir.setTabIndex(1);
	btnHistorial.setTabIndex(1);
	
		
	},
	members : 
	{
		
	}
});