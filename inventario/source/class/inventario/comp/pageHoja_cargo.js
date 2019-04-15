qx.Class.define("inventario.comp.pageHoja_cargo",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
		this.base(arguments);
		
		
		this.setLabel('Hoja cargo');
		this.setLayout(new qx.ui.layout.Canvas());
		this.setShowCloseButton(true);
		
	this.addListenerOnce("appear", function(e){
		functionActualizar();
		//tbl.focus();
	});
	
	
	
	var application = qx.core.Init.getApplication();
	var rowHoja_cargo;
	
	
	var functionActualizar = function(id_hoja_cargo) {
		
		tbl.blur();
		tbl.setFocusedCell();
		
		var p = {};

		var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			tableModel.setDataAsMapArray(data.result, true);
			
			if (id_hoja_cargo) {
				tbl.blur();
				tbl.setFocusedCell();
				
				tbl.buscar("id_hoja_cargo", id_hoja_cargo);
				tbl.focus();
			}
		}, this);
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
		}, this);
		
		rpc.callAsyncListeners(true, "leer_hojas_cargo", p);
	}
	
	
	
	
	
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnAlta = new qx.ui.menu.Button("Nueva...");
	btnAlta.addListener("execute", function(e){
		var win = new inventario.comp.windowHoja_cargo();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			functionActualizar(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnModificar = new qx.ui.menu.Button("Modificar...");
	btnModificar.setEnabled(false);
	btnModificar.addListener("execute", function(e){
		var win = new inventario.comp.windowHoja_cargo(rowHoja_cargo);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
		
			functionActualizar(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnVerificar = new qx.ui.menu.Button("Verificar...");
	btnVerificar.setEnabled(false);
	btnVerificar.addListener("execute", function(e){
		var win = new inventario.comp.windowVerificar(rowHoja_cargo);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
		
			functionActualizar(data);
			
			window.open("services/class/comp/Impresion.php?rutina=imprimir_codigo&id_hoja_cargo=" + data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	menu.add(btnAlta);
	menu.add(btnModificar);
	menu.addSeparator();
	menu.add(btnVerificar);
	menu.memorizar();

	
	
		//Tabla
	

		var tableModel = new qx.ui.table.model.Simple();
		tableModel.setColumns(["F.carga", "Uni.presu.", "Proveedor", "F.factura", "N.factura", "U.carga", "F.verific.", "U.verif.", "Estado"], ["fecha_carga", "uni_presu", "proveedor", "fecha_factura", "nro_factura", "usuario_carga", "fecha_verific", "usuario_verific", "estado"]);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleShowCellFocusIndicator();
		tbl.toggleStatusBarVisible();
		tbl.setContextMenu(menu);

		tbl.addListener("cellDbltap", function(e){
			btnModificar.execute();
		});
		
		
		var tableColumnModel = tbl.getTableColumnModel();
		
		var renderer = new qx.ui.table.cellrenderer.Number();
		//renderer.setNumberFormat(application.numberformatMontoEs);
		//tableColumnModel.setDataCellRenderer(4, renderer);
		
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
		tableColumnModel.setDataCellRenderer(0, cellrendererDate);
		tableColumnModel.setDataCellRenderer(6, cellrendererDate);
		
		
		var cellrendererDate2 = new qx.ui.table.cellrenderer.Date();
		cellrendererDate2.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
		tableColumnModel.setDataCellRenderer(3, cellrendererDate2);
		
		
		var cellrendererReplace = new qx.ui.table.cellrenderer.Replace;
		cellrendererReplace.setReplaceMap({
			"C" : "Cargada",
			"V" : "Verificada"
		});
		tableColumnModel.setDataCellRenderer(8, cellrendererReplace);


		
		
	
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
				rowHoja_cargo = tableModel.getRowData(tbl.getFocusedRow());
				
				btnModificar.setEnabled(! selectionEmpty && rowHoja_cargo.estado == "C");
				btnVerificar.setEnabled(! selectionEmpty && rowHoja_cargo.estado == "C");
				
				menu.memorizar([btnModificar, btnVerificar]);
			}
		});
		
		
		
		this.add(tbl, {left: 0, top: 27, right: 0, bottom: 0});
		
		

		
	
		
	},
	members : 
	{
		
	}
});