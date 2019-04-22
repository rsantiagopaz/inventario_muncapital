<?php

class class_ControlAcceso
{
	protected $mysqli;
	
	function __construct() {
		require('Conexion.php');
		
		//session_unset();
		//session_destroy();
		session_start();
		
		$_SESSION["inventario_LAST_ACTIVITY"] = (int) $_SERVER["REQUEST_TIME"];
		$_SESSION["cookie_lifetime"] = (int) ini_get("session.cookie_lifetime");
		$_SESSION["gc_maxlifetime"] = (int) ini_get("session.gc_maxlifetime");

		
		
		$this->mysqli = new mysqli("$servidor2", "$usuario2", "$password2", "$base2");
		$this->mysqli->query("SET NAMES 'utf8'");
	}
	
	
  public function method_leer_version($params, $error) {
  	
  	$aux = new stdClass;
  	$aux->id_version = 1;
	
	return $aux;
  }


  public function method_login($params, $error) {
  	$p = $params[0];

	/*  	
	$resultado = new stdClass;

	$resultado->ok = "¡¡Bienvenido ".$_SESSION['usuario_nombre']." (".$SYSusuario.")!!\n\n";
	$resultado->ok.="Puede comenzar a trabajar. Recuerde CERRAR SESION cuando termine o si desea cambiar de usuario.\n\n";
	$resultado->ok.="¡NUNCA DEJE EL NAVEGADOR ABIERTO Y SE RETIRE!";
	$resultado->_sistema_id = $SYSsistema_id;
	$resultado->_usuario = $_SESSION['usuario'];
	$resultado->_usuario_id = $_SESSION['usuario_id'];
	$resultado->_usuario_nombre = $_SESSION['usuario_nombre'];
	$resultado->_usuario_estado = $_SESSION['usuario_estado'];
	$resultado->_sesion_id = $_SESSION['SYSsesion_id'];
	$resultado->_autorizado = true;
	$resultado->_usuario_organismo_id = $_SESSION['usuario_organismo_id'];
	$resultado->_usuario_nivel_id = $_SESSION['usuario_nivel_id'];
	$resultado->_usuario_organismo = $_SESSION['usuario_organismo'];
	$resultado->_usuario_organismo_area_id = $_SESSION['usuario_organismo_area_id'];
	$resultado->_usuario_organismo_area = $_SESSION['usuario_organismo_area'];
	$resultado->_usuario_sistemas_perfiles = $_SESSION['sistemas_perfiles_usuario'];
	$resultado->_usuario_organismo_area_mesa_entradas = ((empty($_SESSION['usuario_organismo_area_mesa_entrada'])) ? "0" : $_SESSION['usuario_organismo_area_mesa_entrada']);

	return $resultado;
	*/

	
	$_SESSION['login'] = $p->model;
  }
  
  
  public function method_traer_areas($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
		$sql = "SELECT * FROM _usuarios";
		$sql.= " LEFT JOIN _organismos_areas_usuarios ON _organismos_areas_usuarios.SYSusuario = _usuarios.SYSusuario";
		$sql.= " LEFT JOIN _organismos_areas ON _organismos_areas.organismo_area_id = _organismos_areas_usuarios.organismo_area_id";
		//$sql.= " INNER JOIN parque ON BINARY parque.organismo_area_id = BINARY _organismos_areas_usuarios.organismo_area_id";
		$sql.= " LEFT JOIN _organismos ON _organismos.organismo_id = _organismos_areas.organismo_id";
		$sql.= " WHERE _usuarios.SYSusuario = BINARY '" . $p->usuario . "' AND _usuarios.SYSpassword = '" . md5($p->password) . "' AND _usuarios.SYSusuario_estado=1";
	
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$perfiles = new stdClass;
		
		$sql = "SELECT perfil_id FROM _sistemas_perfiles_usuarios WHERE SYSusuario='" . $row->SYSusuario . "'";
		$rsPerfil = $this->mysqli->query($sql);
		while ($rowPerfil = $rsPerfil->fetch_object()) {
			$perfiles->{$rowPerfil->perfil_id} = true;
		}
		
		$rowAux = new stdClass;
		
		$rowAux->perfiles = $perfiles;
		
		$rowAux->model = $row->organismo_area_id;
		$rowAux->label = $row->organismo_area . " - " . $row->organismo;
		
		$resultado[] = $rowAux;
	}
	
	return $resultado;
  }
}

?>