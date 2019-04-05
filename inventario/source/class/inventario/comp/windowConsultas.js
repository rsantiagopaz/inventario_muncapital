qx.Class.define("inventario.comp.windowConsultas",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (appMain)
	{
		this.base(arguments);

	this.set({
		caption: "Consultas",
		width: 540,
		height: 300,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(){
		rb1.focus();
	});
	
	
	
 
var rb1 = new qx.ui.form.RadioButton("Inventario tipo bien:");
rb1.addListener("changeValue", function(e){
	if (e.getData()) {

	}
});
var rb2 = new qx.ui.form.RadioButton("Inventario OAS:");
rb2.addListener("changeValue", function(e){
	if (e.getData()) {
		
	}
});
var rb3 = new qx.ui.form.RadioButton("Inventario hospital");
rb3.addListener("changeValue", function(e){
	if (e.getData()) {
		
	}
});

var rb4 = new qx.ui.form.RadioButton("Listado altas");
rb4.addListener("changeValue", function(e){
	var bool = (e.getData() || rb5.getValue());
	dtfDesde.setEnabled(bool);
	dtfHasta.setEnabled(bool);
});

var rb5 = new qx.ui.form.RadioButton("Listado bajas");
rb5.addListener("changeValue", function(e){
	var bool = (e.getData() || rb4.getValue());
	dtfDesde.setEnabled(bool);
	dtfHasta.setEnabled(bool);
});

var rb6 = new qx.ui.form.RadioButton("Listado x proveedor");
rb5.addListener("changeValue", function(e){

});

	
	this.add(rb1, {left: 0, top: 10});
	
	var slbTipo_bien = new qx.ui.form.SelectBox();
	this.add(slbTipo_bien, {left: 130, top: 10, right: 0});
	
	rb1.bind("value", slbTipo_bien, "enabled");
	
	this.add(rb2, {left: 0, top: 50});
	
	//var cboOrganismoAreaOrigen = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Inventario", "autocompletarOAS", {organismo_area_id: appMain.rowOrganismo_area.organismo_area_id});
	var cboOrganismoAreaOrigen = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Inventario", methodName: "autocompletarOAS"}, {organismo_area_id: appMain.rowOrganismo_area.organismo_area_id});
	var lstOrganismoAreaOrigen = cboOrganismoAreaOrigen.getChildControl("list");
	this.add(cboOrganismoAreaOrigen, {left: 130, top: 50, right: 0});
	
	rb2.bind("value", cboOrganismoAreaOrigen, "enabled");
	
	
	this.add(rb3, {left: 0, top: 90});
	
	
	this.add(rb4, {left: 0, top: 130});
	this.add(rb5, {left: 100, top: 130});
	
	this.add(new qx.ui.basic.Label("Desde:"), {left: 210, top: 130});
	
	var dtfDesde = new qx.ui.form.DateField()
	dtfDesde.setEnabled(false);
	//dtfDesde.setValue(new Date());
	dtfDesde.setWidth(90);
	this.add(dtfDesde, {left: 250, top: 127});
	
	this.add(new qx.ui.basic.Label("Hasta:"), {left: 360, top: 130});
	
	var dtfHasta = new qx.ui.form.DateField()
	dtfHasta.setEnabled(false);
	dtfHasta.setValue(new Date());
	dtfHasta.setWidth(90);
	this.add(dtfHasta, {left: 400, top: 127});
	
	dtfDesde.setValue(new Date(dtfHasta.getValue() - 1000 * 60 * 60 * 24 * 30));
	
	this.add(rb6, {left: 0, top: 170});
	
	var txtProveedor = new qx.ui.form.TextField("");
	this.add(txtProveedor, {left: 130, top: 170, right: 0});
	
	rb6.bind("value", txtProveedor, "enabled");
	
	
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.Inventario");
	try {
		var resultado = rpc.callSync("leer_parametros_inicio");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x in resultado.tipo_bien) {
		slbTipo_bien.add(new qx.ui.form.ListItem(resultado.tipo_bien[x].descrip, null, resultado.tipo_bien[x].id_tipo_bien));
	}
	
	

	var commandEsc = new qx.ui.command.Command("Esc");
	this.registrarCommand(commandEsc);
	commandEsc.addListener("execute", function(e){
		btnCancelar.fireEvent("execute");
	});
	
	var btnAceptar = new qx.ui.form.Button("Ver");
	btnAceptar.addListener("execute", function(e){
		cboOrganismoAreaOrigen.setValid(true);
		dtfDesde.setValid(true);
		dtfHasta.setValid(true);
		if (rb1.getValue() && slbTipo_bien.isSelectionEmpty()) {

		}else if (rb2.getValue() && lstOrganismoAreaOrigen.isSelectionEmpty()) {
			cboOrganismoAreaOrigen.setInvalidMessage("Debe seleccionar Org/Area");
			cboOrganismoAreaOrigen.setValid(false);
			cboOrganismoAreaOrigen.focus();
		} else if (dtfHasta.getValue() - dtfDesde.getValue() < 0) {
			dtfDesde.setInvalidMessage("Intervalo definido incorrectamente");
			dtfHasta.setInvalidMessage("Intervalo definido incorrectamente");
			dtfDesde.setValid(false);
			dtfHasta.setValid(false);
			dtfDesde.focus();
		} else {
			var desde = dtfDesde.getValue();
			var hasta = dtfHasta.getValue();
			desde = desde.getFullYear() + "-" + qx.lang.String.pad(String(desde.getMonth() + 1), 2, "0") + "-" + qx.lang.String.pad(String(desde.getDate()), 2, "0");
			hasta = hasta.getFullYear() + "-" + qx.lang.String.pad(String(hasta.getMonth() + 1), 2, "0") + "-" + qx.lang.String.pad(String(hasta.getDate()), 2, "0");
			if (rb1.getValue()) {
				window.open("services/class/comp/Impresion.php?rutina=inventario_tipo_bien&organismo_area_id=" + appMain.rowOrganismo_area.organismo_area_id + "&id_tipo_bien=" + slbTipo_bien.getModelSelection().getItem(0));
			} else if (rb2.getValue()) {
				window.open("services/class/comp/Impresion.php?rutina=inventario_OAS&organismo_area_id=" + appMain.rowOrganismo_area.organismo_area_id + "&id_organismo_area_servicio=" + lstOrganismoAreaOrigen.getModelSelection().getItem(0) + "&descrip=" + cboOrganismoAreaOrigen.getValue());
			} else if (rb3.getValue()) {
				window.open("services/class/comp/Impresion.php?rutina=inventario_hospital&organismo_area_id=" + appMain.rowOrganismo_area.organismo_area_id + "&descrip=" + appMain.rowOrganismo_area.organismo_area_descrip);
			} else if (rb4.getValue()) {
				window.open("services/class/comp/Impresion.php?rutina=listado_ab&organismo_area_id=" + appMain.rowOrganismo_area.organismo_area_id + "&tipo_movimiento=A&desde=" + desde + "&hasta=" + hasta);
			} else if (rb5.getValue()) {
				window.open("services/class/comp/Impresion.php?rutina=listado_ab&organismo_area_id=" + appMain.rowOrganismo_area.organismo_area_id + "&tipo_movimiento=B&desde=" + desde + "&hasta=" + hasta);
			} else if (rb6.getValue()) {
				window.open("services/class/comp/Impresion.php?rutina=listado_proveedor&organismo_area_id=" + appMain.rowOrganismo_area.organismo_area_id + "&descrip=" + txtProveedor.getValue());
			}
		}
	}, this);

	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: 170, bottom: 5});
	this.add(btnCancelar, {left: 310, bottom: 5});
	
	var rgp = new qx.ui.form.RadioGroup(rb1, rb2, rb3, rb4, rb5, rb6);
	
	},
	members : 
	{

	}
});