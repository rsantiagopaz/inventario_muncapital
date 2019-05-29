qx.Class.define("inventario.comp.windowListado",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Listado",
		width: 1000,
		height: 550,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	//this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		rbtA1.setValue(true);
		rbtA1.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	var dateFormat = new qx.util.format.DateFormat("yyyy-MM-dd");
	
	var rowBien;
	

	var layout = new qx.ui.layout.Grid(10, 10);
	layout.setColumnAlign(2, "right", "middle");
	layout.setColumnAlign(4, "right", "middle");
	var composite = new qx.ui.container.Composite(layout);
	this.add(composite, {left: 0, top: 0, right: 0, bottom: 0});
	
	var rgpA = new qx.ui.form.RadioGroup();
	
	var rbtA1 = new qx.ui.form.RadioButton("Inventario gral.").set({value: true});
	rbtA1.addListener("changeValue", function(e){
		var data = e.getData();
		
		if (data) {
			lstUni_presu.setEnabled(true);
			cboTipo_bien.setEnabled(true);
			cboDepartamento.setEnabled(false);
			cboResponsable.setEnabled(false);
			slbTipo_movimiento.setEnabled(false);
			gbxBuscar.setEnabled(false);
			
			dtfDesde.setEnabled(false);
			dtfHasta.setEnabled(false);
		}
	});
	
	
	composite.add(rbtA1, {row: 0, column: 0});
	rgpA.add(rbtA1);

	
	var rbtA2 = new qx.ui.form.RadioButton("Movimientos").set({value: true});
	rbtA2.addListener("changeValue", function(e){
		var data = e.getData();

		if (data) {
			lstUni_presu.setEnabled(false);
			cboTipo_bien.setEnabled(false);
			cboDepartamento.setEnabled(false);
			cboResponsable.setEnabled(false);
			slbTipo_movimiento.setEnabled(true);
			gbxBuscar.setEnabled(false);
			
			dtfDesde.setEnabled(true);
			dtfHasta.setEnabled(true);
		}
	});
	
	composite.add(rbtA2, {row: 2, column: 0});
	rgpA.add(rbtA2);
	
	
	var rbtA3 = new qx.ui.form.RadioButton("Historial bien").set({value: true});
	rbtA3.addListener("changeValue", function(e){
		var data = e.getData();
		
		if (data) {
			lstUni_presu.setEnabled(false);
			cboTipo_bien.setEnabled(false);
			cboDepartamento.setEnabled(false);
			cboResponsable.setEnabled(false);
			slbTipo_movimiento.setEnabled(false);
			gbxBuscar.setEnabled(true);
			
			dtfDesde.setEnabled(false);
			dtfHasta.setEnabled(false);
		}
	});
	
	composite.add(rbtA3, {row: 3, column: 0});
	rgpA.add(rbtA3);
	
	
	var rbtA4 = new qx.ui.form.RadioButton("Bajas").set({value: true});
	rbtA4.addListener("changeValue", function(e){
		var data = e.getData();
		
		if (data) {
			lstUni_presu.setEnabled(false);
			cboTipo_bien.setEnabled(false);
			cboDepartamento.setEnabled(false);
			cboResponsable.setEnabled(false);
			
			dtfDesde.setEnabled(true);
			dtfHasta.setEnabled(true);
		}
	});
	
	//composite.add(rbtA4, {row: 4, column: 0});
	rgpA.add(rbtA4);
	
	
	
	
	composite.add(new qx.ui.basic.Label("Uni.presu.: "), {row: 0, column: 2});
	var lstUni_presu = new qx.ui.form.SelectBox();
	lstUni_presu.setMaxWidth(300);
	
	lstUni_presu.add(new qx.ui.form.ListItem("-", null, 0));
	
	var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarUni_presu", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x in resultado) {
		lstUni_presu.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	composite.add(lstUni_presu, {row: 0, column: 3, colSpan: 3});
	
	
	composite.add(new qx.ui.basic.Label("Tipo bien: "), {row: 1, column: 2});
	var cboTipo_bien = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarTipo_bien"});
	var lstTipo_bien = cboTipo_bien.getChildControl("list");
	composite.add(cboTipo_bien, {row: 1, column: 3, colSpan: 3});
	

	composite.add(new qx.ui.basic.Label("Acción: "), {row: 2, column: 2});
	var slbTipo_movimiento = new qx.ui.form.SelectBox();
	slbTipo_movimiento.add(new qx.ui.form.ListItem("-", null, "0"));
	slbTipo_movimiento.add(new qx.ui.form.ListItem("Alta", null, "A"));
	slbTipo_movimiento.add(new qx.ui.form.ListItem("Movimiento", null, "M"));
	slbTipo_movimiento.add(new qx.ui.form.ListItem("Baja", null, "B"));
	composite.add(slbTipo_movimiento, {row: 2, column: 3, colSpan: 2});
	
	
	

	
	//composite.add(new qx.ui.basic.Label("Departamento: "), {row: 2, column: 2});
	var cboDepartamento = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarDepartamento"});
	var lstDepartamento = cboDepartamento.getChildControl("list");
	//composite.add(cboDepartamento, {row: 2, column: 3, colSpan: 3});
	
	

	//composite.add(new qx.ui.basic.Label("Responsable: "), {row: 3, column: 2});
	var cboResponsable = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Responsable", methodName: "autocompletarResponsable"});
	var lstResponsable = cboResponsable.getChildControl("list");
	//composite.add(cboResponsable, {row: 3, column: 3, colSpan: 3});
	

	
	
	
	//composite.add(new qx.ui.basic.Label("Departamento: "), {row: 3, column: 2});
	
	
	
	
	
	
	
	
	
	
	var gbxBuscar = new qx.ui.groupbox.GroupBox("Buscar");
	gbxBuscar.setLayout(new qx.ui.layout.Canvas());
	gbxBuscar.setHeight(200);
	composite.add(gbxBuscar, {row: 4, column: 0, colSpan: 60});
	
	
	
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
			rowBien = null;
			
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
	
				this.opaqueCallRef = this.rpc.callAsyncListeners(true, "leer_bienes_todos", p);
			}
		}, null, this, null, 200);
	});
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});

	gbxBuscar.add(new qx.ui.basic.Label("Texto:"), {left: 0, top: 3});
	gbxBuscar.add(txtDescrip, {left: 40, top: 0});
	

	
	
	
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
		
		if (! selectionEmpty) {
			rowBien = tableModelBuscar.getRowData(tblBuscar.getFocusedRow());
			
		}
	});

	gbxBuscar.add(tblBuscar, {left: 0, top: 30, right: 0, bottom: 0});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var dtfDesde = new qx.ui.form.DateField();
	dtfDesde.setMaxWidth(100);
	var dtfHasta = new qx.ui.form.DateField();
	dtfHasta.setMaxWidth(100);
	
	var aux = new Date;
	aux.setDate(1);
	dtfDesde.setValue(aux);
	aux.setMonth(aux.getMonth() + 1);
	aux.setDate(aux.getDate() - 1);
	dtfHasta.setValue(aux);
	
	composite.add(new qx.ui.basic.Label("Desde: "), {row: 7, column: 2});
	composite.add(dtfDesde, {row: 7, column: 3});
	composite.add(new qx.ui.basic.Label("Hasta: "), {row: 7, column: 4});
	composite.add(dtfHasta, {row: 7, column: 5});
	
	
	

	var btnAceptar = new qx.ui.form.Button("Ver");
	btnAceptar.addListener("execute", function(e){
		var aux, txt;
		
		tblBuscar.setValid(true);

		if (rbtA1.getValue()) {
			txt = "?rutina=inventario";
			
		} else if (rbtA2.getValue()) {
			txt = "?rutina=listado_movimiento";
			
		} else if (rbtA3.getValue()) {
			if (rowBien) {
				txt = "?rutina=historial_bien";
			} else {
				tblBuscar.setValid(false);
				txtDescrip.focus();
				
				sharedErrorTooltip.setLabel("Debe seleccionar algún bien");
				sharedErrorTooltip.placeToWidget(tblBuscar);
				sharedErrorTooltip.show();
				
				return;
			}
			//txt = "?rutina=listado_movimiento&tipo_movimiento=M";
			
		} else if (rbtA4.getValue()) {
			//txt = "?rutina=listado_movimiento&tipo_movimiento=B";
		}
		
		
		if (lstUni_presu.getEnabled()) {
			var model = lstUni_presu.getModelSelection().getItem(0);
			if (model != "0") txt+= "&id_uni_presu=" + model;
		}
		if (cboTipo_bien.getEnabled()) {
			if (! lstTipo_bien.isSelectionEmpty()) txt+= "&id_tipo_bien=" + lstTipo_bien.getModelSelection().getItem(0);
		}
		if (cboDepartamento.getEnabled()) {
			if (! lstDepartamento.isSelectionEmpty()) txt+= "&departamento_id=" + lstDepartamento.getModelSelection().getItem(0);
		}
		if (cboResponsable.getEnabled()) {
			if (! lstResponsable.isSelectionEmpty()) txt+= "&id_responsable=" + lstResponsable.getModelSelection().getItem(0);
		}
		if (slbTipo_movimiento.getEnabled()) {
			var model = slbTipo_movimiento.getSelection()[0].getModel();
			if (model != "0") txt+= "&tipo_movimiento=" + model;
		}
		if (rowBien) {
			txt+= "&id_bien=" + rowBien.id_bien;
		}
		if (dtfDesde.getEnabled()) {
			txt+= (aux = dtfDesde.getValue()) ? "&desde=" + dateFormat.format(aux) : "";
			txt+= (aux = dtfHasta.getValue()) ? "&hasta=" + dateFormat.format(aux) : "";
		}
		
		window.open("services/class/comp/Impresion.php" + txt);
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "25%", bottom: 0});
	this.add(btnCancelar, {right: "25%", bottom: 0});
	
	
	rbtA1.setTabIndex(1);
	rbtA2.setTabIndex(2);
	rbtA3.setTabIndex(3);
	lstUni_presu.setTabIndex(4);
	cboTipo_bien.setTabIndex(5);
	cboDepartamento.setTabIndex(6);
	cboResponsable.setTabIndex(7);
	dtfDesde.setTabIndex(8);
	dtfHasta.setTabIndex(9);
	btnAceptar.setTabIndex(10);
	btnCancelar.setTabIndex(11);

	
	},

	events : 
	{

	}
});