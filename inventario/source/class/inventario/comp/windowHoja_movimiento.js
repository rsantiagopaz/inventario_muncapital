qx.Class.define("inventario.comp.windowHoja_movimiento",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowHoja_movimiento)
	{
	this.base(arguments);
	
	this.set({
		caption: "Hoja de Movimiento",
		width: 900,
		height: 700,
		showMinimize: false,
		//showMaximize: false,
		//allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			cboUni_presu.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();


	
	
	
	
	var form1 = new qx.ui.form.Form();
	
	var cboUni_presu = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarUni_presu"});
	cboUni_presu.setRequired(true);
	var lstUni_presu = cboUni_presu.getChildControl("list");
	
	form1.add(cboUni_presu, "Uni.presu.", function(value) {
		if (lstUni_presu.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar unidad presupuestaria");
	}, "uni_presu", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 10}});
	
	form1.add(lstUni_presu, null, null, "id_uni_presu");
	
	
	var txtExpte_autoriza = new qx.ui.form.TextField("");
	txtExpte_autoriza.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtExpte_autoriza, "Expte.autoriza", null, "expte_autoriza", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 5}});
	

	
	var controllerForm1 = new qx.data.controller.Form(null, form1);
	
	//var formView1 = new qx.ui.form.renderer.Single(form1);
	var formView1 = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 10, 25, 1);
	this.add(formView1, {left: 0, top: 0});
	
	

	
	
	var gbxBuscar = new qx.ui.groupbox.GroupBox("Buscar");
	gbxBuscar.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxBuscar, {left: 0, top: 70, right: 0, bottom: "55%"});
	
	
	
	var form2 = new qx.ui.form.Form();
	
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
			if (texto.length < 3) {
				tableModelBuscar.setDataAsMapArray([], true);
			} else if (texto.length >= 3) {
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
	form2.add(txtDescrip, "Texto", null, "descrip", null, {grupo: 1, tabIndex: 11, item: {row: 0, column: 1, colSpan: 10}});
	
	

	var btnBuscar = new qx.ui.form.Button("Buscar");
	btnBuscar.addListener("execute", function(e){
		var p = {};
		p.texto = txtDescrip.getValue();
		
		var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModelBuscar.setDataAsMapArray(data.result, true);
			
		}, this);
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
			
		}, this);
		rpc.callAsyncListeners(true, "leer_bienes", p);
	});
	//form2.addButton(btnBuscar, {grupo: 1, item: {row: 0, column: 11, colSpan: 3}});
	
	
	var formView2 = new componente.comp.ui.ramon.abstractrenderer.Grid(form2, 3, 25, 1);
	gbxBuscar.add(formView2);
	
	
	
	

	
	
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

	gbxBuscar.add(tblBuscar, {left: 0, top: 40, right: 0, bottom: 0});
	
	

	
	
	
	
	
	
	
	
	
	var gbxItems = new qx.ui.groupbox.GroupBox("Items");
	gbxItems.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxItems, {left: 0, top: "50%", right: 0, bottom: 50});
	
	

	
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
			
			cboUni_presu.focus();
		}, this);
		rpc.callAsyncListeners(true, "leer_hoja_cargo", p);
	} else {
		var aux = qx.data.marshal.Json.createModel({id_hoja_movimiento: "0", id_uni_presu: null, uni_presu: "", expte_autoriza: ""}, true);
				
		controllerForm1.setModel(aux);
	}
	
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		tblBuscar.setValid(true);
		
		if (form1.validate()) {
			if (tableModelItems.getRowCount() == 0) {
				tblItems.setValid(false);
				txtDescrip.focus();
				
				sharedErrorTooltip.setLabel("Debe agregar algun item");
				sharedErrorTooltip.placeToWidget(tblItems);
				sharedErrorTooltip.show();
			} else {
				
				var p = {};
				p.model = qx.util.Serializer.toNativeObject(controllerForm1.getModel());
				p.hoja_movimiento_item = tableModelItems.getDataAsMapArray();
				
				//alert(qx.lang.Json.stringify(p, null, 2));
								
				var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					btnCancelar.execute();
					
					this.fireDataEvent("aceptado", data.result);
				}, this);
				rpc.callAsyncListeners(true, "escribir_hoja_movimiento", p);
			}
		} else {
			form1.getValidationManager().getInvalidFormItems()[0].focus();
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