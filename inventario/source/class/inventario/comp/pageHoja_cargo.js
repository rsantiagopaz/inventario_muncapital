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
		
		tableModelItem.setDataAsMapArray([], true);
		
		btnModificar.setEnabled(false);
		btnEliminar.setEnabled(false);
		btnVerificar.setEnabled(false);
		btnImprimirHoja.setEnabled(false);
		btnImprimirCodigo.setEnabled(false);
		
		menu.memorizar([btnModificar, btnEliminar, btnVerificar, btnImprimirHoja, btnImprimirCodigo]);
		
		
		
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
			
			window.open("services/class/comp/Impresion.php?rutina=hoja_cargo&id_hoja_cargo=" + data);
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
			
			window.open("services/class/comp/Impresion.php?rutina=hoja_cargo&id_hoja_cargo=" + data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar...");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		(new dialog.Confirm({
			"message"   : "Desea eliminar hoja cargo seleccionada?",
			"callback"  : function(e){
				if (e) {
					var p = {};
					p.id_hoja_cargo = rowHoja_cargo.id_hoja_cargo;
					
					var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
					rpc.addListener("completed", function(e){

						functionActualizar();
						
					});
					rpc.callAsyncListeners(true, "eliminar_hoja_cargo", p);
				}
			},
			"context"   : this,
			"image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	
	var btnVerificar = new qx.ui.menu.Button("Confirmar carga...");
	btnVerificar.setEnabled(false);
	btnVerificar.addListener("execute", function(e){
		var win = new inventario.comp.windowVerificar(rowHoja_cargo);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
		
			functionActualizar(data);
			
			window.open("services/class/comp/Impresion.php?rutina=hoja_cargo&id_hoja_cargo=" + data);
			window.open("services/class/comp/Impresion.php?rutina=imprimir_codigo&fila=1&id_hoja_cargo=" + data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnImprimirHoja = new qx.ui.menu.Button("Imprimir hoja");
	btnImprimirHoja.setEnabled(false);
	btnImprimirHoja.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=hoja_cargo&id_hoja_cargo=" + rowHoja_cargo.id_hoja_cargo);
	});
	
	var btnImprimirCodigo = new qx.ui.menu.Button("Imprimir código");
	btnImprimirCodigo.setEnabled(false);
	btnImprimirCodigo.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=imprimir_codigo&fila=1&id_hoja_cargo=" + rowHoja_cargo.id_hoja_cargo);
	});
	
	menu.add(btnAlta);
	menu.add(btnModificar);
	menu.add(btnVerificar);
	menu.addSeparator();
	menu.add(btnEliminar);
	menu.addSeparator();
	menu.add(btnImprimirHoja);
	menu.add(btnImprimirCodigo);
	menu.memorizar();

	
	
		//Tabla
	

		var tableModel = new qx.ui.table.model.Simple();
		tableModel.setColumns(["#", "F.verific.", "Usuario verif.", "Uni.presu.", "Proveedor", "F.factura", "Nro.factura", "F.carga", "Usuario carga", "Estado"], ["id_hoja_cargo", "fecha_verific", "usuario_verific", "uni_presu", "proveedor", "fecha_factura", "nro_factura", "fecha_carga", "usuario_carga", "estado"]);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleShowCellFocusIndicator();
		tbl.toggleStatusBarVisible();
		tbl.setContextMenu(menu);

		tbl.addListener("cellDbltap", function(e){
			if (btnModificar.getEnabled()) btnModificar.execute();
		});
		
		
		var tableColumnModel = tbl.getTableColumnModel();
		
		var renderer = new qx.ui.table.cellrenderer.Number();
		//renderer.setNumberFormat(application.numberformatMontoEs);
		//tableColumnModel.setDataCellRenderer(4, renderer);
		
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(new qx.util.format.DateFormat("y-MM-dd HH:mm:ss"));
		tableColumnModel.setDataCellRenderer(1, cellrendererDate);
		tableColumnModel.setDataCellRenderer(7, cellrendererDate);
		
		
		var cellrendererDate2 = new qx.ui.table.cellrenderer.Date();
		cellrendererDate2.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
		tableColumnModel.setDataCellRenderer(5, cellrendererDate2);
		
		
		var cellrendererReplace = new qx.ui.table.cellrenderer.Replace;
		cellrendererReplace.setReplaceMap({
			"C" : "Cargada",
			"V" : "En verificación"
		});
		tableColumnModel.setDataCellRenderer(9, cellrendererReplace);


		
		
	
      // Obtain the behavior object to manipulate
		var resizeBehavior = tableColumnModel.getBehavior();
		resizeBehavior.set(0, {width:"5%", minWidth:100});
		resizeBehavior.set(1, {width:"10%", minWidth:100});
		resizeBehavior.set(2, {width:"8%", minWidth:100});
		resizeBehavior.set(3, {width:"20%", minWidth:100});
		resizeBehavior.set(4, {width:"15%", minWidth:100});
		resizeBehavior.set(5, {width:"7%", minWidth:100});
		resizeBehavior.set(6, {width:"9%", minWidth:100});
		resizeBehavior.set(7, {width:"10%", minWidth:100});
		resizeBehavior.set(8, {width:"8%", minWidth:100});
		resizeBehavior.set(9, {width:"8%", minWidth:100});

		
		
		
		
		var selectionModel = tbl.getSelectionModel();
		selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModel.addListener("changeSelection", function(){
			var selectionEmpty = selectionModel.isSelectionEmpty();
			
			if (! selectionEmpty) {
				rowHoja_cargo = tableModel.getRowData(tbl.getFocusedRow());
				
				btnModificar.setEnabled(! selectionEmpty && rowHoja_cargo.estado == "V");
				btnEliminar.setEnabled(! selectionEmpty && rowHoja_cargo.estado == "V");
				btnVerificar.setEnabled(! selectionEmpty && rowHoja_cargo.estado == "V");
				btnImprimirHoja.setEnabled(! selectionEmpty);
				btnImprimirCodigo.setEnabled(rowHoja_cargo.estado == "C");
				
				menu.memorizar([btnModificar, btnEliminar, btnVerificar, btnImprimirHoja, btnImprimirCodigo]);
				
				
				tblItem.setFocusedCell();
				
		        var timer = qx.util.TimerManager.getInstance();
		        // check for the old listener
		        if (this.timerId != null) {
		          // stop the old one
		          timer.stop(this.timerId);
		          if (this.rpc != null) this.rpc.abort(this.opaqueCallRef);
		          this.timerId = null;
		        }

				this.timerId = timer.start(function(userData, timerId) {
					var p = rowHoja_cargo;
					
					var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
					rpc.addListener("completed", function(e){
						var data = e.getData();
						
						//alert(qx.lang.Json.stringify(data, null, 2));
						
						tableModelItem.setDataAsMapArray(data.result.hoja_cargo_item, true);
						
					}, this);
					rpc.callAsyncListeners(true, "leer_hoja_cargo", p);
				}, null, this, null, 200);
				
			}
		});
		
		
		
		this.add(tbl, {left: 0, top: 27, right: 0, bottom: "41%"});
		
		
		
		
		
		
	//Tabla

	var tableModelItem = new qx.ui.table.model.Simple();
	tableModelItem.setColumns(["Descripción", "Tipo bien", "Cantidad"], ["descrip", "tipo_bien_descrip", "cantidad"]);
	tableModelItem.setColumnSortable(0, false);
	tableModelItem.setColumnSortable(1, false);
	tableModelItem.setColumnSortable(2, false);
	tableModelItem.addListener("dataChanged", function(e){
		var rowCount = tableModelItem.getRowCount();
		
		tblItem.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});	

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblItem = new componente.comp.ui.ramon.table.Table(tableModelItem, custom);
	tblItem.setHeight(200);
	//tblTotales.toggleShowCellFocusIndicator();
	tblItem.setShowCellFocusIndicator(false);
	tblItem.toggleColumnVisibilityButtonVisible();
	//tblItem.toggleStatusBarVisible();
	
	var tableColumnModelItem = tblItem.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatEnteroEs);
	tableColumnModelItem.setDataCellRenderer(2, cellrendererNumber);
	
	var resizeBehaviorItem = tableColumnModelItem.getBehavior();
	resizeBehaviorItem.set(0, {width:"65%", minWidth:100});
	resizeBehaviorItem.set(1, {width:"25%", minWidth:100});
	resizeBehaviorItem.set(2, {width:"10%", minWidth:100});
	
	var selectionModelItem = tblItem.getSelectionModel();
	selectionModelItem.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelItem.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelItem.isSelectionEmpty();

	});

	this.add(tblItem, {left: 0, top: "61%", right: 0, bottom: 0});
		
		

		
	
		
	},
	members : 
	{
		
	}
});