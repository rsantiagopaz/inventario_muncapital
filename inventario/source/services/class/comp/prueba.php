<?php


$servidor = "localhost";
$usuario = "UD330650";
$password = "U@Q330651";
$base = "inventario";


$servidor2 = "172.16.1.251";
$usuario2 = "UD330550";
$password2 = "U@P330551";
$base2 = "intranet";
		
$mysqli = new mysqli("$servidor2", "$usuario2", "$password2", "$base2");
$mysqli->query("SET NAMES 'utf8'");


  	
  	
		$sql = "SELECT * FROM _usuarios";
		$sql.= " LEFT JOIN _organismos_areas_usuarios ON _organismos_areas_usuarios.SYSusuario = _usuarios.SYSusuario";
		$sql.= " LEFT JOIN _organismos_areas ON _organismos_areas.organismo_area_id = _organismos_areas_usuarios.organismo_area_id";
		//$sql.= " INNER JOIN parque ON BINARY parque.organismo_area_id = BINARY _organismos_areas_usuarios.organismo_area_id";
		$sql.= " LEFT JOIN _organismos ON _organismos.organismo_id = _organismos_areas.organismo_id";
		$sql.= " WHERE _usuarios.SYSusuario = BINARY '" . "rsantiagopaz" . "' AND _usuarios.SYSpassword = '" . md5("1234") . "' AND _usuarios.SYSusuario_estado=1";
	
	
	$rs = $mysqli->query($sql);
	echo $mysqli->error;
	echo "<br/><br/>";
	while ($row = $rs->fetch_object()) {
		echo var_dump($row);
		echo "<br/><br/>";
	}


?>