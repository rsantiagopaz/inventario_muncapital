qx.Class.define("inventario.comp.windowBuscarBien",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (simple, bajas)
	{
	this.base(arguments);
	
	this.set({
		caption: "Buscar bien",
		width: 1000,
		height: 300,
		showMinimize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListener("appear", function(e){
		txtDescrip.focus();
		txtDescrip.selectAllText();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	
	
	
	var gbxBuscar = new qx.ui.groupbox.GroupBox();
	gbxBuscar.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxBuscar, {left: 0, top: 0, right: 0, bottom: 0});
	
	
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setLiveUpdate(true);
	txtDescrip.setWidth(200);
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
				p.bajas = bajas;
				
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
		
		this.fireDataEvent("aceptado", rowData);
		if (simple) this.destroy();
	}, this);
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
	
	
	
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});