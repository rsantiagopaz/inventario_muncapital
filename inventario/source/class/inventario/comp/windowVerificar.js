qx.Class.define("inventario.comp.windowVerificar",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowHoja_cargo)
	{
	this.base(arguments);
	
	this.set({
		caption: "Verificar",
		width: 700,
		height: 500,
		showMinimize: false,
		showMaximize: true,
		allowMaximize: true,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			txtGuarda_custodia.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();


	
	
	var form1 = new qx.ui.form.Form();
	
	var txtGuarda_custodia = new qx.ui.form.TextField("");
	txtGuarda_custodia.setRequired(true);
	txtGuarda_custodia.setMinWidth(200);
	txtGuarda_custodia.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtGuarda_custodia, "Guarda custodia", null, "guarda_custodia", null, {grupo: 1, tabIndex: 1, item: {row: 3, column: 1, colSpan: 5}});
	
	/*
	var txtExpte_autoriza = new qx.ui.form.TextField("");
	txtExpte_autoriza.setWidth(200);
	txtExpte_autoriza.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtExpte_autoriza, "Expte.autoriza", null, "expte_autoriza", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 5}});
	*/
	
	
	var controllerForm1 = new qx.data.controller.Form(null, form1);
	
	var formView1 = new qx.ui.form.renderer.Single(form1);
	//var formView1 = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 10, 25, 1);
	this.add(formView1, {left: 0, top: 0});
	
	

	
	
	var gbx = new qx.ui.groupbox.GroupBox("Items");
	gbx.setLayout(new qx.ui.layout.Grow());
	this.add(gbx, {left: 0, top: 60, right: 0, bottom: 60});
	
	
	
	
	
	
	var menuItems = new componente.comp.ui.ramon.menu.Menu();
	
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tblSal.setFocusedCell(2, tblSal.getFocusedRow(), true);
		tblSal.startEditing();
	});
	
	
	var btnEditar = new qx.ui.menu.Button("Editar", null, commandEditar);
	
	menuItems.add(btnEditar);
	menuItems.memorizar();
	
	
	
	
	//Tabla

	var tableModelSal = new qx.ui.table.model.Simple();
	tableModelSal.setColumns(["Descripción", "Tipo bien", "Nro.serie"], ["hoja_cargo_item_descrip", "tipo_bien_descrip", "nro_serie"]);
	tableModelSal.setColumnSortable(0, false);
	tableModelSal.setColumnSortable(1, false);
	tableModelSal.setColumnSortable(2, false);
	
	tableModelSal.setColumnEditable(2, true);
	tableModelSal.addListener("dataChanged", function(e){
		var rowCount = tableModelSal.getRowCount();
		
		tblSal.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});	

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSal = new componente.comp.ui.ramon.table.Table(tableModelSal, custom);
	tblSal.setHeight(300);
	tblSal.setShowCellFocusIndicator(true);
	tblSal.toggleColumnVisibilityButtonVisible();
	//tblSal.toggleStatusBarVisible();
	tblSal.setContextMenu(menuItems);
	tblSal.edicion = "edicion_vertical";
	tblSal.addListener("cellDbltap", function(e){
		commandEditar.execute();
	});
	tblSal.addListener("dataEdited", function(e){
		var data = e.getData();
		
		tableModelSal.setValueById("nro_serie", data.row, data.value.trim());
	});
	
	var tableColumnModelSal = tblSal.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatEnteroEs);
	//tableColumnModelSal.setDataCellRenderer(2, cellrendererNumber);
	
	var resizeBehavior = tableColumnModelSal.getBehavior();
	//resizeBehavior.set(0, {width:"65%", minWidth:100});
	//resizeBehavior.set(1, {width:"25%", minWidth:100});
	//resizeBehavior.set(2, {width:"10%", minWidth:100});
	
	var selectionModelSal = tblSal.getSelectionModel();
	selectionModelSal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSal.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelSal.isSelectionEmpty();
		commandEditar.setEnabled(! selectionEmpty);
		menuItems.memorizar([commandEditar]);
	});

	gbx.add(tblSal);
	
	
	
	
	
	
	
	var p = rowHoja_cargo;
	
	var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
	rpc.addListener("completed", function(e){
		var data = e.getData();
		
		//alert(qx.lang.Json.stringify(data, null, 2));
		
		tableModelSal.setDataAsMapArray(data.result, true);
		tblSal.setFocusedCell(2, 0, true);
		
	}, this);
	rpc.callAsyncListeners(true, "leer_hoja_cargo_item", p);

	
	var aux = qx.data.marshal.Json.createModel({guarda_custodia: "", expte_autoriza: ""}, true);
				
	controllerForm1.setModel(aux);
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		tblSal.setValid(true);
		
		if (form1.validate()) {
			var bandera = true;
			
			var data = tableModelSal.getDataAsMapArray();
			
			for (var x = 0; x <= data.length - 1; x++) {
				if (data[x].nro_serie == "") {
					bandera = false;
					tblSal.setFocusedCell(2, x, true);
					
					tblSal.setValid(false);
					tblSal.focus();
		
					sharedErrorTooltip.setLabel("Debe ingresar nro.serie");
					sharedErrorTooltip.placeToWidget(tblSal);
					sharedErrorTooltip.show();
					
					break;
				}
			}
			
			
			if (bandera) {
				var p = {};
				p.hoja_cargo = rowHoja_cargo;
				p.model = qx.util.Serializer.toNativeObject(controllerForm1.getModel());
				p.bien = tableModelSal.getDataAsMapArray();
				
				//alert(qx.lang.Json.stringify(p, null, 2));
								
				var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					btnCancelar.execute();
					
					this.fireDataEvent("aceptado", data.result);
				}, this);
				rpc.callAsyncListeners(true, "verificar_hoja_cargo", p);
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
	
	

	tblSal.setTabIndex(15);
	btnAceptar.setTabIndex(16);
	btnCancelar.setTabIndex(17);
	
	
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event",
		"estado": "qx.event.type.Event"
	}
});