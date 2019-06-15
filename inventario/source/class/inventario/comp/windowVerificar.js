qx.Class.define("inventario.comp.windowVerificar",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowHoja_cargo)
	{
	this.base(arguments);
	
	this.set({
		caption: "Confirmar carga",
		width: 700,
		height: 500,
		showMinimize: false,
		showMaximize: true,
		allowMaximize: true,
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
		        
		        onComplete: qx.lang.Function.bind(function(id, name, responseJSON, xhr) {
		        	//application.popupCargando.ocultarModal();
		        	
		        	if (responseJSON.success) {
		        		var p = {};
		        		p.id_bien = rowData.id_bien;
		        		p.uuid = responseJSON.uuid;
		        		p.uploadName = responseJSON.uploadName;
		        		
		        		//alert(qx.lang.Json.stringify(p, null, 2));
		        		
						var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
						rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id){
							//application.popupCargando.ocultarModal();
							
							//alert(qx.lang.Json.stringify(resultado, null, 2));
							//alert(qx.lang.Json.stringify(error, null, 2));
							
							imgImagen.setSource("./services/temp/" + rowData.id_bien + ".jpg" + "?" + Math.random());
							
							tableModelSal.setValueById("imagen", focusedRow, responseJSON.uploadName);
							tblSal.focus();
							
						}, this), "agregar_foto", p);
		        	} else {
		        		//application.popupCargando.ocultarModal();
		        	}
		        }, this)
		    }
		};
		
		fineUploader = new qq.FineUploaderBasic(fineUploaderOptions);
		

		inp = document.getElementsByName("qqfile")[0];
		lblImagen.setVisibility("hidden");
		
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			tblSal.focus();
		}, null, this, null, 50);
	}, this);
	
	
	this.addListener("close", function(e){
		this.destroy();
	}, this);
	
	
	
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();


	var fineUploader;
	
	var focusedRow;
	var rowData;
	var inp;

	
	var form1 = new qx.ui.form.Form();
	
	var txtGuarda_custodia = new qx.ui.form.TextField("");
	txtGuarda_custodia.setRequired(true);
	txtGuarda_custodia.setEnabled(false);
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
	//this.add(formView1, {left: 0, top: 0});
	
	

	var chkAutogenerar = new qx.ui.form.CheckBox("Autogenerar nros.serie vacios");
	this.add(chkAutogenerar, {left: "75%", top: 25});
	
	
	var gbx = new qx.ui.groupbox.GroupBox("Items");
	gbx.setLayout(new qx.ui.layout.Grow());
	this.add(gbx, {left: 0, top: 60, right: 0, bottom: 50});
	
	
	
	
	
	
	var menuItems = new componente.comp.ui.ramon.menu.Menu();
	
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tblSal.setFocusedCell(3, tblSal.getFocusedRow(), true);
		tblSal.startEditing();
	});
	
	
	var btnEditar = new qx.ui.menu.Button("Editar", null, commandEditar);
	
	var btnCargar = new qx.ui.menu.Button("Cargar imagen...");
	btnCargar.setEnabled(false);
	btnCargar.addListener("execute", function(e){
		inp.click();
	});
	
	menuItems.add(btnEditar);
	menuItems.add(btnCargar);
	menuItems.memorizar();
	
	
	
	
	//Tabla

	var tableModelSal = new qx.ui.table.model.Simple();
	tableModelSal.setColumns(["Descripción", "Tipo bien", "Imagen", "Nro.serie"], ["hoja_cargo_item_descrip", "tipo_bien_descrip", "imagen", "nro_serie"]);
	tableModelSal.setColumnSortable(0, false);
	tableModelSal.setColumnSortable(1, false);
	tableModelSal.setColumnSortable(2, false);
	tableModelSal.setColumnSortable(3, false);
	
	tableModelSal.setColumnEditable(3, true);
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
		if (tblSal.getFocusedColumn() == 2) btnCargar.execute(); else commandEditar.execute();
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

		if (! selectionEmpty) {
			focusedRow = tblSal.getFocusedRow();
			rowData = tableModelSal.getRowDataAsMap(focusedRow);
			
			commandEditar.setEnabled(! selectionEmpty);
			btnCargar.setEnabled(! selectionEmpty);
			menuItems.memorizar([commandEditar, btnCargar]);
			
			imgImagen.setSource("./services/temp/" + rowData.id_bien + ".jpg" + "?" + Math.random());
		}
	});

	gbx.add(tblSal);
	
	
	
	
	
	
	
	var p = rowHoja_cargo;
	
	var rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
	rpc.addListener("completed", function(e){
		var data = e.getData();
		
		//alert(qx.lang.Json.stringify(data, null, 2));
		
		tableModelSal.setDataAsMapArray(data.result, true);
		tblSal.setFocusedCell(3, 0, true);
		
	}, this);
	rpc.callAsyncListeners(true, "leer_hoja_cargo_item", p);

	
	var aux = qx.data.marshal.Json.createModel({guarda_custodia: rowHoja_cargo.uni_presu, asunto_autoriza: ""}, true);
				
	controllerForm1.setModel(aux);
	
	
	
	
	var lblImagen = new qx.ui.basic.Label("Imagen...");
	lblImagen.setPadding(5, 5, 5, 5);
	lblImagen.setDecorator("main");
	this.add(lblImagen, {left: 0, top: 0});
	//this.add(gbx, {left: 0, top: 60, right: 0, bottom: 60});
	
	
	var btnImagen = new qx.ui.form.Button("Imagen...");
	btnImagen.addListener("execute", function(e){
		btnCargar.execute();
	});
	this.add(btnImagen, {right: "46%", top: 20});
	
	
	
	var imgImagen = new qx.ui.basic.Image();
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
		if (imgImagen.abrir) window.open(imgImagen.getSource()); else btnCargar.execute();
	});
	
	this.add(imgImagen, {right: "32%", top: 0});
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		tblSal.setValid(true);
		
		if (form1.validate()) {
			var bandera = true;
			
			var data = tableModelSal.getDataAsMapArray();
			
			if (! chkAutogenerar.getValue()) {
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
		this.close();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	
	
	
	btnImagen.setTabIndex(10);
	imgImagen.setTabIndex(11);
	chkAutogenerar.setTabIndex(14);
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