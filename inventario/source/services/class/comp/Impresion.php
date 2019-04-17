<?php
session_start();

set_time_limit(0);

require('Conexion.php');

$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");


switch ($_REQUEST['rutina']) {
case 'listado_ab': {
	
$sql = "SELECT bien.*, movimiento.*, oas_usuarios.SYSusuario AS usuario, tipo_alta.descrip AS tipo_alta_descrip, tipo_baja.descrip AS tipo_baja_descrip FROM (((bien INNER JOIN movimiento USING(id_bien)) INNER JOIN salud1.oas_usuarios ON movimiento.id_oas_usuario_movimiento=oas_usuarios.id_oas_usuario) LEFT JOIN tipo_alta USING(id_tipo_alta)) LEFT JOIN tipo_baja USING(id_tipo_baja) WHERE bien.organismo_area_id='" . $_REQUEST['organismo_area_id'] . "' AND tipo_movimiento='" . $_REQUEST['tipo_movimiento'] . "' AND (fecha_movimiento BETWEEN '" . $_REQUEST['desde'] . "' AND '" . $_REQUEST['hasta'] . "') ORDER BY descrip";
$rsBien = $mysqli->query($sql);
 
//$sql = "SELECT movimiento.*, oas_usuarios.SYSusuario AS usuario FROM movimiento INNER JOIN salud1.oas_usuarios ON movimiento.id_oas_usuario_movimiento=oas_usuarios.id_oas_usuario WHERE id_bien=" . $_REQUEST['id_bien'] . " ORDER BY id_movimiento";
 
?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Listado <?php echo ($_REQUEST['tipo_movimiento']=="A") ? "Altas" : "Bajas" ?></title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table border="0" cellpadding=0 cellspacing=0 width=750 height=1% align="center">
<tr><td align="center" colspan="6"><big>Listado <?php echo ($_REQUEST['tipo_movimiento']=="A") ? "Altas" : "Bajas" ?></big></td></tr>
<tr><td align="center" colspan="6"><big><?php echo $_REQUEST['desde'] . " - " . $_REQUEST['hasta'] ?></big></td></tr>
<tr><td align="center" colspan="6"><?php echo date("Y-m-d") .  " - cantidad: " . $rsBien->num_rows ?></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td colspan="10"><hr></td></tr>

<?php
	while ($rowBien = $rsBien->fetch_object()) {
		if ($_REQUEST['tipo_movimiento']=="A") {
			
		} else {
			$sql = "SELECT CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label FROM (salud1._organismos_areas_servicios INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas_servicios.id_organismo_area_servicio='" . $rowBien->id_organismo_area_servicio_origen . "'";
			$rsAux = $mysqli->query($sql);
			$rowAux = $rsAux->fetch_object();
			$rowBien->destino = $rowAux->label;
		}
?>

		<tr><td><?php echo $rowBien->descrip ?></td><td>Nro.serie: <?php echo $rowBien->nro_serie ?></td></tr>
		<tr><td>Fecha: <?php echo $rowBien->fecha_movimiento ?></td><td>Usuario: <?php echo $rowBien->usuario ?></td><td>Tipo: <?php echo ($_REQUEST['tipo_movimiento']=="A") ? $rowBien->tipo_alta_descrip : $rowBien->tipo_baja_descrip ?></td></tr>
		<tr><td colspan="10"><hr></td></tr>

<?php
	}
?>

</table>
</body>
</html>
<?php

		
break;
}



case 'inventario_OAS': {
	
$rows = array();

$sql = "SELECT * FROM bien WHERE organismo_area_id='" . $_REQUEST['organismo_area_id'] . "' AND estado=1 ORDER BY descrip";
$rsBien = $mysqli->query($sql);
while ($rowBien = $rsBien->fetch_object()) {
	$sql = "SELECT id_organismo_area_servicio_destino FROM movimiento WHERE id_bien=" . $rowBien->id_bien . " ORDER BY id_movimiento DESC LIMIT 1";
	$rsAux = $mysqli->query($sql);
	$rowAux = $rsAux->fetch_object();
	if ($rowAux->id_organismo_area_servicio_destino==$_REQUEST['id_organismo_area_servicio']) {
		$rows[] = $rowBien;
	}
}
 

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Inventario OAS</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table border="0" cellpadding=0 cellspacing=0 width=750 height=1% align="center">
<tr><td align="center" colspan="6"><big>INVENTARIO OAS</big></td></tr>
<tr><td align="center" colspan="6"><big><?php echo $_REQUEST['descrip'] ?></big></td></tr>
<tr><td align="center" colspan="6"><?php echo date("Y-m-d") .  " - cantidad: " . count($rows) ?></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td colspan="10"><hr></td></tr>

<?php
	foreach ($rows as $rowBien) {
?>

		<tr><td><?php echo $rowBien->descrip ?></td><td>Nro.serie: <?php echo $rowBien->nro_serie ?></td></tr>
		<tr><td colspan="10"><hr></td></tr>
<?php
	}
?>

</table>
</body>
</html>
<?php

		
break;
}



case 'listado_proveedor': {
	
$sql = "SELECT * FROM bien WHERE organismo_area_id='" . $_REQUEST['organismo_area_id'] . "' AND proveedor LIKE '%" . $_REQUEST['descrip'] . "%' ORDER BY descrip";
$rsBien = $mysqli->query($sql);
 

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Listado Proveedor</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table border="0" cellpadding=0 cellspacing=0 width=750 height=1% align="center">
<tr><td align="center" colspan="6"><big>LISTADO PROVEEDOR</big></td></tr>
<tr><td align="center" colspan="6"><big><?php echo $_REQUEST['descrip'] ?></big></td></tr>
<tr><td align="center" colspan="6"><?php echo date("Y-m-d") .  " - cantidad: " . $rsBien->num_rows ?></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td colspan="6"><hr></td></tr>
<tr><td>&nbsp;</td></tr>

<?php
	while ($rowBien = $rsBien->fetch_object()) {
		$sql = "SELECT id_organismo_area_servicio_destino FROM movimiento WHERE id_bien=" . $rowBien->id_bien . " ORDER BY id_movimiento DESC LIMIT 1";
		$rsAux = $mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$rowBien->id_organismo_area_servicio_destino = $rowAux->id_organismo_area_servicio_destino;
		
		$sql = "SELECT CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label FROM (salud1._organismos_areas_servicios INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas_servicios.id_organismo_area_servicio='" . $rowBien->id_organismo_area_servicio_destino . "'";
		$rsAux = $mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$rowBien->destino = $rowAux->label;
?>
		<tr><td><?php echo $rowBien->descrip ?></td><td>Nro.serie: <?php echo $rowBien->nro_serie ?></td><td>Estado: <?php echo ($rowBien->estado=="1") ? "Exist." : "Baja" ?></td></tr>
		<tr><td colspan="6">Ubicación: <?php echo $rowBien->destino ?></td></tr>
		<tr><td colspan="6"><hr></td></tr>
		<tr><td>&nbsp;</td></tr>
<?php
		
	}
?>
</table>
</body>
</html>
<?php
break;
}



case 'inventario': {
	

	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Inventario Gral.</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="10"><big><b>Dirección de Compras</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>Municipalidad de Santiago del Estero</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>INVENTARIO GRAL.</b></big></td></tr>
	<tr><td align="center" colspan="10"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<?php
	
	if (isset($_REQUEST['id_uni_presu'])) {
		$sql = "SELECT";
		$sql.= "  *";
		$sql.= " FROM uni_presu";
		$sql.= " WHERE id_uni_presu=" . $_REQUEST['id_uni_presu'];
		
		$rsAux = $mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		
		?>
		<tr><td align="center" colspan="6"><big><b><?php echo "Uni.Presu.: " . $rowAux->descrip; ?></b></big></td></tr>
		<?php
	}
	if (isset($_REQUEST['id_tipo_bien'])) {
		$sql = "SELECT";
		$sql.= "  *";
		$sql.= " FROM tipo_bien";
		$sql.= " WHERE id_tipo_bien=" . $_REQUEST['id_tipo_bien'];
		
		$rsAux = $mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		
		?>
		<tr><td align="center" colspan="6"><big><b><?php echo "Tipo bien: " . $rowAux->descrip; ?></b></big></td></tr>
		<?php
	}
	
	?>
	<tr><td>&nbsp;</td></tr>
	<?php




$id_hoja_movimiento = array();
	
$sql = "SELECT";
$sql.= " id_bien";
$sql.= " FROM bien";

$rsBien = $mysqli->query($sql);

while ($rowBien = $rsBien->fetch_object()) {
	$sql = "SELECT";
	$sql.= " id_hoja_movimiento, tipo_movimiento";
	$sql.= " FROM hoja_movimiento INNER JOIN hoja_movimiento_item USING(id_hoja_movimiento)";
	$sql.= " WHERE hoja_movimiento_item.id_bien=" . $rowBien->id_bien;
	$sql.= " ORDER BY id_hoja_movimiento DESC";
	$sql.= " LIMIT 1";
	
	$rsHoja_movimiento = $mysqli->query($sql);
	
	if ($rsHoja_movimiento->num_rows > 0) {
		$rowHoja_movimiento = $rsHoja_movimiento->fetch_object();
		if ($rowHoja_movimiento->tipo_movimiento != "B") $id_hoja_movimiento[$rowBien->id_bien] = $rowHoja_movimiento->id_hoja_movimiento;
	}
}



$sql = "CREATE TEMPORARY TABLE uni_presu_aux (id_uni_presu INT(11), id_bien INT(11))";
$mysqli->query($sql);


$sql = "SELECT";
$sql.= " uni_presu.*, hoja_movimiento.id_hoja_movimiento";
$sql.= " FROM uni_presu INNER JOIN hoja_movimiento USING(id_uni_presu)";
if (isset($_REQUEST['id_uni_presu'])) {
	$sql.= " WHERE uni_presu.id_uni_presu=" . $_REQUEST['id_uni_presu'];
}
$sql.= " ORDER BY uni_presu.descrip";

$rsUni_presu = $mysqli->query($sql);

while ($rowUni_presu = $rsUni_presu->fetch_object()) {
	$bandera = false;
	
	$sql = "TRUNCATE uni_presu_aux";
	$mysqli->query($sql);
	
	if ($aux = array_keys($id_hoja_movimiento, $rowUni_presu->id_hoja_movimiento)) {
		foreach ($aux as $id_bien) {
			$bandera = true;
			$sql = "INSERT uni_presu_aux SET id_uni_presu=" . $rowUni_presu->id_uni_presu . ", id_bien=" . $id_bien;
			$mysqli->query($sql);
		}
	}
	
	if ($bandera) {
		?>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td align="center" colspan="6"><?php echo "Uni.Presu: " . $rowUni_presu->descrip; ?></td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
				<tr><td align="center" colspan="10">
		<table border="1" cellpadding="5" cellspacing="0" width="100%" align="center">
		<tr><th>Tipo bien</th><th>Bien</th><th>Cod.barra</th><th>Cod.QR</th><th>Nro.serie</th></tr>
		<?php
		
		
		$sql = "SELECT";
		$sql.= " bien.*, hoja_cargo_item.descrip AS hoja_cargo_item_descrip, tipo_bien.descrip AS tipo_bien_descrip";
		$sql.= " FROM uni_presu_aux INNER JOIN bien USING(id_bien) INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien) INNER JOIN hoja_cargo USING(id_hoja_cargo)";
		if (isset($_REQUEST['id_tipo_bien'])) {
			$sql.= " WHERE hoja_cargo_item.id_tipo_bien=" . $_REQUEST['id_tipo_bien'];
		}
		$sql.= " ORDER BY tipo_bien.descrip, hoja_cargo_item.descrip";
		
		$rsBien = $mysqli->query($sql);
		
		while ($rowBien = $rsBien->fetch_object()) {
			?>

			<tr><td><?php echo $rowBien->tipo_bien_descrip; ?></td><td><?php echo $rowBien->hoja_cargo_item_descrip; ?></td><td><?php echo $rowBien->id_bien; ?></td><td><?php echo $rowBien->codigo_qr; ?></td><td><?php echo $rowBien->nro_serie; ?></td></tr>
			
			<?php
		}
		
		?>
		</table>
		</td></tr>
		<?php
	}
}
	
	
	
	
	
 

break;
}



case 'inventario_tipo_bien': {
	
$sql = "SELECT descrip FROM tipo_bien WHERE id_tipo_bien=" . $_REQUEST['id_tipo_bien'];
$rsTipo_bien = $mysqli->query($sql);
$rowTipo_bien = $rsTipo_bien->fetch_object();

$sql = "SELECT * FROM bien WHERE organismo_area_id='" . $_REQUEST['organismo_area_id'] . "' AND estado=1 AND id_tipo_bien=" . $_REQUEST['id_tipo_bien'] . " ORDER BY descrip";
$rsBien = $mysqli->query($sql);
 

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Inventario Tipo Bien</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table border="0" cellpadding=0 cellspacing=0 width=750 height=1% align="center">
<tr><td align="center" colspan="6"><big>INVENTARIO TIPO BIEN</big></td></tr>
<tr><td align="center" colspan="6"><big><?php echo $rowTipo_bien->descrip ?></big></td></tr>
<tr><td align="center" colspan="6"><?php echo date("Y-m-d") .  " - cantidad: " . $rsBien->num_rows ?></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td colspan="10"><hr></td></tr>

<?php
	while ($rowBien = $rsBien->fetch_object()) {
		$sql = "SELECT id_organismo_area_servicio_destino FROM movimiento WHERE id_bien=" . $rowBien->id_bien . " ORDER BY id_movimiento DESC LIMIT 1";
		$rsAux = $mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$rowBien->id_organismo_area_servicio_destino = $rowAux->id_organismo_area_servicio_destino;
		
		$sql = "SELECT CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label FROM (salud1._organismos_areas_servicios INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas_servicios.id_organismo_area_servicio='" . $rowBien->id_organismo_area_servicio_destino . "'";
		$rsAux = $mysqli->query($sql);
		$rowAux = $rsAux->fetch_object();
		$rowBien->destino = $rowAux->label;
?>
		<tr><td><?php echo $rowBien->descrip ?></td><td>Nro.serie: <?php echo $rowBien->nro_serie ?></td></tr>
		<tr><td colspan="10">Destino: <?php echo $rowBien->destino ?></td></tr>
		<tr><td colspan="10"><hr></td></tr>
<?php
		
	}
?>

</table>
</body>
</html>
<?php
break;
}



case 'hoja_de_alta': {
	
$sql = "SELECT _organismos_areas.organismo_area AS organismo_area_descrip, _servicios.denominacion AS _servicios_descrip FROM ((salud1.oas_usuarios INNER JOIN salud1._organismos_areas_servicios USING(id_organismo_area_servicio)) INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE id_oas_usuario='" . $_REQUEST['id_oas_usuario'] . "'";
$rs = $mysqli->query($sql);
$rowOAS = $rs->fetch_object();

$id_bien = json_decode($_REQUEST['id_bien']);

$sql = "SELECT bien.*, tipo_alta.descrip AS tipo_alta_descrip FROM bien INNER JOIN tipo_alta USING(id_tipo_alta) WHERE id_bien IN(" . implode(", ", $id_bien) . ")";
$rs = $mysqli->query($sql);
 

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Hoja de Alta</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table style="font-size:large;" border="0" width="850" align="center">

<tr><td align="center" colspan="10"><big>HOJA DE ALTA</big></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td>
<table border="1" rules="all" cellspacing="0" cellpadding="5" width="100%" align="center">
<tr>
<td>
	<table border="0" width="100%" align="center">
	<tr><td colspan="2">CLASIFICACION ADMINISTRATIVA</td></tr>
	<tr><td>JURIDICCION: 15</td><td>Ministerio de Salud y Desarrollo Social</td></tr>
	<tr><td>UNIDAD DE ORGANIZACIÓN:</td><td><?php echo $rowOAS->organismo_area_descrip ?></td></tr>
	<tr><td>OFICINA O SERVICIO:</td><td><?php echo $rowOAS->_servicios_descrip ?></td></tr>
	</table>
</td>
<td>
	<table border="0" width="100%" align="center">
	<tr><td colspan="2">CLASIFICACION GEOGRAFICA</td></tr>
	<tr><td>DEPARTAMENTO:</td></tr>
	<tr><td>LOCALIDAD:</td></tr>
	<tr><td>CALLE Y NUMERO:</td></tr>
	</table>
</td>
</tr>
<tr><td>CODIFICACION ( Reservado para CGP) Administrativo</td><td>Geografico</td></tr>
</table>
</td></tr>

<tr><td colspan="10">
	<table border="1" style="font-size:smaller;" rules="all" cellspacing="0" cellpadding="5" width="100%" align="center">
	<tr><td colspan="10" align="center">DETALLE</td></tr>
	<tr><th rowspan="2">Nº ORDEN</th><th rowspan="2">Cód.barra</th><th rowspan="2">DESCRIPCION Y CARACTERISTICA DEL BIEN</th><th rowspan="2">Alta prod.por</th><th rowspan="2">EXPED.Nº</th><th colspan="2">VALORES</th></tr>
	<tr><th>COSTO</th><th>Total</th></tr>
<?php
$contador = 1;
while ($row = $rs->fetch_object()) {
?>
	<tr><td align="center"><?php echo $contador ?></td><td><?php echo $row->codigo_barra ?></td><td><?php echo $row->descrip ?></td><td><?php echo $row->tipo_alta_descrip ?></td><td><?php echo $row->nro_expediente ?></td><td>&nbsp;</td><td>&nbsp;</td></tr>
<?php
	$contador = $contador + 1;
}
?>
	</table>
</td></tr>

<tr><td>&nbsp;</td></tr>
<tr><td>&nbsp;</td></tr>

<tr><td colspan="20">
<table border="0" width="100%">
<tr align="center"><td>........................</td><td>........................</td><td>........................</td></tr>
<tr align="center"><td>Director de la Reparticion</td><td>Depositario</td><td>Encargado Bienes del Estado</td></tr>
</table>
</td></tr>



</table>
</body>
</html>
<?php
break;
}



case 'hoja_de_baja': {
	
$sql = "SELECT _organismos_areas.organismo_area AS organismo_area_descrip, _servicios.denominacion AS _servicios_descrip FROM ((salud1.oas_usuarios INNER JOIN salud1._organismos_areas_servicios USING(id_organismo_area_servicio)) INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE id_oas_usuario='" . $_REQUEST['id_oas_usuario'] . "'";
$rs = $mysqli->query($sql);
$rowOAS = $rs->fetch_object();

$sql = "SELECT bien.*, tipo_baja.descrip AS tipo_baja_descrip FROM bien INNER JOIN tipo_baja USING(id_tipo_baja) WHERE id_bien=" . $_REQUEST['id_bien'];
$rs = $mysqli->query($sql);
$row = $rs->fetch_object();
 

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Hoja de Baja</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table style="font-size:large;" border="0" width="850" align="center">

<tr><td align="center" colspan="10"><big>HOJA DE BAJA</big></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td>
<table border="1" rules="all" cellspacing="0" cellpadding="5" width="100%" align="center">
<tr>
<td>
	<table border="0" width="100%" align="center">
	<tr><td colspan="2">CLASIFICACION ADMINISTRATIVA</td></tr>
	<tr><td>JURIDICCION: 15</td><td>Ministerio de Salud y Desarrollo Social</td></tr>
	<tr><td>UNIDAD DE ORGANIZACIÓN:</td><td><?php echo $rowOAS->organismo_area_descrip ?></td></tr>
	<tr><td>OFICINA O SERVICIO:</td><td><?php echo $rowOAS->_servicios_descrip ?></td></tr>
	</table>
</td>
<td>
	<table border="0" width="100%" align="center">
	<tr><td colspan="2">CLASIFICACION GEOGRAFICA</td></tr>
	<tr><td>DEPARTAMENTO:</td></tr>
	<tr><td>LOCALIDAD:</td></tr>
	<tr><td>CALLE Y NUMERO:</td></tr>
	</table>
</td>
</tr>
<tr><td>CODIFICACION ( Reservado para CGP) Administrativo</td><td>Geografico</td></tr>
</table>
</td></tr>

<tr><td colspan="10">
	<table border="1" style="font-size:smaller;" rules="all" cellspacing="0" cellpadding="5" width="100%" align="center">
	<tr><td colspan="10" align="center">DETALLE</td></tr>
	<tr><th rowspan="2">Nº ORDEN</th><th rowspan="2">Cód.barra</th><th rowspan="2">DESCRIPCION Y CARACTERISTICA DEL BIEN</th><th rowspan="2">Baja prod.por</th><th rowspan="2">EXPED.Nº</th><th rowspan="2">CANTIDAD</th><th colspan="2">VALORES</th></tr>
	<tr><th>COSTO</th><th>Total</th></tr>
	<tr><td>1</td><td><?php echo $row->codigo_barra ?></td><td><?php echo $row->descrip ?></td><td><?php echo $row->tipo_baja_descrip ?></td><td><?php echo $row->nro_expediente ?></td><td>1</td><td>&nbsp;</td><td>&nbsp;</td></tr>
	</table>
</td></tr>

<tr><td>&nbsp;</td></tr>
<tr><td>&nbsp;</td></tr>

<tr><td colspan="20">
<table border="0" width="100%">
<tr align="center"><td>........................</td><td>........................</td><td>........................</td></tr>
<tr align="center"><td>Director de la Reparticion</td><td>Depositario</td><td>Encargado Bienes del Estado</td></tr>
</table>
</td></tr>



</table>
</body>
</html>
<?php
break;
}



case 'hoja_de_cargo': {
	
$id_bien = json_decode($_REQUEST['id_bien']);
	
$sql = "SELECT _organismos_areas.organismo_area AS organismo_area_descrip, _servicios.denominacion AS _servicios_descrip FROM ((salud1.oas_usuarios INNER JOIN salud1._organismos_areas_servicios USING(id_organismo_area_servicio)) INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE id_oas_usuario='" . $_REQUEST['id_oas_usuario'] . "'";
$rs = $mysqli->query($sql);
$rowOAS = $rs->fetch_object();

//$sql = "SELECT * FROM bien INNER JOIN movimiento USING(id_bien) WHERE id_bien=" . $_REQUEST['id_bien'] . " ORDER BY id_movimiento DESC LIMIT 1";
$sql = "SELECT * FROM bien INNER JOIN movimiento USING(id_bien) WHERE id_bien=" . $id_bien[0] . " ORDER BY id_movimiento DESC LIMIT 1";
$rs = $mysqli->query($sql);
$rowMovimiento = $rs->fetch_object();

$sql = "SELECT _servicios.denominacion AS _servicios_descrip FROM salud1._organismos_areas_servicios INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas_servicios.id_organismo_area_servicio='" . $rowMovimiento->id_organismo_area_servicio_origen . "'";
$rs = $mysqli->query($sql);
$rowOrigen = $rs->fetch_object();

$sql = "SELECT _servicios.denominacion AS _servicios_descrip FROM salud1._organismos_areas_servicios INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas_servicios.id_organismo_area_servicio='" . $rowMovimiento->id_organismo_area_servicio_destino . "'";
$rs = $mysqli->query($sql);
$rowDestino = $rs->fetch_object();
 
$sql = "SELECT * FROM bien WHERE id_bien IN(" . implode(", ", $id_bien) . ")";
$rs = $mysqli->query($sql);

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Hoja de Cargo</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table style="font-size:large;" border="0" width="750" align="center">

<tr><td align="center"><img src="../../../resource/inventario/logo.png" width="60"></td></tr>
<tr><td colspan="10" style="font-size:small;">CONTADURIA GRAL. DE LA PROVINCIA</td></tr>
<tr><td colspan="10" style="font-size:small;">SANTIAGO DEL ESTERO</td></tr>
<tr><td align="center" colspan="10"><big>HOJA DE CARGO</big></td></tr>
<tr><td>&nbsp;</td></tr>
<tr style="font-size:smaller;"><td>Juridicción: 15</td><td>M. S. y D. S.</td><td>Funcionario:</td></tr>
<tr style="font-size:smaller;"><td>Unidad de Organización: </td><td><?php echo $rowOAS->organismo_area_descrip ?></td><td>Depositario: </td></tr>
<tr style="font-size:smaller;"><td>Oficina origen: </td><td><?php if (isset($rowOrigen)) echo $rowOrigen->_servicios_descrip ?></td></tr>
<tr style="font-size:smaller;"><td>Oficina destino: </td><td><?php echo $rowDestino->_servicios_descrip ?></td></tr>
<tr><td>&nbsp;</td></tr>

<tr><td colspan="20">
<table border="1" rules="all" cellspacing="0" cellpadding="5" width="100%" align="center">
<tr align="center"><th rowspan="2">FECHA</th><th rowspan="2">COD.BARRA</th><th rowspan="2">NRO.SERIE</th><th rowspan="2">DESCRIPCION</th><th colspan="2">VALORES</th></tr>
<tr align="center"><td>UNITARIO</td><td>TOTAL</td></tr>
<?php
while ($row = $rs->fetch_object()) {
?>
	<tr><td align="center"><?php echo $rowMovimiento->fecha_movimiento ?></td><td><?php echo $row->codigo_barra ?></td><td><?php echo $row->nro_serie ?></td><td><?php echo $row->descrip ?></td><td>&nbsp;</td><td>&nbsp;</td></tr>
<?php
}
?>
</table>
</td></tr>

<tr><td>&nbsp;</td></tr>
<tr><td>&nbsp;</td></tr>

<tr><td colspan="20">
<table border="0" width="100%">
<tr align="center"><td>........................</td><td>........................</td><td>........................</td></tr>
<tr align="center"><td>Director Establecimiento</td><td>Depositario</td><td>Funcionario Responsable por Cargo Bienes del Estado</td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td><U>NOTA</U></td></tr>
<tr><td colspan="10">Original: Expediente</td></tr>
<tr><td colspan="10">Duplicado: Registro de Cargo Bienes Patrimoniales</td></tr>
<tr><td colspan="10">Triplicado: Depositario</td></tr>
</table>
</td></tr>


</table>
</body>
</html>
<?php

		
break;
}



case 'historial': {
	
$sql = "SELECT bien.*, tipo_bien.descrip AS tipo_bien_descrip FROM bien INNER JOIN tipo_bien USING(id_tipo_bien) WHERE id_bien=" . $_REQUEST['id_bien'];
$rs = $mysqli->query($sql);
$row = $rs->fetch_object();

$sql = "SELECT movimiento.*, oas_usuarios.SYSusuario AS usuario FROM movimiento INNER JOIN salud1.oas_usuarios ON movimiento.id_oas_usuario_movimiento=oas_usuarios.id_oas_usuario WHERE id_bien=" . $_REQUEST['id_bien'] . " ORDER BY id_movimiento";
$rsMovimiento = $mysqli->query($sql);
 

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Historial del bien</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table border="0" cellpadding=0 cellspacing=0 width=750 height=1% align="center">
<tr><td align="center" colspan="6"><big>HISTORIAL DEL BIEN</big></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td>Descripción: <?php echo $row->descrip ?></td><td>Tipo bien: <?php echo $row->tipo_bien_descrip ?></td></tr>
<tr><td>Nro.serie: <?php echo $row->nro_serie ?></td><td>Cod.barra: <?php echo $row->codigo_barra ?></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td colspan="10">
<table border="1" rules="all" width="100%" align="center">
<?php
	while ($rowMovimiento = $rsMovimiento->fetch_object()) {
		$sql = "SELECT CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label FROM (salud1._organismos_areas_servicios INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas_servicios.id_organismo_area_servicio='" . $rowMovimiento->id_organismo_area_servicio_origen . "'";
		$rsAux = $mysqli->query($sql);
		//echo $sql;
		//echo $mysqli->error;
		
		if ($rsAux->num_rows > 0) {
			$rowAux = $rsAux->fetch_object();
			$rowMovimiento->origen = $rowAux->label;
		} else {
			$rowMovimiento->origen = "";
		}
		
		$sql = "SELECT CONCAT(_organismos_areas.organismo_area, ' - ', _servicios.denominacion) AS label FROM (salud1._organismos_areas_servicios INNER JOIN salud1._organismos_areas ON _organismos_areas_servicios.id_organismo_area=_organismos_areas.organismo_area_id) INNER JOIN salud1._servicios USING(id_servicio) WHERE _organismos_areas_servicios.id_organismo_area_servicio='" . $rowMovimiento->id_organismo_area_servicio_destino . "'";
		$rsAux = $mysqli->query($sql);
		if ($rsAux->num_rows > 0) {
			$rowAux = $rsAux->fetch_object();
			$rowMovimiento->destino = $rowAux->label;
		} else {
			$rowMovimiento->destino = "";
		}
?>
		<tr><td>
		<table border="0" width="100%" align="center">
		<tr><td>Fecha: <?php echo $rowMovimiento->fecha_movimiento ?></td><td>Usuario: <?php echo $rowMovimiento->usuario ?></td><td>Tipo mov.: <?php echo $rowMovimiento->tipo_movimiento ?></td></tr>
		<tr><td colspan="10">Origen: <?php echo $rowMovimiento->origen ?></td></tr>
		<tr><td colspan="10">Destino: <?php echo $rowMovimiento->destino ?></td></tr>
		</table>
		</td></tr>
<?php
		
	}
?>
</table>
</td></tr>
</table>
</body>
</html>
<?php

		
break;
}



case 'imprimir_codigo': {
	

if (isset($_REQUEST['id_hoja_cargo'])) {
	$sql = "SELECT bien.*, hoja_cargo_item.descrip FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) WHERE id_hoja_cargo=" . $_REQUEST['id_hoja_cargo'];
} else {
	$id_bien = json_decode($_REQUEST['id_bien']);
	$sql = "SELECT * FROM bien WHERE id_bien IN(" . implode(", ", $id_bien) . ")";	
}

$rs = $mysqli->query($sql);

?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Impresión de Códigos</title>
</head>
<body>
<input type="submit" value="Imprimir" onClick="window.print();"/>
<table border="0" cellpadding=0 cellspacing=0 width=750 height=1% align="center">

<tr><td align="center" colspan="6"><big>IMPRESIÓN DE CÓDIGOS</big></td></tr>
<tr><td>&nbsp;</td></tr>
<tr><td colspan="6"><hr></td></tr>
<?php
while ($row = $rs->fetch_object()) {
?>
	<tr><td><?php echo "Descripción: " . $row->descrip ?></td><td><?php echo "Nro.serie: " . $row->nro_serie ?></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>Código de barras</td><td>Código QR</td></tr>
	<tr><td><img src="barcode.php?code=<?php echo $row->id_bien ?>" /></td><td><img src="qrcode.php?code=<?php echo $row->codigo_qr ?>" /></td></tr>
	<tr><td colspan="6"><hr></td></tr>
<?php
}
?>
</table>
</body>
</html>
<?php

break;
}

}

?>