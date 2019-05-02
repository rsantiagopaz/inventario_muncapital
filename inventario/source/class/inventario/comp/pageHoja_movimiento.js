qx.Class.define("inventario.comp.pageHoja_movimiento",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
		this.base(arguments);
		
		
		this.setLabel('Hoja movimiento');
		this.setLayout(new qx.ui.layout.Canvas());
		this.setShowCloseButton(true);
		
	this.addListenerOnce("appear", function(e){
		functionActualizar();
		//tbl.focus();
	});
	
	
	
	var application = qx.core.Init.getApplication();
	var rowHoja_movimiento;
	
	
	var functionActualizar = function(id_hoja_movimiento) {
		
		tbl.blur();
		tbl.setFocusedCell();
		
		var p = {};

		var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(id_hoja_movimiento, null, 2));
			
			tableModel.setDataAsMapArray(data.result, true);
			
			if (id_hoja_movimiento) {
				tbl.blur();
				tbl.setFocusedCell();
		
				tbl.buscar("id_hoja_movimiento", id_hoja_movimiento);
				tbl.focus();
			}
		}, this);
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
		}, this);
		
		rpc.callAsyncListeners(true, "leer_hojas_movimiento", p);
	}
	
	
	
	
	
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnAlta = new qx.ui.menu.Button("Nueva...");
	btnAlta.addListener("execute", function(e){
		var win = new inventario.comp.windowHoja_movimiento();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizar(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	

	menu.add(btnAlta);
	menu.memorizar();

	
	
		//Tabla
	

		var tableModel = new qx.ui.table.model.Simple();
		tableModel.setColumns(["F.movimiento", "Uni.presu.", "Expte.autoriza", "U.movimiento", "Acción"], ["fecha_movimiento", "uni_presu_descrip", "expte_autoriza", "usuario_movimiento", "tipo_movimiento"]);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleShowCellFocusIndicator();
		tbl.toggleStatusBarVisible();
		tbl.setContextMenu(menu);

		tbl.addListener("cellDbltap", function(e){
			
		});
		
		
		var tableColumnModel = tbl.getTableColumnModel();
		
		var renderer = new qx.ui.table.cellrenderer.Number();
		//renderer.setNumberFormat(application.numberformatMontoEs);
		//tableColumnModel.setDataCellRenderer(4, renderer);
		
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
		tableColumnModel.setDataCellRenderer(0, cellrendererDate);
		
		
		var cellrendererReplace = new qx.ui.table.cellrenderer.Replace;
		cellrendererReplace.setReplaceMap({
			"A" : "Alta",
			"M" : "Movimiento",
			"B" : "Baja"
		});
		tableColumnModel.setDataCellRenderer(4, cellrendererReplace);


		
		
	
      // Obtain the behavior object to manipulate
		var resizeBehavior = tableColumnModel.getBehavior();
		//resizeBehavior.set(0, {width:"30%", minWidth:100});
		//resizeBehavior.set(1, {width:"20%", minWidth:100});
		//resizeBehavior.set(2, {width:"10%", minWidth:100});
		//resizeBehavior.set(3, {width:"20%", minWidth:100});
		//resizeBehavior.set(4, {width:"10%", minWidth:100});

		
		
		
		
		var selectionModel = tbl.getSelectionModel();
		selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModel.addListener("changeSelection", function(){
			var selectionEmpty = selectionModel.isSelectionEmpty();
			if (! selectionEmpty) {
				rowHoja_movimiento = tableModel.getRowData(tbl.getFocusedRow());
				
				tblItems.setFocusedCell();
				
		        var timer = qx.util.TimerManager.getInstance();
		        // check for the old listener
		        if (this.timerId != null) {
		          // stop the old one
		          timer.stop(this.timerId);
		          if (this.rpc != null) this.rpc.abort(this.opaqueCallRef);
		          this.timerId = null;
		        }

				this.timerId = timer.start(function(userData, timerId) {
					var p = rowHoja_movimiento;
					
					var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
					rpc.addListener("completed", function(e){
						var data = e.getData();
						
						//alert(qx.lang.Json.stringify(data, null, 2));
						
						tableModelItems.setDataAsMapArray(data.result, true);
						
					}, this);
					rpc.callAsyncListeners(true, "leer_hoja_movimiento", p);
				}, null, this, null, 200);
				
			}
		});
		
		
		
		this.add(tbl, {left: 0, top: 27, right: 0, bottom: "41%"});
		
		
		
		
		
		
		
	//Tabla

	var tableModelItems = new qx.ui.table.model.Simple();
	tableModelItems.setColumns(["Descripción", "Tipo bien", "Uni.presu.", "Cod.barra", "Nro.serie", "Cod.QR", "Guarda custodia"], ["descrip", "tipo_bien_descrip", "uni_presu_descrip", "id_bien", "nro_serie", "codigo_qr", "guarda_custodia"]);
	tableModelItems.setColumnSortable(0, false);
	tableModelItems.setColumnSortable(1, false);
	tableModelItems.setColumnSortable(2, false);
	
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
	tblItems.setShowCellFocusIndicator(false);
	tblItems.toggleColumnVisibilityButtonVisible();
	//tblItems.toggleStatusBarVisible();

	
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

	});

	this.add(tblItems, {left: 0, top: "61%", right: 0, bottom: 0});
		
		

		
	
		
	},
	members : 
	{
		
	}
});