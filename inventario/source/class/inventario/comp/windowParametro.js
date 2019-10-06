qx.Class.define("inventario.comp.windowParametro",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Parámetros",
		width: 1000,
		height: 600,
		showMinimize: false
	});
	
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		tblUni_presu.focus();
	});
	
	
	
	var application = qx.core.Init.getApplication();
	
	/*
	var gbxUni_presu = new qx.ui.groupbox.GroupBox("Unidad presupuestaria");
	gbxUni_presu.setWidth(350);
	gbxUni_presu.setHeight(261);
	gbxUni_presu.setLayout(new qx.ui.layout.Grow());
	this.add(gbxUni_presu, {left: 0, top: 0, right: "66.5%", bottom: "51.5%"});
	
	var tableModelUni_presu = new qx.ui.table.model.Simple();
	tableModelUni_presu.setColumns(["Descripción"], ["descrip"]);
	tableModelUni_presu.setEditable(true);
	tableModelUni_presu.setColumnSortable(0, false);

	var tblUni_presu = new componente.comp.ui.ramon.table.tableParametro(tableModelUni_presu, "uni_presu");
	
	gbxUni_presu.add(tblUni_presu);
	*/
	
	
	
	
	var windowUni_presu = new inventario.comp.windowUni_presu();
	windowUni_presu.setModal(true);
	windowUni_presu.addListener("disappear", function(e){
		tblUni_presu.focus();
	});
	application.getRoot().add(windowUni_presu);
	
	
	var gbxUni_presu = new qx.ui.groupbox.GroupBox("Unidad presupuestaria");
	gbxUni_presu.setLayout(new qx.ui.layout.Grow());
	this.add(gbxUni_presu, {left: 0, top: 0, right: "66.5%", bottom: "51.5%"});
	
	var tableModelUni_presu = new qx.ui.table.model.Simple();
	tableModelUni_presu.setColumns(["Descripción", "Jefe unidad"], ["descrip", "jefe_unidad"]);
	tableModelUni_presu.setColumnSortable(0, false);
	tableModelUni_presu.setColumnSortable(1, false);

	var tblUni_presu = new componente.comp.ui.ramon.table.tableParametro(tableModelUni_presu, "uni_presu", windowUni_presu);
	
	gbxUni_presu.add(tblUni_presu);
	
	
	

	var windowProveedor = new inventario.comp.windowProveedor();
	windowProveedor.setModal(true);
	windowProveedor.addListener("disappear", function(e){
		tblProveedor.focus();
	});
	application.getRoot().add(windowProveedor);
	
	
	var gbxProveedor = new qx.ui.groupbox.GroupBox("Proveedor");
	gbxProveedor.setLayout(new qx.ui.layout.Grow());
	this.add(gbxProveedor, {left: "33.5%", top: 0, right: "33.5%", bottom: "51.5%"});
	
	var tableModelProveedor = new qx.ui.table.model.Simple();
	tableModelProveedor.setColumns(["Descripción", "CUIT"], ["descrip", "cuit"]);
	tableModelProveedor.setColumnSortable(0, false);
	tableModelProveedor.setColumnSortable(1, false);

	var tblProveedor = new componente.comp.ui.ramon.table.tableParametro(tableModelProveedor, "proveedor", windowProveedor);
	
	gbxProveedor.add(tblProveedor);
	
	
	

	var gbxTipo_bien = new qx.ui.groupbox.GroupBox("Tipo de bien");
	gbxTipo_bien.setWidth(350);
	gbxTipo_bien.setHeight(261);
	gbxTipo_bien.setLayout(new qx.ui.layout.Grow());
	this.add(gbxTipo_bien, {left: 0, top: "51.5%", right: "66.5%", bottom: 0});
	
	var tableModelTipo_bien = new qx.ui.table.model.Simple();
	tableModelTipo_bien.setColumns(["Descripción"], ["descrip"]);
	tableModelTipo_bien.setEditable(true);
	tableModelTipo_bien.setColumnSortable(0, false);

	var tblTipo_bien = new componente.comp.ui.ramon.table.tableParametro(tableModelTipo_bien, "tipo_bien");
	
	gbxTipo_bien.add(tblTipo_bien);
	
	
	
	var gbxTipo_alta = new qx.ui.groupbox.GroupBox("Tipo de alta");
	gbxTipo_alta.setWidth(350);
	gbxTipo_alta.setHeight(261);
	gbxTipo_alta.setLayout(new qx.ui.layout.Grow());
	this.add(gbxTipo_alta, {left: "33.5%", top: "51.5%", right: "33.5%", bottom: 0});
	
	var tableModelTipo_alta = new qx.ui.table.model.Simple();
	tableModelTipo_alta.setColumns(["Descripción"], ["descrip"]);
	tableModelTipo_alta.setEditable(true);
	tableModelTipo_alta.setColumnSortable(0, false);

	var tblTipo_alta = new componente.comp.ui.ramon.table.tableParametro(tableModelTipo_alta, "tipo_alta");
	
	gbxTipo_alta.add(tblTipo_alta);
	
	
	
	var gbxTipo_baja = new qx.ui.groupbox.GroupBox("Tipo de baja");
	gbxTipo_baja.setWidth(350);
	gbxTipo_baja.setHeight(261);
	gbxTipo_baja.setLayout(new qx.ui.layout.Grow());
	this.add(gbxTipo_baja, {left: "66.5%", top: "51.5%", right: 0, bottom: 0});
	
	var tableModelTipo_baja = new qx.ui.table.model.Simple();
	tableModelTipo_baja.setColumns(["Descripción"], ["descrip"]);
	tableModelTipo_baja.setEditable(true);
	tableModelTipo_baja.setColumnSortable(0, false);

	var tblTipo_baja = new componente.comp.ui.ramon.table.tableParametro(tableModelTipo_baja, "tipo_baja");
	
	gbxTipo_baja.add(tblTipo_baja);
	
	
	
	tblTipo_bien.setTabIndex(3);
	tblTipo_alta.setTabIndex(4);
	tblTipo_baja.setTabIndex(5);
	
	
	},
	members : 
	{

	}
});