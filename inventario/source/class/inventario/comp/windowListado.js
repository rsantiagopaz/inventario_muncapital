qx.Class.define("inventario.comp.windowListado",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Listado",
		width: 465,
		height: 350,
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
			cboUni_presu.setEnabled(true);
			cboTipo_bien.setEnabled(true);
			cboDepartamento.setEnabled(false);
			cboResponsable.setEnabled(false);
			
			dtfDesde.setEnabled(false);
			dtfHasta.setEnabled(false);
		}
	});
	
	
	composite.add(rbtA1, {row: 0, column: 0});
	rgpA.add(rbtA1);

	
	var rbtA2 = new qx.ui.form.RadioButton("Vehículos").set({value: true});
	rbtA2.addListener("changeValue", function(e){
		var data = e.getData();

		if (data) {
			cboUni_presu.setEnabled(true);
			cboTipo_bien.setEnabled(true);
			cboDepartamento.setEnabled(true);
			cboResponsable.setEnabled(false);
			
			dtfDesde.setEnabled(false);
			dtfHasta.setEnabled(false);
		}
	});
	
	//composite.add(rbtA2, {row: 2, column: 0});
	rgpA.add(rbtA2);
	
	
	var rbtA3 = new qx.ui.form.RadioButton("Responsables").set({value: true});
	rbtA3.addListener("changeValue", function(e){
		var data = e.getData();
		
		if (data) {
			cboUni_presu.setEnabled(false);
			cboTipo_bien.setEnabled(false);
			cboDepartamento.setEnabled(false);
			cboResponsable.setEnabled(true);
			
			dtfDesde.setEnabled(false);
			dtfHasta.setEnabled(false);
		}
	});
	
	//composite.add(rbtA3, {row: 3, column: 0});
	rgpA.add(rbtA3);
	
	
	
	
	composite.add(new qx.ui.basic.Label("Uni.presu.: "), {row: 0, column: 2});
	var cboUni_presu = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarUni_presu"});
	var lstUni_presu = cboUni_presu.getChildControl("list");
	composite.add(cboUni_presu, {row: 0, column: 3, colSpan: 3});
	
	
	composite.add(new qx.ui.basic.Label("Tipo bien: "), {row: 1, column: 2});
	var cboTipo_bien = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarTipo_bien"});
	var lstTipo_bien = cboTipo_bien.getChildControl("list");
	composite.add(cboTipo_bien, {row: 1, column: 3, colSpan: 3});
	
	
	

	
	//composite.add(new qx.ui.basic.Label("Departamento: "), {row: 2, column: 2});
	var cboDepartamento = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarDepartamento"});
	var lstDepartamento = cboDepartamento.getChildControl("list");
	//composite.add(cboDepartamento, {row: 2, column: 3, colSpan: 3});
	
	

	//composite.add(new qx.ui.basic.Label("Responsable: "), {row: 3, column: 2});
	var cboResponsable = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Responsable", methodName: "autocompletarResponsable"});
	var lstResponsable = cboResponsable.getChildControl("list");
	//composite.add(cboResponsable, {row: 3, column: 3, colSpan: 3});
	

	
	
	
	//composite.add(new qx.ui.basic.Label("Departamento: "), {row: 3, column: 2});
	
	
	
	
	
	
	
	
	
	
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

		if (rbtA1.getValue()) {
			txt = "?rutina=inventario";
			
		} else if (rbtA2.getValue()) {
			txt = "?rutina=vehiculos";
			
		} else if (rbtA3.getValue()) {
			txt = "?rutina=responsables";
		}
		
		if (cboUni_presu.getEnabled()) {
			if (! lstUni_presu.isSelectionEmpty()) txt+= "&id_uni_presu=" + lstUni_presu.getModelSelection().getItem(0);
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
	cboUni_presu.setTabIndex(4);
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