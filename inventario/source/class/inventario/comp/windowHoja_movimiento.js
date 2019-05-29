qx.Class.define("inventario.comp.windowHoja_movimiento",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowHoja_movimiento)
	{
	this.base(arguments);
	
	this.set({
		caption: "Hoja de Movimiento",
		width: 1000,
		height: 620,
		showMinimize: false,
		//showMaximize: false,
		//allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			slbTipo_movimiento.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();


	
	
	
	
	var form1 = new qx.ui.form.Form();
	
	var slbTipo_movimiento = new qx.ui.form.SelectBox();
	slbTipo_movimiento.add(new qx.ui.form.ListItem("Movimiento", null, "M"));
	slbTipo_movimiento.add(new qx.ui.form.ListItem("Baja", null, "B"));
	slbTipo_movimiento.addListener("changeSelection", function(e){
		var data = e.getData();
		
		var bandera = data[0].getModel() == "M";
		
		if (! bandera) {
			lstUni_presu.resetSelection();
		}
		
		lstUni_presu.setEnabled(bandera);
		tableModelItems.setColumnEditable(6, bandera);
		tblItems.setShowCellFocusIndicator(bandera);
		
		lstUni_presu.setValid(true);
	});
	form1.add(slbTipo_movimiento, "Tipo acción", null, "tipo_movimiento", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 4}});
	
	var lstUni_presu = new qx.ui.form.SelectBox();
	lstUni_presu.setMaxWidth(300);
	
	var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarUni_presu", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x in resultado) {
		lstUni_presu.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	form1.add(lstUni_presu, "Uni.presu.", null, "id_uni_presu", null, {grupo: 1, tabIndex: 1, item: {row: 1, column: 1, colSpan: 10}});
	
	//form1.add(lstUni_presu, null, null, "id_uni_presu");
	
	
	var txtExpte_autoriza = new qx.ui.form.TextField("");
	txtExpte_autoriza.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtExpte_autoriza, "Expte.autoriza", null, "expte_autoriza", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 5}});
	

	
	var controllerForm1 = new qx.data.controller.Form(null, form1);
	
	//var formView1 = new qx.ui.form.renderer.Single(form1);
	var formView1 = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 10, 25, 1);
	this.add(formView1, {left: 0, top: 0});
	
	

	
	
	var gbxBuscar = new qx.ui.groupbox.GroupBox("Buscar");
	gbxBuscar.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxBuscar, {left: 0, top: 90, right: 0, bottom: "50%"});
	
	
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setLiveUpdate(true);
	txtDescrip.addListener("changeValue", function(e){
		var texto = e.getData().trim();
		
		var timer = qx.util.TimerManager.getInstance();
		// check for the old listener
		if (this.timerId != null) {
			// stop the old one
			timer.stop(this.timerId);
			if (this.rpc != null) this.rpc.abort(this.opaqueCallRef);
			this.timerId = null;
		}
		
		this.timerId = timer.start(function(userData, timerId) {
			if (texto.length < 1) {
				tableModelBuscar.setDataAsMapArray([], true);
			} else if (texto.length >= 1) {
				var p = {};
				p.texto = texto;
				
				this.rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
				this.rpc.addListener("completed", qx.lang.Function.bind(function(e){
					var data = e.getData();

					tableModelBuscar.setDataAsMapArray(data.result, true);
					
					this.timerId = null;
					this.rpc = null;
				}, this));
	
				this.opaqueCallRef = this.rpc.callAsyncListeners(true, "leer_bienes", p);
			}
		}, null, this, null, 200);
	});
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});

	gbxBuscar.add(new qx.ui.basic.Label("Texto:"), {left: 0, top: 3});
	gbxBuscar.add(txtDescrip, {left: 40, top: 0});
	

	
	
	
	

	
	
	var menuBuscar = new componente.comp.ui.ramon.menu.Menu();
	
	var btnSeleccionar = new qx.ui.menu.Button("Seleccionar");
	btnSeleccionar.setEnabled(false);
	btnSeleccionar.addListener("execute", function(e){
		var focusedRow = tblBuscar.getFocusedRow();
		var rowData = tableModelBuscar.getRowDataAsMap(focusedRow);
		
		if (tblItems.buscar("id_bien", rowData.id_bien, true, 6)) {
			
		} else {
			rowData = qx.lang.Json.parse(qx.lang.Json.stringify(rowData));
			rowData.guarda_custodia = "";
			
			//alert(qx.lang.Json.stringify(rowData, null, 2));
			
			tableModelItems.addRowsAsMapArray([rowData], null, true);

			var rowCount = tableModelItems.getRowCount();
			tblItems.setFocusedCell(6, rowCount - 1, true);
		}
	});
	menuBuscar.add(btnSeleccionar);
	menuBuscar.memorizar();
	
	
	
	
	//Tabla

	var tableModelBuscar = new qx.ui.table.model.Simple();
	tableModelBuscar.setColumns(["Descripción", "Tipo bien", "Uni.presu.", "Cod.barra", "Nro.serie", "Cod.QR", "Guarda custodia"], ["descrip", "tipo_bien_descrip", "uni_presu_descrip", "id_bien", "nro_serie", "codigo_qr", "guarda_custodia"]);
	tableModelBuscar.setColumnSortable(0, false);
	tableModelBuscar.setColumnSortable(1, false);
	tableModelBuscar.setColumnSortable(2, false);
	tableModelBuscar.addListener("dataChanged", function(e){
		var rowCount = tableModelBuscar.getRowCount();
		
		tblBuscar.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});	

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblBuscar = new componente.comp.ui.ramon.table.Table(tableModelBuscar, custom);
	tblBuscar.setHeight(200);
	//tblTotales.toggleShowCellFocusIndicator();
	tblBuscar.setShowCellFocusIndicator(false);
	tblBuscar.toggleColumnVisibilityButtonVisible();
	//tblBuscar.toggleStatusBarVisible();
	tblBuscar.setContextMenu(menuBuscar);
	tblBuscar.addListener("cellDbltap", function(e){
		btnSeleccionar.execute();
	});
	
	var tableColumnModelBuscar = tblBuscar.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatEnteroEs);
	//tableColumnModelBuscar.setDataCellRenderer(2, cellrendererNumber);
	
	var resizeBehaviorBuscar = tableColumnModelBuscar.getBehavior();
	//resizeBehaviorBuscar.set(0, {width:"65%", minWidth:100});
	//resizeBehaviorBuscar.set(1, {width:"25%", minWidth:100});
	//resizeBehaviorBuscar.set(2, {width:"10%", minWidth:100});
	
	var selectionModelBuscar = tblBuscar.getSelectionModel();
	selectionModelBuscar.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelBuscar.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelBuscar.isSelectionEmpty();
		btnSeleccionar.setEnabled(! selectionEmpty);
		menuBuscar.memorizar([btnSeleccionar]);
	});

	gbxBuscar.add(tblBuscar, {left: 0, top: 30, right: 0, bottom: 0});
	
	

	
	
	
	
	
	
	
	
	
	var gbxItems = new qx.ui.groupbox.GroupBox("Items");
	gbxItems.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxItems, {left: 0, top: "55%", right: 0, bottom: 50});
	
	

	
	var menuItems = new componente.comp.ui.ramon.menu.Menu();
	
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tblItems.setFocusedCell(6, tblItems.getFocusedRow(), true);
		tblItems.startEditing();
	});
	
	
	var btnEditar = new qx.ui.menu.Button("Editar", null, commandEditar);
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		var focusedRow = tblItems.getFocusedRow();
		var rowData = tableModelItems.getRowDataAsMap(focusedRow);
		
		tblItems.blur();
		
		tableModelItems.removeRows(focusedRow, 1);
		
		var rowCount = tableModelItems.getRowCount();
		focusedRow = (focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow;
		tblItems.setFocusedCell(6, focusedRow, true);
		tblItems.focus();
	});
	menuItems.add(btnEditar);
	menuItems.addSeparator();
	menuItems.add(btnEliminar);
	menuItems.memorizar();
	
	
	
	
	//Tabla

	var tableModelItems = new qx.ui.table.model.Simple();
	tableModelItems.setColumns(["Descripción", "Tipo bien", "Uni.presu.", "Cod.barra", "Nro.serie", "Cod.QR", "Guarda custodia"], ["descrip", "tipo_bien_descrip", "uni_presu_descrip", "id_bien", "nro_serie", "codigo_qr", "guarda_custodia"]);
	tableModelItems.setColumnSortable(0, false);
	tableModelItems.setColumnSortable(1, false);
	tableModelItems.setColumnSortable(2, false);
	
	tableModelItems.setColumnEditable(6, true);
	tableModelItems.addListener("dataChanged", function(e){
		var rowCount = tableModelItems.getRowCount();
		
		tblItems.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});	

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblItems = new componente.comp.ui.ramon.table.Table(tableModelItems, custom);
	tblItems.setHeight(200);
	//tblTotales.toggleShowCellFocusIndicator();
	tblItems.setShowCellFocusIndicator(true);
	tblItems.toggleColumnVisibilityButtonVisible();
	//tblItems.toggleStatusBarVisible();
	tblItems.setContextMenu(menuItems);
	tblItems.edicion = "edicion_vertical";
	tblItems.addListener("cellDbltap", function(e){
		commandEditar.execute();
	});
	tblItems.addListener("dataEdited", function(e){
		var data = e.getData();
		
		tableModelItems.setValueById("guarda_custodia", data.row, data.value.trim());
	});
	
	var tableColumnModelItems = tblItems.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatEnteroEs);
	//tableColumnModelItems.setDataCellRenderer(2, cellrendererNumber);
	
	var resizeBehaviorItems = tableColumnModelItems.getBehavior();
	//resizeBehaviorItems.set(0, {width:"65%", minWidth:100});
	//resizeBehaviorItems.set(1, {width:"25%", minWidth:100});
	//resizeBehaviorItems.set(2, {width:"10%", minWidth:100});
	
	var selectionModelItems = tblItems.getSelectionModel();
	selectionModelItems.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelItems.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelItems.isSelectionEmpty();
		
		commandEditar.setEnabled(! selectionEmpty);
		btnEliminar.setEnabled(! selectionEmpty);
		
		menuItems.memorizar([commandEditar, btnEliminar]);
	});

	gbxItems.add(tblItems, {left: 0, top: 0, right: 0, bottom: 0});

	
	
	
	
	
	
	
	if (rowHoja_movimiento) {
		var p = rowHoja_movimiento;
		
		var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			lstUni_presu.add(new qx.ui.form.ListItem(data.result.uni_presu.label, null, data.result.uni_presu.model));
			//lstProveedor.add(new qx.ui.form.ListItem(data.result.proveedor.label, null, data.result.proveedor.model));
			
			tableModelBuscar.setDataAsMapArray(data.result.hoja_cargo_item, true);
			
			data.result.hoja_cargo.uni_presu = "";
			data.result.hoja_cargo.proveedor = "";
			var aux = qx.data.marshal.Json.createModel(data.result.hoja_cargo, true);
			
			controllerForm1.setModel(aux);
			
			lstUni_presu.focus();
		}, this);
		rpc.callAsyncListeners(true, "leer_hoja_cargo", p);
	} else {
		var aux = qx.data.marshal.Json.createModel({tipo_movimiento: "M", id_uni_presu: null, uni_presu: "", expte_autoriza: ""}, true);
				
		controllerForm1.setModel(aux);
	}
	
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		lstUni_presu.setValid(true);
		tblBuscar.setValid(true);
		
		var bandera = true;
		
		if (slbTipo_movimiento.getSelection()[0].getModel() == "M" && lstUni_presu.isSelectionEmpty()) {
			
			bandera = false;
			
			lstUni_presu.setValid(false);
			lstUni_presu.focus();
			
			sharedErrorTooltip.setLabel("Debe seleccionar unidad presupuestaria");
			sharedErrorTooltip.placeToWidget(lstUni_presu);
			sharedErrorTooltip.show();
		} else if (tableModelItems.getRowCount() == 0) {
			
			bandera = false;
			
			tblItems.setValid(false);
			txtDescrip.focus();
			
			sharedErrorTooltip.setLabel("Debe agregar algun item");
			sharedErrorTooltip.placeToWidget(tblItems);
			sharedErrorTooltip.show();
		} else {
			if (slbTipo_movimiento.getSelection()[0].getModel() == "M") {
				var data = tableModelItems.getDataAsMapArray();
				
				for (var x = 0; x <= data.length - 1; x++) {
					if (data[x].guarda_custodia == "") {
						bandera = false;
						tblItems.setFocusedCell(6, x, true);
						
						tblItems.setValid(false);
						tblItems.focus();
			
						sharedErrorTooltip.setLabel("Debe ingresar guarda custodia");
						sharedErrorTooltip.placeToWidget(tblItems);
						sharedErrorTooltip.show();
						
						break;
					}
				}
			}
		}
		
		if (bandera) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm1.getModel());
			p.hoja_movimiento_item = tableModelItems.getDataAsMapArray();
			
			if (slbTipo_movimiento.getSelection()[0].getModel() == "B") p.model.id_uni_presu = null;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
							
			var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				btnCancelar.execute();
				
				this.fireDataEvent("aceptado", data.result);
			}, this);
			rpc.callAsyncListeners(true, "escribir_hoja_movimiento", p);
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	
	

	tblBuscar.setTabIndex(15);
	btnAceptar.setTabIndex(16);
	btnCancelar.setTabIndex(17);
	
	
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});