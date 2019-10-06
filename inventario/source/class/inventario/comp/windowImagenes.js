qx.Class.define("inventario.comp.windowImagenes",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Imagenes",
		width: 1000,
		height: 550,
		showMinimize: false,
		//showMaximize: true,
		//allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	//this.setResizable(false, false, false, false);
	
	
	
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
		        		p.id_bien = rowData.id_bien;
		        		p.uuid = responseJSON.uuid;
		        		p.uploadName = responseJSON.uploadName;
		        		
		        		//alert(qx.lang.Json.stringify(p, null, 2));
		        		
						var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
						rpc.callAsync(function(resultado, error, id){
							
							imgImagen.setSource("./services/documentos/cargos/" + rowData.id_bien + ".jpg" + "?" + Math.random());
							
							tableModelBuscar.setValueById("imagen", focusedRow, responseJSON.uploadName);
							tblBuscar.focus();
							
						}, "agregar_foto2", p);
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
			
			txtDescrip.focus();
		}, null, this, null, 50);
	});
	
	
	this.addListener("close", function(e){
		this.destroy();
	}, this);
	
	
	

	var application = qx.core.Init.getApplication();
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	var dateFormat = new qx.util.format.DateFormat("yyyy-MM-dd");
	
	
	var fineUploader;
	
	var focusedRow;
	var rowData;
	var inp;
	
	
	
	var lblImagen = new qx.ui.basic.Label("Imagen...");
	lblImagen.setPadding(5, 5, 5, 5);
	lblImagen.setDecorator("main");
	this.add(lblImagen, {left: 0, top: 0});
	
	
	
	var gbxBuscar = new qx.ui.groupbox.GroupBox("Buscar");
	gbxBuscar.setLayout(new qx.ui.layout.Canvas());
	this.add(gbxBuscar, {left: 0, top: 60, right: 0, bottom: 40});
	
	
	
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
			btnImagen.setEnabled(false);
			btnImprimir.setEnabled(false);
			
			if (texto.length < 1) {
				tableModelBuscar.setDataAsMapArray([], true);
			} else if (texto.length >= 1) {
				var p = {};
				p.texto = texto;
				
				this.rpc = new inventario.comp.rpc.Rpc("services/", "comp.Inventario");
				this.rpc.addListener("completed", qx.lang.Function.bind(function(e){
					var data = e.getData();
					
					//alert(qx.lang.Json.stringify(data, null, 2));

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
	
	var btnCargar = new qx.ui.menu.Button("Cargar imagen...");
	btnCargar.setEnabled(false);
	btnCargar.addListener("execute", function(e){
		btnImagen.execute();
	});
	
	
	menuBuscar.add(btnCargar);
	menuBuscar.memorizar();
	
	
	
	
	//Tabla

	var tableModelBuscar = new qx.ui.table.model.Simple();
	tableModelBuscar.setColumns(["Descripción", "Tipo bien", "Uni.presu.", "Cod.barra", "Nro.serie", "Cod.QR", "Imagen", "Guarda custodia"], ["descrip", "tipo_bien_descrip", "uni_presu_descrip", "id_bien", "nro_serie", "codigo_qr", "imagen", "guarda_custodia"]);
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
		if (tblBuscar.getFocusedColumn() == 6) btnImagen.execute();
	});
	
	var tableColumnModelBuscar = tblBuscar.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatEnteroEs);
	//tableColumnModelBuscar.setDataCellRenderer(2, cellrendererNumber);
	
	var resizeBehaviorBuscar = tableColumnModelBuscar.getBehavior();
	resizeBehaviorBuscar.set(0, {width:"16%", minWidth:100});
	resizeBehaviorBuscar.set(1, {width:"12%", minWidth:100});
	resizeBehaviorBuscar.set(2, {width:"16%", minWidth:100});
	resizeBehaviorBuscar.set(3, {width:"10%", minWidth:100});
	resizeBehaviorBuscar.set(4, {width:"10%", minWidth:100});
	resizeBehaviorBuscar.set(5, {width:"12%", minWidth:100});
	resizeBehaviorBuscar.set(6, {width:"12%", minWidth:100});
	resizeBehaviorBuscar.set(7, {width:"12%", minWidth:100});
	
	var selectionModelBuscar = tblBuscar.getSelectionModel();
	selectionModelBuscar.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelBuscar.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelBuscar.isSelectionEmpty();
		
		if (! selectionEmpty) {
			focusedRow = tblBuscar.getFocusedRow();
			rowData = tableModelBuscar.getRowDataAsMap(focusedRow);
			
			btnCargar.setEnabled(! selectionEmpty);
			menuBuscar.memorizar([btnCargar]);
			
			btnImagen.setEnabled(true);
			btnImprimir.setEnabled(true);
			
			imgImagen.setSource("./services/documentos/cargos/" + rowData.id_bien + ".jpg" + "?" + Math.random());
		}
	});

	gbxBuscar.add(tblBuscar, {left: 0, top: 30, right: 0, bottom: 0});
	
	

	
	
	
	
	
	var btnImagen = new qx.ui.form.Button("Imagen...");
	btnImagen.setEnabled(false);
	btnImagen.addListener("execute", function(e){
		inp.click();
	});
	this.add(btnImagen, {right: "25%", top: 30});
	
	
	
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
		if (imgImagen.abrir) window.open(imgImagen.getSource());
		else {
			if (btnImagen.getEnabled()) btnImagen.execute();
		}
	});
	
	this.add(imgImagen, {right: "15%", top: 0});
	
	
	
	
	var btnImprimir = new qx.ui.form.Button("Imprimir código...");
	btnImprimir.setEnabled(false);
	btnImprimir.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=imprimir_codigo&fila=" + txtImprimir.getValue() + "&id_bien=" + rowData.id_bien);
	});
	this.add(btnImprimir, {left: 10, bottom: 0});
	
	var lblImprimir = new qx.ui.basic.Label("en fila");
	this.add(lblImprimir, {left: 130, bottom: 6});
	
	var txtImprimir = new qx.ui.form.Spinner(1, 1, 100);
	txtImprimir.setNumberFormat(application.numberformatEntero);
	this.add(txtImprimir, {left: 170, bottom: 3});
	


	
	
	
	//rbtA1.setTabIndex(1);
	//rbtA2.setTabIndex(2);
	//rbtA3.setTabIndex(3);

	
	},

	events : 
	{

	}
});