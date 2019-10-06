<?php

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_alta_modifica_uni_presu($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT id_uni_presu FROM uni_presu WHERE descrip='" . $p->model->descrip . "' AND id_uni_presu <> " . $p->model->id_uni_presu;
  	$rs = $this->mysqli->query($sql);
  	if ($rs->num_rows > 0) {
  		$error->SetError(0, "descrip");
  		return $error;
  	}
  	
	$id = $p->model->id_uni_presu;
	
	$set = $this->prepararCampos($p->model, "uni_presu");
	
	$this->mysqli->query("START TRANSACTION");
		
	if ($id == "0") {
		$sql = "INSERT uni_presu SET " . $set;
		$this->mysqli->query($sql);
		
		$id = $this->mysqli->insert_id;
		
		$this->auditoria($sql, $id, "insert_uni_presu");
	} else {
		$sql = "UPDATE uni_presu SET " . $set . " WHERE id_uni_presu=" . $id;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, $id, "update_uni_presu");
	}
	
	$this->mysqli->query("COMMIT");
	
	return $id;
  }
	
	
  public function method_alta_modifica_proveedor($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT id_proveedor FROM proveedor WHERE descrip='" . $p->model->descrip . "' AND id_proveedor <> " . $p->model->id_proveedor;
  	$rs = $this->mysqli->query($sql);
  	if ($rs->num_rows > 0) {
  		$error->SetError(0, "descrip");
  		return $error;
  	}
  	$sql = "SELECT id_proveedor FROM proveedor WHERE cuit='" . $p->model->cuit . "' AND id_proveedor <> " . $p->model->id_proveedor;
  	$rs = $this->mysqli->query($sql);
  	if ($rs->num_rows > 0) {
  		$error->SetError(0, "cuit");
  		return $error;
  	}
  	
	$id_proveedor = $p->model->id_proveedor;
	
	$set = $this->prepararCampos($p->model, "proveedor");
	
	$this->mysqli->query("START TRANSACTION");
		
	if ($id_proveedor == "0") {
		$sql = "INSERT proveedor SET " . $set;
		$this->mysqli->query($sql);
		
		$id_proveedor = $this->mysqli->insert_id;
		
		$this->auditoria($sql, $id_proveedor, "insert_proveedor");
	} else {
		$sql = "UPDATE proveedor SET " . $set . " WHERE id_proveedor=" . $id_proveedor;
		$this->mysqli->query($sql);
		
		$this->auditoria($sql, $id_proveedor, "update_proveedor");
	}
	
	$this->mysqli->query("COMMIT");
	
	return $id_proveedor;
  }
  
  
  public function method_leer_uni_presu($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM uni_presu WHERE id_uni_presu=" . $p->id_uni_presu;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	return $row;
  }
  
  
  public function method_leer_proveedor($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM proveedor WHERE id_proveedor=" . $p->id_proveedor;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	return $row;
  }
  
  
  public function method_leer_parametros_etiqueta($params, $error) {
  	
	$sql = "SELECT * FROM paramet WHERE id_paramet = 1";
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$json = json_decode($row->json);
	
	return $json->parametros_etiqueta;
  }
  
  
  public function method_escribir_parametros_etiqueta($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM paramet WHERE id_paramet = 1";
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$json = json_decode($row->json);
	
	$json->parametros_etiqueta = $p->model;
	$json = json_encode($json);
	
	$sql = "UPDATE paramet SET json='" . $json . "' WHERE id_paramet = 1";
	$this->mysqli->query($sql);
  }
	
	
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
