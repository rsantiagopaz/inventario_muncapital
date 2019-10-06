qx.Class.define("inventario.comp.windowHoja_cargoMod",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowHoja_cargo)
	{
	this.base(arguments);
	
	this.set({
		caption: "Hoja de Cargo",
		width: 700,
		height: 550,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			lstUni_presu.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();

	var arrayEliminar = [];
	
	var boolAsunto;
	
	var rowData_hoja_cargo_item;
	
	
	
	
	
	var form1 = new qx.ui.form.Form();
	

	var lstUni_presu = new qx.ui.form.SelectBox();
	lstUni_presu.setRequired(true);
	lstUni_presu.setMaxWidth(300);
	lstUni_presu.setEnabled(false);
	
	var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarUni_presu", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x in resultado) {
		lstUni_presu.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	form1.add(lstUni_presu, "Uni.presu.", null, "id_uni_presu", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 20}});
	
	//form1.add(lstUni_presu, null, null, "id_uni_presu");
	
	
	var cboProveedor = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarProveedor"});
	cboProveedor.setRequired(true);
	cboProveedor.setMaxWidth(300);
	var lstProveedor = cboProveedor.getChildControl("list");
	
	form1.add(cboProveedor, "Proveedor", function(value) {
		if (lstProveedor.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar proveedor");
	}, "proveedor", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 20}});
	
	form1.add(lstProveedor, null, null, "id_proveedor");
	
	
	var txtFecha_factura = new qx.ui.form.DateField();
	txtFecha_factura.setRequired(true);
	txtFecha_factura.setWidth(100);
	form1.add(txtFecha_factura, "Fecha factura", null, "fecha_factura", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 4}});
	
	
	var txtNro_factura = new qx.ui.form.TextField("");
	txtNro_factura.setRequired(true);
	txtNro_factura.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtNro_factura, "Nro.factura", null, "nro_factura", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 5}});
	

	var txtAsunto_cargo = new qx.ui.form.TextField("");
	//txtAsunto_cargo.setWidth(500);
	txtAsunto_cargo.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
		
		var p = {};
		p.documentacion_id = txtAsunto_cargo.getValue();
		
		var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
		rpc.addListener("completed", function(e){
			var data = e.getData();

			var aux = "";
			
			aux = "Documento: " + data.result.documento;
			aux+= String.fromCharCode(13) + "Iniciador: " + data.result.documentacion_tmp_iniciador;
			aux+= String.fromCharCode(13) + "Texto: " + data.result.documentacion_asunto;
			
			lblAsunto.setValue(aux);
			
			boolAsunto = true;

		}, this);
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			lblAsunto.setValue("");
			
			boolAsunto = false;

		}, this);
		rpc.callAsyncListeners(true, "leer_asunto", p);
	});
	form1.add(txtAsunto_cargo, "Asunto cargo", function(value) {
		if (! boolAsunto) throw new qx.core.ValidationError("Validation Error", "Asunto inválido");
	}, "asunto_cargo", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 5}});
	
	
	var txtAsunto_asociado = new qx.ui.form.TextArea("");
	//txtAsunto_asociado.setWidth(500);
	txtAsunto_asociado.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtAsunto_asociado, "Asunto asociado", null, "asunto_asociado", null, {grupo: 1, item: {row: 5, column: 1, colSpan: 5}});
	
	
	var controllerForm1 = new qx.data.controller.Form(null, form1);
	
	//var formView1 = new qx.ui.form.renderer.Single(form1);
	var formView1 = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 10, 25, 1);
	this.add(formView1, {left: 0, top: 0});
	
	
	var lblAsunto = new qx.ui.form.TextArea("");
	//lblAsunto.setRich(true);
	lblAsunto.setReadOnly(true);
	lblAsunto.setDecorator("main");
	lblAsunto.setBackgroundColor("#ffffc0");
	this.add(lblAsunto, {left: 240, top: 115, right: 0});
	
	
	var gbx = new qx.ui.groupbox.GroupBox("Items");
	gbx.setLayout(new qx.ui.layout.Canvas());
	this.add(gbx, {left: 0, top: 230, right: 0, bottom: 50});
	
	

	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnEditar = new qx.ui.menu.Button("Editar");
	btnEditar.setEnabled(false);
	btnEditar.addListener("execute", function(e){
		tblSal.setFocusedCell(0, tblSal.getFocusedRow(), true);
		tblSal.startEditing();
	});
	menu.add(btnEditar);
	
	menu.add(btnEditar);
	menu.memorizar();
	
	
	
	
	//Tabla

	var tableModelSal = new qx.ui.table.model.Simple();
	tableModelSal.setColumns(["Descripción", "Tipo bien", "Cantidad"], ["descrip", "tipo_bien_descrip", "cantidad"]);
	tableModelSal.setColumnSortable(0, false);
	tableModelSal.setColumnSortable(1, false);
	tableModelSal.setColumnSortable(2, false);
	tableModelSal.addListener("dataChanged", function(e){
		var rowCount = tableModelSal.getRowCount();
		
		tblSal.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});	

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSal = new componente.comp.ui.ramon.table.Table(tableModelSal, custom);
	tblSal.setHeight(150);
	//tblTotales.toggleShowCellFocusIndicator();
	//tblSal.setShowCellFocusIndicator(false);
	tblSal.toggleColumnVisibilityButtonVisible();
	//tblSal.toggleStatusBarVisible();
	tblSal.setContextMenu(menu);
	tblSal.edicion = "";
	
	var tableColumnModelSal = tblSal.getTableColumnModel();
	
	var cellrendererString = new qx.ui.table.celleditor.TextField();
	cellrendererString.setValidationFunction(function(newValue, oldValue){
		newValue = newValue.trim();
		if (newValue=="") return oldValue; else return newValue;
	});
	tableColumnModelSal.setCellEditorFactory(0, cellrendererString);
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatEnteroEs);
	tableColumnModelSal.setDataCellRenderer(2, cellrendererNumber);
	
	var resizeBehavior = tableColumnModelSal.getBehavior();
	resizeBehavior.set(0, {width:"65%", minWidth:100});
	resizeBehavior.set(1, {width:"25%", minWidth:100});
	resizeBehavior.set(2, {width:"10%", minWidth:100});
	
	var selectionModelSal = tblSal.getSelectionModel();
	selectionModelSal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSal.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelSal.isSelectionEmpty();
		
		if (! selectionEmpty) {
			var focusedRow = tblSal.getFocusedRow();
			rowData_hoja_cargo_item = tableModelSal.getRowDataAsMap(focusedRow);
			
			tableModelSal.setColumnEditable(0, rowData_hoja_cargo_item.id_hoja_cargo_item != null);
			
			btnEditar.setEnabled(rowData_hoja_cargo_item.id_hoja_cargo_item != null);
			menu.memorizar([btnEditar]);
		}
	});

	gbx.add(tblSal, {left: 0, top: 0, right: 0, bottom: 0});
	
	
	
	
	
	
	if (rowHoja_cargo) {
		var p = rowHoja_cargo;
		
		var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			boolAsunto = true;
			
			lstUni_presu.add(new qx.ui.form.ListItem(data.result.uni_presu.label, null, data.result.uni_presu.model));
			lstProveedor.add(new qx.ui.form.ListItem(data.result.proveedor.label, null, data.result.proveedor.model));
			
			tableModelSal.setDataAsMapArray(data.result.hoja_cargo_item, true);
			
			data.result.hoja_cargo.uni_presu = "";
			data.result.hoja_cargo.proveedor = "";
			var aux = qx.data.marshal.Json.createModel(data.result.hoja_cargo, true);
			
			controllerForm1.setModel(aux);
			
			txtAsunto_cargo.focus();
			lstUni_presu.focus();
			
		}, this);
		rpc.callAsyncListeners(true, "leer_hoja_cargo", p);
	} else {
		boolAsunto = false;
		
		var aux = qx.data.marshal.Json.createModel({id_hoja_cargo: "0", id_uni_presu: null, uni_presu: null, id_proveedor: null, proveedor: null, nro_factura: "", asunto_cargo: "", asunto_asociado: "", fecha_factura: null}, true);
				
		controllerForm1.setModel(aux);
	}
	
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		tblSal.setValid(true);
		
		if (form1.validate()) {
			if (tableModelSal.getRowCount() == 0) {
				tblSal.setValid(false);
				//txtDescrip.focus();
				
				sharedErrorTooltip.setLabel("Debe agregar algun item");
				sharedErrorTooltip.placeToWidget(tblSal);
				sharedErrorTooltip.show();
			} else {
				
				var functionEscribir = qx.lang.Function.bind(function(usuario) {
					var p = {};
					p.model = qx.util.Serializer.toNativeObject(controllerForm1.getModel());
					p.items = tableModelSal.getDataAsMapArray();
					p.usuario = usuario;
					
					//alert(qx.lang.Json.stringify(p, null, 2));
									
					var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
					rpc.addListener("completed", function(e){
						var data = e.getData();
						
						this.fireDataEvent("aceptado", data.result);
						
						btnCancelar.execute();
					}, this);
					rpc.callAsyncListeners(true, "modifica_hoja_cargo", p);
				}, this);
				
				
				if (application.login.perfiles["039003"] == true) {
					functionEscribir();
					
				} else {
					var win = new inventario.comp.windowLogin("Autorización", true);
					win.setModal(true);
					win.addListenerOnce("appear", function(e){
						win.center();
					});
					win.addListener("aceptado", function(e){
						var data = e.getData();
					
						var login = data;
				
						if (login.perfiles["039003"] == true) {
							functionEscribir(login.usuario);
						} else {
							alert("No tiene autorizacíón");
						}
	
					}, this)
					win.open();
				}
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
		"aceptado": "qx.event.type.Event"
	}
});