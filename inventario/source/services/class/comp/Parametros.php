<?php

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_autocompletarTipo_bien($params, $error) {
	$p = $params[0];

	$sql = "SELECT descrip AS label, id_tipo_bien AS model FROM tipo_bien WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarUni_presu($params, $error) {
	$p = $params[0];

	$sql = "SELECT descrip AS label, id_uni_presu AS model FROM uni_presu WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarProveedor($params, $error) {
	$p = $params[0];

	$sql = "SELECT descrip AS label, id_proveedor AS model FROM proveedor WHERE descrip LIKE '%" . $p->texto . "%' ORDER BY label";
	
	return $this->toJson($sql);
  }
}

?>
