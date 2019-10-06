/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "inventario"
 *
 * @asset(inventario/*)
 */
qx.Class.define("inventario.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */


      
      
      
      
      
      // Document is the application root
      var doc = this.getRoot();
	
      doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
      
    
      
      var win = new inventario.comp.windowLogin("Identificación de usuario", false);
      win.setModal(true);
      win.addListenerOnce("appear", function(e){
        win.center();
      });
      win.addListener("aceptado", function(e){
        var data = e.getData();
        
        this.login = data;
        //alert(qx.lang.Json.stringify(data, null, 2));
        
        this._InitAPP();
      }, this)
      //doc.add(win);
      //win.center();
      win.open();
      
    },
	_InitAPP : function ()
	{
	var doc = this.getRoot();
	
	
	
      var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
      numberformatMontoEs.setGroupingUsed(true);
      numberformatMontoEs.setMaximumFractionDigits(2);
      numberformatMontoEs.setMinimumFractionDigits(2);
      
      var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
      numberformatMontoEn.setGroupingUsed(false);
      numberformatMontoEn.setMaximumFractionDigits(2);
      numberformatMontoEn.setMinimumFractionDigits(2);
      
      var numberformatEntero = this.numberformatEntero = new qx.util.format.NumberFormat("en");
      numberformatEntero.setGroupingUsed(false);
      numberformatEntero.setMaximumFractionDigits(0);
      numberformatEntero.setMinimumFractionDigits(0);
	
	
	

	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this._tabviewMain = new qx.ui.tabview.TabView();
	
	var page = {};
	
	contenedorMain.add(tabviewMain);
	
	
	
      var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
      numberformatMontoEs.setGroupingUsed(true);
      numberformatMontoEs.setMaximumFractionDigits(2);
      numberformatMontoEs.setMinimumFractionDigits(2);
      
      var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
      numberformatMontoEn.setGroupingUsed(false);
      numberformatMontoEn.setMaximumFractionDigits(2);
      numberformatMontoEn.setMinimumFractionDigits(2);
      
      var numberformatEnteroEs = this.numberformatEnteroEs = new qx.util.format.NumberFormat("es");
      numberformatEnteroEs.setGroupingUsed(true);
      numberformatEnteroEs.setMaximumFractionDigits(0);
      numberformatEnteroEs.setMinimumFractionDigits(0);
      
      var numberformatEnteroEn = this.numberformatEnteroEn = new qx.util.format.NumberFormat("en");
      numberformatEnteroEn.setGroupingUsed(false);
      numberformatEnteroEn.setMaximumFractionDigits(0);
      numberformatEnteroEn.setMinimumFractionDigits(0);
      
	
	
	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		var win = new inventario.comp.windowAcercaDe();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuArchivo.add(btnAcercaDe);
	
	var mnuEdicion = new qx.ui.menu.Menu();
	
	var btnParametros = new qx.ui.menu.Button("Parámetros...");
	btnParametros.addListener("execute", function(e){
		var win = new inventario.comp.windowParametro();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuEdicion.add(btnParametros);
	
	var btnParametrosEtiq = new qx.ui.menu.Button("Parámetros etiqueta...");
	btnParametrosEtiq.addListener("execute", function(e){
		var win = new inventario.comp.windowEtiqueta();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuEdicion.add(btnParametrosEtiq);
	
	var btnImagenes = new qx.ui.menu.Button("Imágenes...");
	btnImagenes.addListener("execute", function(e){
		var win = new inventario.comp.windowImagenes();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuEdicion.add(btnImagenes);
	
	

	var mnuVer = new qx.ui.menu.Menu();
	
	var btnHoja_cargo = new qx.ui.menu.Button("Hoja cargo");
	btnHoja_cargo.addListener("execute", function(e){
		if (page["pageHoja_cargo"]==null) {
			page["pageHoja_cargo"] = new inventario.comp.pageHoja_cargo();
			page["pageHoja_cargo"].addListenerOnce("close", function(e){
				page["pageHoja_cargo"] = null;
			});
			tabviewMain.add(page["pageHoja_cargo"]);				
		} 
		tabviewMain.setSelection([page["pageHoja_cargo"]])
	}, this);
	mnuVer.add(btnHoja_cargo);
	
	var btnHoja_movimiento = new qx.ui.menu.Button("Hoja movimiento");
	btnHoja_movimiento.addListener("execute", function(e){
		if (page["pageHoja_movimiento"]==null) {
			page["pageHoja_movimiento"] = new inventario.comp.pageHoja_movimiento();
			page["pageHoja_movimiento"].addListenerOnce("close", function(e){
				page["pageHoja_movimiento"] = null;
			});
			tabviewMain.add(page["pageHoja_movimiento"]);				
		} 
		tabviewMain.setSelection([page["pageHoja_movimiento"]])
	}, this);
	mnuVer.add(btnHoja_movimiento);

	var btnConsultas = new qx.ui.menu.Button("Consultas");
	//btnConsultas.setEnabled(this.login.perfiles["039003"] != null);
	btnConsultas.addListener("execute", function(e){
		var win = new inventario.comp.windowConsultas(this);
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	//mnuVer.add(btnConsultas);
	
	var btnListado = new qx.ui.menu.Button("Listado...");
	btnListado.addListener("execute", function(e){
		var win = new inventario.comp.windowListado();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuVer.add(btnListado);
	
	
	var mnuSesion = new qx.ui.menu.Menu();

	var btnCerrar = new qx.ui.menu.Button("Cerrar");
	btnCerrar.addListener("execute", function(e){
		/*
		var rpc = new qx.io.remote.Rpc();
		rpc.setTimeout(10000);
		rpc.setUrl("services/");
		rpc.setServiceName("comp.turnos.login");
		var result = rpc.callSync("Logout");
		*/
		
		location.reload(true);
		//viaticos.Application.Login("Identificacion de Usuario", "", this._InitAPP, this);
	}, this);
	mnuSesion.add(btnCerrar);
	
	
	var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
	var mnubtnEdicion = new qx.ui.toolbar.MenuButton('Edición');
	var mnubtnVer = new qx.ui.toolbar.MenuButton('Ver');
	var mnubtnSesion = new qx.ui.toolbar.MenuButton('Sesión');
	
	mnubtnArchivo.setMenu(mnuArchivo);
	mnubtnEdicion.setMenu(mnuEdicion);
	mnubtnVer.setMenu(mnuVer);
	mnubtnSesion.setMenu(mnuSesion);
	  
	var toolbarMain = new qx.ui.toolbar.ToolBar();
	toolbarMain.add(mnubtnArchivo);
	toolbarMain.add(mnubtnEdicion);
	toolbarMain.add(mnubtnVer);
	toolbarMain.add(mnubtnSesion);
	
	doc.add(toolbarMain, {left: 5, top: 2, right: "50%"});
	
	doc.add(new qx.ui.basic.Label("Org/Area: " + this.login.label), {left: "51%", top: 2});
	doc.add(new qx.ui.basic.Label("Usuario: " + this.login.usuario), {left: "51%", top: 22});
	
	doc.add(contenedorMain, {left: 0, top: 38, right: 0, bottom: 0});
	}
  }
});
