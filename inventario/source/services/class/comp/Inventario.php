<?php

require("Base.php");

class class_Inventario extends class_Base
{
	
	
  public function method_alta_modifica_hoja_cargo($params, $error) {
  	$p = $params[0];
  	
	$id_hoja_cargo = $p->model->id_hoja_cargo;
	
	$this->mysqli->query("START TRANSACTION");
	
	if ($id_hoja_cargo == "0") {
		
		$p->model->fecha_verific = date("Y-m-d H:i:s");
		$p->model->usuario_verific = $_SESSION['login']->usuario;
		$p->model->estado = "V";
		
		$set = $this->prepararCampos($p->model, "hoja_cargo");
		
		$sql = "INSERT hoja_cargo SET " . $set;
		$this->mysqli->query($sql);
		$id_hoja_cargo = $this->mysqli->insert_id;
		
	} else {
		
		$p->model->usuario_carga = $_SESSION['login']->usuario;
		
		$set = $this->prepararCampos($p->model, "hoja_cargo");
		
		$sql = "UPDATE hoja_cargo SET " . $set . " WHERE id_hoja_cargo=" . $id_hoja_cargo;
		$this->mysqli->query($sql);
		
		
		
		/*
		$sql = "UPDATE bien SET codigo_barra = CONCAT(id_tipo_bien, id_bien), codigo_qr = CONCAT(id_bien, ' - ', descrip, ' - ', id_oas_usuario_alta) WHERE id_bien=" . $id_hoja_cargo;
		$this->mysqli->query($sql);
		*/
	}
	
	foreach ($p->eliminar as $item) {
		$sql = "DELETE FROM bien WHERE id_hoja_cargo_item=" . $item;
		$this->mysqli->query($sql);
		
		$sql = "DELETE FROM hoja_cargo_item WHERE id_hoja_cargo_item=" . $item;
		$this->mysqli->query($sql);
	}
	
	foreach ($p->agregar as $item) {
		
		$item->id_hoja_cargo = $id_hoja_cargo;
		
		$set = $this->prepararCampos($item, "hoja_cargo_item");
		
		$sql = "INSERT hoja_cargo_item SET " . $set;
		$this->mysqli->query($sql);
		$id_hoja_cargo_item = $this->mysqli->insert_id;
		
		for ($i = 1; $i <= $item->cantidad; $i++) {
			$sql = "INSERT bien SET nro_serie='', id_hoja_cargo_item=" . $id_hoja_cargo_item;
			$this->mysqli->query($sql);
			$id_bien = $this->mysqli->insert_id;
		}
	}
	
	$this->mysqli->query("COMMIT");

	return $id_hoja_cargo;
  }
  
  
  public function method_leer_hoja_cargo($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	$sql = "SELECT * FROM hoja_cargo WHERE id_hoja_cargo=" . $p->id_hoja_cargo;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$resultado->hoja_cargo = $row;

	$sql = "SELECT id_uni_presu AS model, descrip AS label FROM uni_presu WHERE id_uni_presu=" . $resultado->hoja_cargo->id_uni_presu;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$resultado->uni_presu = $row;
	
	$sql = "SELECT id_proveedor AS model, descrip AS label FROM proveedor WHERE id_proveedor=" . $resultado->hoja_cargo->id_proveedor;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$resultado->proveedor = $row;


	$resultado->hoja_cargo_item = array();
	
	$sql = "SELECT hoja_cargo_item.*, tipo_bien.descrip AS tipo_bien_descrip FROM hoja_cargo_item INNER JOIN tipo_bien USING(id_tipo_bien) WHERE id_hoja_cargo=" . $p->id_hoja_cargo;
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$row->cantidad = (int) $row->cantidad;
		
		$resultado->hoja_cargo_item[] = $row;
	}
	
	
	return $resultado;
  }
  
  
  public function method_leer_hojas_cargo($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT hoja_cargo.*, proveedor.descrip AS proveedor, uni_presu.descrip AS uni_presu FROM hoja_cargo LEFT JOIN proveedor USING(id_proveedor) LEFT JOIN uni_presu USING(id_uni_presu) ORDER BY fecha_verific DESC";
	
	return $this->toJson($sql);
  }
  
  
  public function method_leer_hoja_cargo_item($params, $error) {
  	$p = $params[0];
  	
	//$sql = "SELECT hoja_cargo_item.id_hoja_cargo_item, hoja_cargo_item.descrip AS hoja_cargo_item_descrip, tipo_bien.descrip AS tipo_bien_descrip, bien.id_bien, bien.nro_serie FROM hoja_cargo_item INNER JOIN tipo_bien USING(id_tipo_bien) INNER JOIN bien USING(id_hoja_cargo_item) WHERE id_hoja_cargo=" . $p->id_hoja_cargo . " ORDER BY hoja_cargo_item_descrip, tipo_bien_descrip, id_bien";
	$sql = "SELECT";
	$sql.= "  hoja_cargo_item.id_hoja_cargo_item";
	$sql.= ", hoja_cargo_item.descrip AS hoja_cargo_item_descrip";
	$sql.= ", tipo_bien.descrip AS tipo_bien_descrip";
	$sql.= ", bien.id_bien";
	$sql.= ", bien.nro_serie";
	$sql.= " FROM hoja_cargo_item";
	$sql.= "  INNER JOIN tipo_bien USING(id_tipo_bien)";
	$sql.= "  INNER JOIN bien USING(id_hoja_cargo_item)";
	$sql.= " WHERE id_hoja_cargo=" . $p->id_hoja_cargo;
	$sql.= " ORDER BY hoja_cargo_item_descrip, tipo_bien_descrip, id_bien";
	
	return $this->toJson($sql);
  }
  
  
  public function method_verificar_hoja_cargo($params, $error) {
  	$p = $params[0];
  	
  	$fecha = date("Y-m-d H:i:s");
  	
  	$this->mysqli->query("START TRANSACTION");
  	
  	
	$sql = "INSERT hoja_movimiento SET";
	$sql.= " id_uni_presu='" . $p->hoja_cargo->id_uni_presu . "'";
	$sql.= ", fecha_movimiento='" . $fecha . "'";
	$sql.= ", tipo_movimiento='A'";
	$sql.= ", expte_autoriza='" . $p->hoja_cargo->expte_compra . "'";
	$sql.= ", usuario_movimiento='" . $_SESSION['login']->usuario . "'";

	$this->mysqli->query($sql);
	$id_hoja_movimiento = $this->mysqli->insert_id;
	
	
	$sql = "UPDATE hoja_cargo SET ";
	$sql.= " fecha_carga='" . $fecha . "'";
	$sql.= ", usuario_carga='" . $_SESSION['login']->usuario . "'";
	$sql.= ", estado='C'";
	$sql.= " WHERE id_hoja_cargo=" . $p->hoja_cargo->id_hoja_cargo;

	$this->mysqli->query($sql);
	
	
	$sql = "SELECT * FROM hoja_cargo WHERE id_hoja_cargo=" . $p->hoja_cargo->id_hoja_cargo;
	$rs = $this->mysqli->query($sql);
	$rowHoja_cargo = $rs->fetch_object();
	
	
	foreach ($p->bien as $item) {
		$sql = "INSERT hoja_movimiento_item SET";
		$sql.= " id_hoja_movimiento='" . $id_hoja_movimiento . "'";
		$sql.= ", id_bien='" . $item->id_bien . "'";
		$sql.= ", guarda_custodia='" . $p->model->guarda_custodia . "'";
	
		$this->mysqli->query($sql);
		
		
		
		$sql = "SELECT * FROM bien WHERE id_bien=" . $item->id_bien;
		$rs = $this->mysqli->query($sql);
		$rowBien = $rs->fetch_object();
		
		$sql = "SELECT * FROM hoja_cargo_item WHERE id_hoja_cargo_item=" . $rowBien->id_hoja_cargo_item;
		$rs = $this->mysqli->query($sql);
		$rowHoja_cargo_item = $rs->fetch_object();
		
		
		$codigo_qr = $rowHoja_cargo->expte_compra . " - " . $rowHoja_cargo->expte_cobro . " - " . $p->model->guarda_custodia . " - " . $rowHoja_cargo->descrip;
		
		$sql = "UPDATE bien SET ";
		$sql.= "  nro_serie='" . $item->nro_serie . "'";
		$sql.= ", codigo_qr='" . $codigo_qr . "'";
		$sql.= " WHERE id_bien=" . $item->id_bien;
	
		$this->mysqli->query($sql);
	}
	
	
	
	$this->mysqli->query("COMMIT");
	
	
	return $p->hoja_cargo->id_hoja_cargo;
  }
  
  
  public function method_leer_hoja_movimiento($params, $error) {
  	$p = $params[0];
  	
  	//$resultado = new stdClass;
  	
	$sql = "SELECT";
	$sql.= "  hoja_cargo_item.descrip";
	$sql.= ", tipo_bien.descrip AS tipo_bien_descrip";
	$sql.= ", uni_presu.descrip AS uni_presu_descrip";
	$sql.= ", bien.id_bien";
	$sql.= ", bien.nro_serie";
	$sql.= ", bien.codigo_qr";
	$sql.= ", hoja_movimiento_item.guarda_custodia";
	$sql.= " FROM hoja_movimiento INNER JOIN hoja_movimiento_item USING(id_hoja_movimiento)";
	$sql.= "  INNER JOIN bien USING(id_bien)";
	$sql.= "  INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item)";
	$sql.= "  INNER JOIN tipo_bien USING(id_tipo_bien)";
	$sql.= "  LEFT JOIN uni_presu USING(id_uni_presu)";
	$sql.= " WHERE hoja_movimiento.id_hoja_movimiento=" . $p->id_hoja_movimiento;
	
	//$rs = $this->mysqli->query($sql);
	
	return $this->toJson($sql);
	//return $resultado;
  }
  
  
  
  public function method_leer_hojas_movimiento($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	$sql = "SELECT * FROM hoja_movimiento ORDER BY fecha_movimiento DESC";
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		
		if (! is_null($row->id_uni_presu_origen)) {
			$sql = "SELECT descrip FROM uni_presu WHERE id_uni_presu=" . $row->id_uni_presu_origen;
			$rsAux = $this->mysqli->query($sql);
			$rowAux = $rsAux->fetch_object();
			
			$row->uni_presu_origen_descrip = $rowAux->descrip;
		}
		
		if (! is_null($row->id_uni_presu)) {
			$sql = "SELECT descrip FROM uni_presu WHERE id_uni_presu=" . $row->id_uni_presu;
			$rsAux = $this->mysqli->query($sql);
			$rowAux = $rsAux->fetch_object();
			
			$row->uni_presu_descrip = $rowAux->descrip;
		}
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  
  public function method_escribir_hoja_movimiento($params, $error) {
  	$p = $params[0];
  	
	$p->model->fecha_movimiento = date("Y-m-d H:i:s");
	$p->model->usuario_movimiento = $_SESSION['login']->usuario;
	
	$set = $this->prepararCampos($p->model, "hoja_movimiento");
	
	
	$this->mysqli->query("START TRANSACTION");
	
	
	$sql = "INSERT hoja_movimiento SET " . $set;
	$this->mysqli->query($sql);
	$id_hoja_movimiento = $this->mysqli->insert_id;
	
	foreach ($p->hoja_movimiento_item as $item) {
		if ($p->model->tipo_movimiento == "B") $item->guarda_custodia = "";
		
		$sql = "INSERT hoja_movimiento_item SET id_hoja_movimiento=" . $id_hoja_movimiento . ", id_bien=" . $item->id_bien . ", guarda_custodia='" . $item->guarda_custodia . "'";
		$this->mysqli->query($sql);
	}
	
	
	$this->mysqli->query("COMMIT");
	
	return $id_hoja_movimiento;
  }
  
  
  public function method_leer_bienes($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
	$where = array();
	
	$aux = explode(" ", $p->texto);
	foreach ($aux as $item) {
		if ($item != "") {
			
			/*
			$sql = "SELECT";
			$sql.= "   bien.*";
			$sql.= " , hoja_cargo_item.descrip";
			$sql.= " , tipo_bien.descrip AS tipo_bien_descrip";
			$sql.= " FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien)";
			$sql.= " WHERE hoja_cargo_item.descrip LIKE '%" . $item . "%'";
			$sql.= "  OR id_bien LIKE '%" . $item . "%'";
			$sql.= "  OR nro_serie LIKE '%" . $item . "%'";
			$sql.= "  OR codigo_qr LIKE '%" . $item . "%'";
			*/
			
			
			$sql = " (hoja_cargo_item.descrip LIKE '%" . $item . "%'";
			$sql.= "  OR id_bien LIKE '%" . $item . "%'";
			$sql.= "  OR nro_serie LIKE '%" . $item . "%'";
			$sql.= "  OR codigo_qr LIKE '%" . $item . "%')";
			
			$where[] = $sql;
		}
	}
	
	
	$sql = "SELECT";
	$sql.= "   bien.*";
	$sql.= " , hoja_cargo_item.descrip";
	$sql.= " , tipo_bien.descrip AS tipo_bien_descrip";
	$sql.= " FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien)";
	$sql.= " WHERE ";
	$sql.= implode(" AND ", $where);
	$sql.= " ORDER BY descrip, tipo_bien_descrip, id_bien";

	
	/*
	$sql = "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE hoja_cargo_item.descrip LIKE '%" . $p->texto . "%'";
	$sql.= " UNION DISTINCT ";
	$sql.= "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE id_bien LIKE '%" . $p->texto . "%'";
	$sql.= " UNION DISTINCT ";
	$sql.= "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE nro_serie LIKE '%" . $p->texto . "%'";
	$sql.= " UNION DISTINCT ";
	$sql.= "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE codigo_qr LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY descrip, tipo_bien_descrip, id_bien";
	*/
	$rsBien = $this->mysqli->query($sql);
	
	while ($rowBien = $rsBien->fetch_object()) {
		$sql = "SELECT hoja_movimiento_item.guarda_custodia, hoja_movimiento.tipo_movimiento, uni_presu.descrip AS uni_presu_descrip";
		$sql.= " FROM hoja_movimiento_item INNER JOIN hoja_movimiento USING(id_hoja_movimiento) LEFT JOIN uni_presu USING(id_uni_presu)";
		$sql.= " WHERE id_bien=" . $rowBien->id_bien;
		$sql.= " ORDER BY id_hoja_movimiento DESC LIMIT 1";
		
		$rsAux = $this->mysqli->query($sql);
		if ($rsAux->num_rows > 0) {
			$rowAux = $rsAux->fetch_object();
			
			if ($rowAux->tipo_movimiento != "B") {
				$rowBien->uni_presu_descrip = $rowAux->uni_presu_descrip;
				$rowBien->guarda_custodia = $rowAux->guarda_custodia;
			
				$resultado[] = $rowBien;
			}
		}
	}
	
	return $resultado;
  }
  
  
  public function method_leer_bienes_todos($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
	$where = array();
	
	$aux = explode(" ", $p->texto);
	foreach ($aux as $item) {
		if ($item != "") {
			
			/*
			$sql = "SELECT";
			$sql.= "   bien.*";
			$sql.= " , hoja_cargo_item.descrip";
			$sql.= " , tipo_bien.descrip AS tipo_bien_descrip";
			$sql.= " FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien)";
			$sql.= " WHERE hoja_cargo_item.descrip LIKE '%" . $item . "%'";
			$sql.= "  OR id_bien LIKE '%" . $item . "%'";
			$sql.= "  OR nro_serie LIKE '%" . $item . "%'";
			$sql.= "  OR codigo_qr LIKE '%" . $item . "%'";
			*/
			
			
			$sql = " (hoja_cargo_item.descrip LIKE '%" . $item . "%'";
			$sql.= "  OR id_bien LIKE '%" . $item . "%'";
			$sql.= "  OR nro_serie LIKE '%" . $item . "%'";
			$sql.= "  OR codigo_qr LIKE '%" . $item . "%')";
			
			$where[] = $sql;
		}
	}
	
	
	$sql = "SELECT";
	$sql.= "   bien.*";
	$sql.= " , hoja_cargo_item.descrip";
	$sql.= " , tipo_bien.descrip AS tipo_bien_descrip";
	$sql.= " FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien)";
	$sql.= " WHERE ";
	$sql.= implode(" AND ", $where);
	$sql.= " ORDER BY descrip, tipo_bien_descrip, id_bien";

	
	/*
	$sql = "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE hoja_cargo_item.descrip LIKE '%" . $p->texto . "%'";
	$sql.= " UNION DISTINCT ";
	$sql.= "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE id_bien LIKE '%" . $p->texto . "%'";
	$sql.= " UNION DISTINCT ";
	$sql.= "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE nro_serie LIKE '%" . $p->texto . "%'";
	$sql.= " UNION DISTINCT ";
	$sql.= "SELECT bien.*, hoja_cargo_item.descrip, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) WHERE codigo_qr LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY descrip, tipo_bien_descrip, id_bien";
	*/
	$rsBien = $this->mysqli->query($sql);
	
	while ($rowBien = $rsBien->fetch_object()) {
		$sql = "SELECT hoja_movimiento_item.guarda_custodia, hoja_movimiento.tipo_movimiento, uni_presu.descrip AS uni_presu_descrip";
		$sql.= " FROM hoja_movimiento_item INNER JOIN hoja_movimiento USING(id_hoja_movimiento) LEFT JOIN uni_presu USING(id_uni_presu)";
		$sql.= " WHERE id_bien=" . $rowBien->id_bien;
		$sql.= " ORDER BY id_hoja_movimiento DESC LIMIT 1";
		
		$rsAux = $this->mysqli->query($sql);
		if ($rsAux->num_rows > 0) {
			$rowAux = $rsAux->fetch_object();
			
			if ($rowAux->tipo_movimiento != "B") {
				$rowBien->uni_presu_descrip = $rowAux->uni_presu_descrip;
				$rowBien->guarda_custodia = $rowAux->guarda_custodia;
			}
			
			$resultado[] = $rowBien;
		}
	}
	
	return $resultado;
  }
  
  
  public function method_alta_modifica_bien($params, $error) {
  	$p = $params[0];
  	
  	$resultado = null;
  	
	$set = $this->prepararCampos($p->model, "bien");
	$resultado = $p->model->id_bien;
	if ($resultado=="0") {
		$resultado = array();
		for ($i=0; $i < $p->model->cantidad; $i++) {
			$sql = "INSERT bien SET " . $set . ", nro_serie='" . $p->nro_serie[$i]->nro_serie . "', fecha_alta=NOW()";
			$this->mysqli->query($sql);
			$insert_id = $this->mysqli->insert_id;
			$resultado[] = $insert_id;
			
			$sql = "UPDATE bien SET codigo_barra = CONCAT(id_tipo_bien, id_bien), codigo_qr = CONCAT(id_bien, ' - ', descrip, ' - ', id_oas_usuario_alta) WHERE id_bien=" . $insert_id;
			$this->mysqli->query($sql);
			
			
			$sql = "INSERT movimiento SET id_bien=" . $insert_id . ", tipo_movimiento='A', fecha_movimiento=NOW(), id_organismo_area_servicio_destino='" . $p->model->id_organismo_area_servicio_destino . "', id_oas_usuario_movimiento='" . $p->model->id_oas_usuario_alta . "'";
			$this->mysqli->query($sql);
		}
	} else {
		$sql = "UPDATE bien SET " . $set . " WHERE id_bien=" . $resultado;
		$this->mysqli->query($sql);
		
		$sql = "UPDATE bien SET codigo_barra = CONCAT(id_tipo_bien, id_bien), codigo_qr = CONCAT(id_bien, ' - ', descrip, ' - ', id_oas_usuario_alta) WHERE id_bien=" . $resultado;
		$this->mysqli->query($sql);
	}

	return $resultado;
  }
  
  
  public function method_baja_bien($params, $error) {
  	$p = $params[0];
  	
  	$resultado = null;
  	
	$set = $this->prepararCampos($p->model, "bien");
	$resultado = $p->model->id_bien;

	$sql = "UPDATE bien SET " . $set . ", fecha_baja=NOW() WHERE id_bien='" . $resultado . "'";
	$this->mysqli->query($sql);
	
	$sql = "SELECT id_organismo_area_servicio_destino FROM movimiento WHERE id_bien=" . $resultado . " ORDER BY id_movimiento DESC LIMIT 1";
	$rsAux = $this->mysqli->query($sql);
	$rowAux = $rsAux->fetch_object();

	$sql = "INSERT movimiento SET id_bien=" . $resultado . ", tipo_movimiento='B', fecha_movimiento=NOW(), id_organismo_area_servicio_origen=" . $rowAux->id_organismo_area_servicio_destino . ", id_oas_usuario_movimiento='" . $p->model->id_oas_usuario_baja . "'";
	$this->mysqli->query($sql);

	return $resultado;
  }
  
  
  public function method_leer_bien($params, $error) {
  	$p = $params[0];
  	
	$resultado = new stdClass();
	$sql = "SELECT * FROM bien WHERE id_bien='" . $p->id_bien . "'";
	$resultado->model = $this->toJson($sql);
	$resultado->model = $resultado->model[0];
	
	return $resultado;
  }
  
  
  public function method_alta_movimiento($params, $error) {
	$p = $params[0];
	
	$sql = "INSERT movimiento SET id_bien=" . $p->id_bien . ", tipo_movimiento='P', fecha_movimiento=NOW(), id_organismo_area_servicio_origen='" . $p->id_organismo_area_servicio_origen . "', id_organismo_area_servicio_destino='" . $p->id_organismo_area_servicio_destino . "', id_oas_usuario_movimiento='" . $p->id_oas_usuario_movimiento . "'";
	$this->mysqli->query($sql);
  }
  
  
  public function method_autocompletarOAS($params, $error) {
  	$p = $params[0];
	//$sql = "SELECT descrip AS label, id_motivo AS model FROM motivo WHERE descrip LIKE '%" . $p . "%' ORDER BY label";
	//$sql = "SELECT CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label, _organismos_areas_servicios.id_organismo_area_servicio AS model FROM (salud1._organismos_areas_servicios INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas.organismo_area_id='" . $p->parametros->organismo_area_id . "' AND _organismos_areas.organismo_area LIKE '%" . $p->texto . "%' ORDER BY label";
	$sql = "SELECT CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label, _organismos_areas_servicios.id_organismo_area_servicio AS model FROM (salud1._organismos_areas_servicios INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas.organismo_area_id='" . $p->parametros->organismo_area_id . "' AND (_organismos_areas.organismo_area LIKE '%" . $p->texto . "%' OR _servicios.denominacion LIKE '%" . $p->texto . "%') ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_parametros_inicio($params, $error) {
  	$resultado = new stdClass;
  	
	$resultado->tipo_bien = $this->toJson("SELECT * FROM tipo_bien ORDER BY descrip");
	$resultado->tipo_alta = $this->toJson("SELECT * FROM tipo_alta ORDER BY descrip");
	$resultado->tipo_baja = $this->toJson("SELECT * FROM tipo_baja ORDER BY descrip");

	return $resultado;
  }

}

?>
