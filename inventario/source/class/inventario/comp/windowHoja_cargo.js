qx.Class.define("inventario.comp.windowHoja_cargo",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowHoja_cargo)
	{
	this.base(arguments);
	
	this.set({
		caption: "Hoja de Cargo",
		width: 700,
		height: 650,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		timerManager.start(function() {
			lstUni_presu.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();

	var arrayEliminar = [];
	
	var boolAsunto;
	
	var timerManager = qx.util.TimerManager.getInstance();
	
	
	
	
	var form1 = new qx.ui.form.Form();
	

	var lstUni_presu = new qx.ui.form.SelectBox();
	lstUni_presu.setRequired(true);
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
	form1.add(txtNro_factura, "Nro.factura", null, "nro_factura", null, {grupo: 1, item: {row: 2, column: 7, colSpan: 5}});
	

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
	}, "asunto_cargo", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 5}});
	
	
	var txtAsunto_asociado = new qx.ui.form.TextArea("");
	//txtAsunto_asociado.setWidth(500);
	txtAsunto_asociado.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtAsunto_asociado, "Asunto asociado", null, "asunto_asociado", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 5}});
	
	
	var controllerForm1 = new qx.data.controller.Form(null, form1);
	
	//var formView1 = new qx.ui.form.renderer.Single(form1);
	var formView1 = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 10, 25, 1);
	this.add(formView1, {left: 0, top: 0});
	
	
	var lblAsunto = new qx.ui.form.TextArea("");
	//lblAsunto.setRich(true);
	lblAsunto.setReadOnly(true);
	lblAsunto.setDecorator("main");
	lblAsunto.setBackgroundColor("#ffffc0");
	this.add(lblAsunto, {left: 240, top: 90, right: 0});
	
	
	var gbx = new qx.ui.groupbox.GroupBox("Items");
	gbx.setLayout(new qx.ui.layout.Canvas());
	this.add(gbx, {left: 0, right: 0, top: 180, bottom: 50});
	
	
	
	var form2 = new qx.ui.form.Form();
	
	var txtDescrip = new qx.ui.form.TextArea("");
	txtDescrip.setRequired(true);
	txtDescrip.setMaxLength(250);
	txtDescrip.setWidth(500);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form2.add(txtDescrip, "Descripción", null, "descrip", null, {grupo: 1, tabIndex: 11, item: {row: 0, column: 1, colSpan: 20}});
	
	
	var lstTipo_bien = new qx.ui.form.SelectBox();
	lstTipo_bien.setRequired(true);
	lstTipo_bien.setMaxWidth(300);
	var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarTipo_bien", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x in resultado) {
		lstTipo_bien.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	form2.add(lstTipo_bien, "Tipo bien", null, "tipo_bien", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 10}});

	var txtPrecio_uni = new componente.comp.ui.ramon.spinner.Spinner(0, 0, 10000000);
	txtPrecio_uni.setNumberFormat(application.numberformatMontoEn);
	txtPrecio_uni.getChildControl("upbutton").setVisibility("excluded");
	txtPrecio_uni.getChildControl("downbutton").setVisibility("excluded");
	txtPrecio_uni.setSingleStep(0);
	txtPrecio_uni.setPageStep(0);
	form2.add(txtPrecio_uni, "Precio uni.", null, "precio_uni", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 4}});
	
	var txtCantidad = new componente.comp.ui.ramon.spinner.Spinner(1, 1, 10000);
	txtCantidad.setMaxHeight(23);
	txtCantidad.setNumberFormat(application.numberformatEnteroEn);
	txtCantidad.getChildControl("upbutton").setVisibility("excluded");
	txtCantidad.getChildControl("downbutton").setVisibility("excluded");
	txtCantidad.setSingleStep(0);
	txtCantidad.setPageStep(0);
	form2.add(txtCantidad, "Cantidad", null, "cantidad", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 3}});

	
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		if (form2.validate()) {
			var p = {};
			p.descrip = txtDescrip.getValue();
			p.id_tipo_bien = lstTipo_bien.getSelection()[0].getModel();
			p.tipo_bien_descrip = lstTipo_bien.getSelection()[0].getLabel();
			p.precio_uni = txtPrecio_uni.getValue();
			p.cantidad = txtCantidad.getValue();
			
			sharedErrorTooltip.hide();
			tblSal.setValid(true);
			tableModelSal.addRowsAsMapArray([p], null, true);
			tblSal.setFocusedCell(0, tableModelSal.getRowCount() - 1, true);
			
			form2.reset();
			
			timerManager.start(function() {
				txtDescrip.focus();
			}, null, this, null, 50);

		} else {
			timerManager.start(function() {
				form2.getValidationManager().getInvalidFormItems()[0].focus();
			}, null, this, null, 50);
		}
	});
	form2.addButton(btnAgregar, {grupo: 1, item: {row: 3, column: 15, colSpan: 3}});
	
	
	//var formView2 = new qx.ui.form.renderer.Single(form2);
	var formView2 = new componente.comp.ui.ramon.abstractrenderer.Grid(form2, 5, 25, 1);
	gbx.add(formView2);
	
	
	
	

	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		var focusedRow = tblSal.getFocusedRow();
		var rowData = tableModelSal.getRowDataAsMap(focusedRow);
		
		tblSal.blur();
		
		tableModelSal.removeRows(focusedRow, 1);
		if (rowData.id_hoja_cargo_item != null) arrayEliminar.push(rowData.id_hoja_cargo_item);
		
		var rowCount = tableModelSal.getRowCount();
		focusedRow = (focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow;
		tblSal.setFocusedCell(0, focusedRow, true);
		tblSal.focus();
	});
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	
	//Tabla

	var tableModelSal = new qx.ui.table.model.Simple();
	tableModelSal.setColumns(["Descripción", "Tipo bien", "P.uni.", "Cant."], ["descrip", "tipo_bien_descrip", "precio_uni", "cantidad"]);
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
	tblSal.setShowCellFocusIndicator(false);
	tblSal.toggleColumnVisibilityButtonVisible();
	//tblSal.toggleStatusBarVisible();
	tblSal.setContextMenu(menu);
	
	var tableColumnModelSal = tblSal.getTableColumnModel();
	
	var cellrendererNumber1 = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber1.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelSal.setDataCellRenderer(2, cellrendererNumber1);
	
	var cellrendererNumber2 = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber2.setNumberFormat(application.numberformatEnteroEs);
	tableColumnModelSal.setDataCellRenderer(3, cellrendererNumber2);
	
	var resizeBehavior = tableColumnModelSal.getBehavior();
	resizeBehavior.set(0, {width:"60%", minWidth:100});
	resizeBehavior.set(1, {width:"21%", minWidth:100});
	resizeBehavior.set(2, {width:"11%", minWidth:100});
	resizeBehavior.set(3, {width:"8%", minWidth:100});
	
	var selectionModelSal = tblSal.getSelectionModel();
	selectionModelSal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSal.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelSal.isSelectionEmpty();
		btnEliminar.setEnabled(! selectionEmpty);
		menu.memorizar([btnEliminar]);
	});

	gbx.add(tblSal, {left: 0, top: 180, right: 0});
	
	
	
	
	
	
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
				txtDescrip.focus();
				
				sharedErrorTooltip.setLabel("Debe agregar algun item");
				sharedErrorTooltip.placeToWidget(tblSal);
				sharedErrorTooltip.show();
			} else {
				
				var arrayAgregar = [];
				
				var aux = tableModelSal.getDataAsMapArray();
				for (var x in aux) {
					if (aux[x].id_hoja_cargo_item == null) arrayAgregar.push(aux[x]);
				}
				
				var p = {};
				p.model = qx.util.Serializer.toNativeObject(controllerForm1.getModel());
				p.eliminar = arrayEliminar;
				p.agregar = arrayAgregar;
				
				//alert(qx.lang.Json.stringify(p, null, 2));
								
				var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					this.fireDataEvent("aceptado", data.result);
					
					btnCancelar.execute();
				}, this);
				rpc.callAsyncListeners(true, "alta_modifica_hoja_cargo", p);
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