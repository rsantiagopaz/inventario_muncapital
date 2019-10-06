qx.Class.define("inventario.comp.windowHoja_movimiento",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowHoja_movimiento)
	{
	this.base(arguments);
	
	this.set({
		caption: "Hoja de Movimiento",
		width: 1000,
		height: 500,
		showMinimize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		
		var fineUploaderOptions = {
		    // options
			button: lblImagen.getContentElement().getDomElement(),
			autoUpload: true,
			multiple: false,
			request: {
				endpoint: 'services/php-traditional-server-master/endpoint.php'
			},
			validation: {
				allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
				//acceptFiles: "image/png, image/jpeg",
				acceptFiles: ".jpeg, .jpg, .gif, .png"
	        },
		    callbacks: {
		        onSubmit: function(id, name) {
		        	//application.popupCargando.mostrarModal();
		        	//imgComodato.setSource("./services/documentos/loading66.gif" + "?" + Math.random());
		        },
		        
		        onError: function(id, name, errorReason, xhr) {
		        	//alert(qx.lang.Json.stringify({id: id, name: name, errorReason: errorReason, xhr: xhr}, null, 2));
					dialog.Dialog.error(errorReason);
		        },
		        
		        onComplete: function(id, name, responseJSON, xhr) {
		        	//application.popupCargando.ocultarModal();
		        	
		        	if (responseJSON.success) {
		        		var p = {};
		        		p.uuid = responseJSON.uuid;
		        		p.uploadName = responseJSON.uploadName;
		        		
		        		//alert(qx.lang.Json.stringify(p, null, 2));
		        		
						var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
						rpc.callAsync(function(resultado, error, id){
							
							imgImagen.setSource("services/documentos/movimientos/0.jpg" + "?" + Math.random());
							imagen = responseJSON.uploadName;
							
						}, "agregar_foto3", p);
		        	} else {
		        		//application.popupCargando.ocultarModal();
		        	}
		        }
		    }
		};
		
		fineUploader = new qq.FineUploaderBasic(fineUploaderOptions);
		

		inp = document.getElementsByName("qqfile")[0];
		lblImagen.setVisibility("hidden");
		
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			slbTipo_movimiento.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();


	var fineUploader;
	var inp;
	var imagen;
	
	
	
	var lblImagen = new qx.ui.basic.Label("Imagen...");
	lblImagen.setPadding(5, 5, 5, 5);
	lblImagen.setDecorator("main");
	this.add(lblImagen, {left: 0, top: 0});
	
	
	
	var form1 = new qx.ui.form.Form();
	
	var slbTipo_movimiento = new qx.ui.form.SelectBox();
	slbTipo_movimiento.add(new qx.ui.form.ListItem("Movimiento", null, "M"));
	slbTipo_movimiento.add(new qx.ui.form.ListItem("Baja", null, "B"));
	slbTipo_movimiento.addListener("changeSelection", function(e){
		var data = e.getData();
		
		var bandera = data[0].getModel() == "M";
		
		if (! bandera) {
			lstUni_presu.resetSelection();
		}
		
		lstUni_presu.setEnabled(bandera);
		tableModelItems.setColumnEditable(6, bandera);
		tblItems.setShowCellFocusIndicator(bandera);
		
		lstUni_presu.setValid(true);
	});
	form1.add(slbTipo_movimiento, "Tipo acción", null, "tipo_movimiento", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 4}});
	
	var lstUni_presu = new qx.ui.form.SelectBox();
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
	
	form1.add(lstUni_presu, "Uni.presu.", null, "id_uni_presu", null, {grupo: 1, tabIndex: 1, item: {row: 1, column: 1, colSpan: 10}});
	
	//form1.add(lstUni_presu, null, null, "id_uni_presu");
	
	
	var txtAsunto_autoriza = new qx.ui.form.TextField("");
	txtAsunto_autoriza.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtAsunto_autoriza, "Asunto autoriza", null, "asunto_autoriza", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 5}});
	
	var txtFecha = new qx.ui.form.DateField();
	txtFecha.setValue(new Date);
	form1.add(txtFecha, "Fecha", null, "fecha_movimiento", null, {grupo: 1, item: {row: 2, column: 7, colSpan: 4}});
	
	var txtObserva = new qx.ui.form.TextArea("");
	txtObserva.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtObserva, "Observaciones", null, "observa", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 10}});
	
	var txtTipo_acto_adm = new qx.ui.form.TextField("");
	txtTipo_acto_adm.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtTipo_acto_adm, "Tipo acto adm.", null, "tipo_acto_adm", null, {grupo: 1, item: {row: 3, column: 12, colSpan: 5}});
	
	var txtNro_acto_adm = new qx.ui.form.TextField("");
	txtNro_acto_adm.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form1.add(txtNro_acto_adm, "Nro.acto adm.", null, "nro_acto_adm", null, {grupo: 1, item: {row: 3, column: 18, colSpan: 5}});
	

	

	
	var controllerForm1 = new qx.data.controller.Form(null, form1);
	
	//var formView1 = new qx.ui.form.renderer.Single(form1);
	var formView1 = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 10, 25, 1);
	this.add(formView1, {left: 0, top: 0});
	
	

	
	
	
	
	var btnImagen = new qx.ui.form.Button("Imagen...");
	btnImagen.addListener("execute", function(e){
		inp.click();
	});
	this.add(btnImagen, {right: "25%", top: 30});
	
	
	
	var imgImagen = new qx.ui.basic.Image("0.jpg?" + Math.random());
	imgImagen.setWidth(80);
	imgImagen.setHeight(70);
	imgImagen.setBackgroundColor("#FFFFFF");
	imgImagen.setDecorator("main");
	imgImagen.setScale(true);
	imgImagen.addListener("loaded", function(e){
		imgImagen.abrir = true;
	});
	imgImagen.addListener("loadingFailed", function(e){
		imgImagen.abrir = false;
	});
	imgImagen.addListener("tap", function(e){
		if (imgImagen.abrir) window.open(imgImagen.getSource());
		else {
			if (btnImagen.getEnabled()) btnImagen.execute();
		}
	});
	
	this.add(imgImagen, {right: "15%", top: 0});
	
	
	
	
	
	
	
	
	var gbxItems = new qx.ui.groupbox.GroupBox("Bienes");
	gbxItems.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxItems, {left: 0, top: "40%", right: 0, bottom: 50});
	
	

	
	var menuItems = new componente.comp.ui.ramon.menu.Menu();
	
	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new inventario.comp.windowBuscarBien(true, false);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			var rowData = data;

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
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tblItems.setFocusedCell(6, tblItems.getFocusedRow(), true);
		tblItems.startEditing();
	});
	
	
	var btnAgregar = new qx.ui.menu.Button("Agregar...", null, commandAgregar);
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
	menuItems.add(btnAgregar);
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
	tblItems.addListener("dataEdited", function(e){
		var data = e.getData();
		
		tableModelItems.setValueById("guarda_custodia", data.row, data.value.trim());
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

		}, this);
		rpc.callAsyncListeners(true, "leer_hoja_cargo", p);
	} else {
		var aux = qx.data.marshal.Json.createModel({tipo_movimiento: "M", id_uni_presu: null, uni_presu: "", asunto_autoriza: "", fecha_movimiento: new Date, observa: "", tipo_acto_adm: "", nro_acto_adm: ""}, true);
				
		controllerForm1.setModel(aux);
	}
	
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		lstUni_presu.setValid(true);
		
		var bandera = true;
		
		
		if (slbTipo_movimiento.getSelection()[0].getModel() == "M" && lstUni_presu.isSelectionEmpty()) {
			
			bandera = false;
			
			lstUni_presu.setValid(false);
			lstUni_presu.focus();
			
			sharedErrorTooltip.setLabel("Debe seleccionar unidad presupuestaria");
			sharedErrorTooltip.placeToWidget(lstUni_presu);
			sharedErrorTooltip.show();
		} else if (tableModelItems.getRowCount() == 0) {
			
			bandera = false;
			
			tblItems.setValid(false);
			tblItems.focus();
			
			sharedErrorTooltip.setLabel("Debe agregar algun item");
			sharedErrorTooltip.placeToWidget(tblItems);
			sharedErrorTooltip.show();
		} else {
			if (slbTipo_movimiento.getSelection()[0].getModel() == "M") {
				var data = tableModelItems.getDataAsMapArray();
				
				for (var x = 0; x <= data.length - 1; x++) {
					if (data[x].guarda_custodia == "") {
						bandera = false;
						tblItems.setFocusedCell(6, x, true);
						
						tblItems.setValid(false);
						tblItems.focus();
			
						sharedErrorTooltip.setLabel("Debe ingresar guarda custodia");
						sharedErrorTooltip.placeToWidget(tblItems);
						sharedErrorTooltip.show();
						
						break;
					}
				}
			}
		}
		
		
		var functionEscribir = qx.lang.Function.bind(function(usuario) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm1.getModel());
			p.hoja_movimiento_item = tableModelItems.getDataAsMapArray();
			p.usuario = usuario;
			
			p.model.imagen = imagen;
			
			if (slbTipo_movimiento.getSelection()[0].getModel() == "B") p.model.id_uni_presu = null;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
							
			var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				btnCancelar.execute();
				
				this.fireDataEvent("aceptado", data.result);
			}, this);
			rpc.callAsyncListeners(true, "escribir_hoja_movimiento", p);
		}, this);
		
		
		if (bandera) {
			if (slbTipo_movimiento.getSelection()[0].getModel() == "M") {
				functionEscribir();
				
			} else {
				
				if (application.login.perfiles["039002"] == true) {
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
				
						if (login.perfiles["039002"] == true) {
							functionEscribir(login.usuario);
						} else {
							alert("No tiene autorizacíón");
						}
	
					}, this)
					win.open();
				}
			}
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	
	

	btnImagen.setTabIndex(14);
	tblItems.setTabIndex(15);
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