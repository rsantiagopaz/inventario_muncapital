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
	var rowHoja_cargo;
	
	
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
		tableModel.setColumns(["F.movimiento", "Uni.presu.", "Expte.autoriza", "U.movimiento", "Tipo"], ["fecha_movimiento", "uni_presu_descrip", "expte_autoriza", "usuario_movimiento", "tipo_movimiento"]);

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
			var bool = (! selectionModel.isSelectionEmpty());
			if (bool) {
				rowHoja_cargo = tableModel.getRowData(tbl.getFocusedRow());

			}
		});
		
		
		
		this.add(tbl, {left: 0, top: 27, right: 0, bottom: 0});
		
		

		
	
		
	},
	members : 
	{
		
	}
});