<?php
session_start();

set_time_limit(0);

require('Conexion.php');

$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");


switch ($_REQUEST['rutina']) {
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



case "hoja_cargo" : {
	
	$sql = "SELECT";
	$sql.= "  hoja_cargo.*";
	$sql.= ", proveedor.descrip AS proveedor_descrip";
	$sql.= ", uni_presu.descrip AS uni_presu_descrip";
	$sql.= " FROM hoja_cargo INNER JOIN proveedor USING(id_proveedor) INNER JOIN uni_presu USING(id_uni_presu)";
	$sql.= " WHERE id_hoja_cargo=" . $_REQUEST['id_hoja_cargo'];
	
	$rs = $mysqli->query($sql);
	$row = $rs->fetch_object();
	
	if ($row->estado == "C") {
		$sql = "SELECT";
		$sql.= " hoja_movimiento_item.guarda_custodia";
		$sql.= " FROM hoja_cargo_item INNER JOIN bien USING(id_hoja_cargo_item) INNER JOIN hoja_movimiento_item USING(id_bien)";
		$sql.= " WHERE id_hoja_cargo=" . $_REQUEST['id_hoja_cargo'];
		
		$rsHoja_movimiento_item = $mysqli->query($sql);
		$rowHoja_movimiento_item = $rsHoja_movimiento_item->fetch_object();
	} else {
		$rowHoja_movimiento_item = new stdClass;
		$rowHoja_movimiento_item->guarda_custodia = "";
	}
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Hoja de <?php echo ($row->estado == "V") ? "Verificación" : "Cargo"; ?></title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="5" cellspacing="0" width="800" align="center">
	<tr><td align="center" colspan="10"><big><b>Dirección de Compras - Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>Municipalidad de Santiago del Estero</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>HOJA DE <?php echo ($row->estado == "V") ? "VERIFICACIÓN" : "CARGO"; ?></b></big></td></tr>
	<tr><td align="center" colspan="10"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><th>Uni.presu.</th><th>Proveedor</th><th>F.factura</th><th>Nro.factura</th></tr>
	<tr>
		<td align="center"><?php echo $row->uni_presu_descrip; ?></td>
		<td align="center"><?php echo $row->proveedor_descrip; ?></td>
		<td align="center"><?php echo $row->fecha_factura; ?></td>
		<td align="center"><?php echo $row->nro_factura; ?></td>
	</tr>
	<tr><td>&nbsp;</td></tr>
	<tr><th>Expte.compra</th><th>Expte.cobro</th><th>Guardia custodia</th><th>Usuario</th></tr>
	<tr>
		<td align="center"><?php echo $row->expte_compra; ?></td>
		<td align="center"><?php echo $row->expte_cobro; ?></td>
		<td align="center"><?php echo $rowHoja_movimiento_item->guarda_custodia; ?></td>
		<td align="center"><?php echo ($row->estado == "V") ? $row->usuario_verific : $row->usuario_carga; ?></td>
	</tr>
	<?php
	
	?>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="20">
	<table border="1" cellpadding="5" cellspacing="0" width="100%" align="center">
	
	<tr><th>Item</th><th>Cantidad</th><th>Descripción</th><th>Tipo bien</th></tr>
	<?php
	
	$contador = 0;
	
	$sql = "SELECT";
	$sql.= "  hoja_cargo_item.*";
	$sql.= ", tipo_bien.descrip AS tipo_bien_descrip";
	$sql.= " FROM hoja_cargo_item INNER JOIN tipo_bien USING(id_tipo_bien)";
	$sql.= " WHERE id_hoja_cargo=" . $_REQUEST['id_hoja_cargo'];
	
	$rs = $mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$contador+= 1;
		
		?>
		<tr><td align="center"><?php echo $contador; ?></td><td align="center"><?php echo $row->cantidad; ?></td><td><?php echo $row->descrip; ?></td><td><?php echo $row->tipo_bien_descrip; ?></td></tr>
		<?php
	}
		
	?>
	</table>
	</td></tr>
	
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="2" align="center">----------------------------------------</td></tr>
	<tr><td colspan="2" align="center">Firma y sello</td></tr>
	
	
	</table>
	</body>
	</html>
	<?php
	
break;
}



case "hoja_movimiento" : {
	
	$sql = "SELECT";
	$sql.= "  hoja_movimiento.*";
	$sql.= ", uni_presu.descrip AS uni_presu_descrip";
	$sql.= " FROM hoja_movimiento LEFT JOIN uni_presu USING(id_uni_presu)";
	$sql.= " WHERE TRUE";
	if (isset($_REQUEST['id_hoja_movimiento'])) {
		$sql.= "  AND id_hoja_movimiento=" . $_REQUEST['id_hoja_movimiento'];
	}
	
	$rs = $mysqli->query($sql);
	$row = $rs->fetch_object();
	
	if ($row->tipo_movimiento == "A") $tipo_movimiento = "Alta"; else if ($row->tipo_movimiento == "M") $tipo_movimiento = "Movimiento"; else if ($row->tipo_movimiento == "B") $tipo_movimiento = "Baja";
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Hoja de Movimiento</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="5" width="800" align="center">
	<tr><td align="center" colspan="10"><big><b>Dirección de Compras - Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>Municipalidad de Santiago del Estero</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>HOJA DE MOVIMIENTO</b></big></td></tr>
	<tr><td align="center" colspan="10"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><th>F.movimiento</th><th>Uni.presu.</th><th>Expte.autoriza</th><th>Usuario</th><th>Accion</th></tr>
	<tr>
		<td align="center"><?php echo $row->fecha_movimiento; ?></td>
		<td align="center"><?php echo $row->uni_presu_descrip; ?></td>
		<td align="center"><?php echo $row->expte_autoriza; ?></td>
		<td align="center"><?php echo $row->usuario_movimiento; ?></td>
		<td align="center"><?php echo $tipo_movimiento; ?></td>
	</tr>
	<?php
	
	?>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="20">
	<table border="1" cellpadding="5" cellspacing="0" width="100%" align="center">
	
	
	<tr><th>Item</th><th>Descripción</th><th>Tipo bien</th><th>Cod.barra</th><th>Nro.serie</th><th>Guarda custodia</th></tr>
	<?php
	
	$contador = 0;
	
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
	$sql.= " WHERE hoja_movimiento.id_hoja_movimiento=" . $_REQUEST['id_hoja_movimiento'];
	
	$rs = $mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		$contador+= 1;
		
		?>
		<tr><td align="center"><?php echo $contador; ?></td><td><?php echo $row->descrip; ?></td><td><?php echo $row->tipo_bien_descrip; ?></td><td><?php echo $row->id_bien; ?></td><td><?php echo $row->nro_serie; ?></td><td><?php echo $row->guarda_custodia; ?></td></tr>
		<?php
	}
		
	?>
	</table>
	</td></tr>
	
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="2" align="center">----------------------------------------</td></tr>
	<tr><td colspan="2" align="center">Firma y sello</td></tr>
	
	
	</table>
	</body>
	</html>
	<?php
	
break;
}



case "listado_movimiento" : {
	
	$periodo = "";
	
	$sql = "SELECT";
	$sql.= "  hoja_movimiento.*";
	$sql.= ", uni_presu.descrip AS uni_presu_descrip";
	$sql.= " FROM hoja_movimiento LEFT JOIN uni_presu USING(id_uni_presu)";
	$sql.= " WHERE TRUE";
	if (isset($_REQUEST['tipo_movimiento'])) {
		$sql.= "  AND tipo_movimiento='" . $_REQUEST['tipo_movimiento'] . "'";
	}
	if (isset($_REQUEST['desde'])) {
		$sql.= "  AND DATE(fecha_movimiento) >='" . $_REQUEST['desde'] . "'";
		
		$periodo.= " desde " . $_REQUEST['desde'];
	}
	if (isset($_REQUEST['hasta'])) {
		$sql.= "  AND DATE(fecha_movimiento) <='" . $_REQUEST['hasta'] . "'";
		
		$periodo.= " hasta " . $_REQUEST['hasta'];
	}
	
	$rsHoja_movimiento = $mysqli->query($sql);
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado de Movimiento</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="5" width="800" align="center">
	<tr><td align="center" colspan="10"><big><b>Dirección de Compras - Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>Municipalidad de Santiago del Estero</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>LISTADO DE MOVIMIENTO</b></big></td></tr>
	<tr><td align="center" colspan="10"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10">Periodo:<?php echo $periodo; ?></td></tr>
	<?php
	
	if (isset($_REQUEST['tipo_movimiento'])) {
		if ($_REQUEST['tipo_movimiento'] == "A") $tipo_movimiento = "Alta"; else if ($_REQUEST['tipo_movimiento'] == "M") $tipo_movimiento = "Movimiento"; else if ($_REQUEST['tipo_movimiento'] == "B") $tipo_movimiento = "Baja";
		?>
		<tr><td align="center" colspan="10">ACCIÓN: <big><?php echo $tipo_movimiento; ?></big></td></tr>
		<?php
	}
	
	while ($rowHoja_movimiento = $rsHoja_movimiento->fetch_object()) {
		if ($rowHoja_movimiento->tipo_movimiento == "A") $tipo_movimiento = "Alta"; else if ($rowHoja_movimiento->tipo_movimiento == "M") $tipo_movimiento = "Movimiento"; else if ($rowHoja_movimiento->tipo_movimiento == "B") $tipo_movimiento = "Baja";
		
		
		?>
		<tr><td>&nbsp;</td></tr>
		<tr><td colspan="20"><hr/></td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><th>F.movimiento</th><th>Uni.presu.</th><th>Expte.autoriza</th><th>Usuario</th><th>Acción</th></tr>
		<tr>
			<td align="center"><?php echo $rowHoja_movimiento->fecha_movimiento; ?></td>
			<td align="center"><?php echo $rowHoja_movimiento->uni_presu_descrip; ?></td>
			<td align="center"><?php echo $rowHoja_movimiento->expte_autoriza; ?></td>
			<td align="center"><?php echo $rowHoja_movimiento->usuario_movimiento; ?></td>
			<td align="center"><?php echo $tipo_movimiento; ?></td>
		</tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td colspan="20">
		<table border="1" cellpadding="5" cellspacing="1" width="100%" align="center">
		
		
		<tr><th>Item</th><th>Descripción</th><th>Tipo bien</th><th>Cod.barra</th><th>Nro.serie</th><th>Guarda custodia</th></tr>
		<?php
		
		$contador = 0;
		
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
		$sql.= " WHERE hoja_movimiento.id_hoja_movimiento=" . $rowHoja_movimiento->id_hoja_movimiento;
		
		$rs = $mysqli->query($sql);
		while ($row = $rs->fetch_object()) {
			$contador+= 1;
			
			?>
			<tr><td align="center"><?php echo $contador; ?></td><td><?php echo $row->descrip; ?></td><td><?php echo $row->tipo_bien_descrip; ?></td><td><?php echo $row->id_bien; ?></td><td><?php echo $row->nro_serie; ?></td><td><?php echo $row->guarda_custodia; ?></td></tr>
			<?php
		}
		?>
		</table>
		</td></tr>
		<?php
	}
		
	?>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="20"><hr/></td></tr>
	
	
	</table>
	</body>
	</html>
	<?php
	
break;
}



case "historial_bien" : {
	
	
	$sql = "SELECT";
	$sql.= "   bien.*";
	$sql.= " , hoja_cargo_item.descrip";
	$sql.= " , tipo_bien.descrip AS tipo_bien_descrip";
	$sql.= " FROM bien INNER JOIN hoja_cargo_item USING(id_hoja_cargo_item) INNER JOIN tipo_bien USING(id_tipo_bien)";
	$sql.= " WHERE id_bien=" . $_REQUEST['id_bien'];
	//$sql.= " ORDER BY descrip, tipo_bien_descrip, id_bien";
	
	$rsBien = $mysqli->query($sql);
	$rowBien = $rsBien->fetch_object()
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Historial bien</title>
	</head>
	<body>
	<input type="submit" value="Imprimir" onClick="window.print();"/>
	<table border="0" cellpadding="0" cellspacing="5" width="800" align="center">
	<tr><td align="center" colspan="10"><big><b>Dirección de Compras - Parque Automotor</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>Municipalidad de Santiago del Estero</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="10"><big><b>HISTORIAL BIEN</b></big></td></tr>
	<tr><td align="center" colspan="10"><big><?php echo date("Y-m-d H:i:s"); ?></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><th>Descripción</th><th>Tipo bien</th><th>Cod.barra</th><th>Nro.serie</th><th>Cód.QR</th></tr>
	<tr>
		<td align="center"><?php echo $rowBien->descrip; ?></td>
		<td align="center"><?php echo $rowBien->tipo_bien_descrip; ?></td>
		<td align="center"><?php echo $rowBien->id_bien; ?></td>
		<td align="center"><?php echo $rowBien->nro_serie; ?></td>
		<td align="center"><?php echo $rowBien->codigo_qr; ?></td>
	</tr>
	<?php
	
	?>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="20">
	<table border="1" cellpadding="5" cellspacing="0" width="100%" align="center">
	
	
	<tr><th>F.movimiento</th><th>Uni.presu.</th><th>Expte.autoriza</th><th>Usuario</th><th>Acción</th><th>Guarda custodia</th></tr>
	<?php
	
	/*
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
	$sql.= " WHERE hoja_movimiento.id_hoja_movimiento=" . $_REQUEST['id_hoja_movimiento'];
	*/
	
	
	$sql = "SELECT";
	$sql.= "  *";
	$sql.= ", uni_presu.descrip AS uni_presu_descrip";
	$sql.= " FROM hoja_movimiento";
	$sql.= "  INNER JOIN hoja_movimiento_item USING(id_hoja_movimiento)";
	$sql.= "  LEFT JOIN uni_presu USING(id_uni_presu)";
	$sql.= " WHERE id_bien=" . $_REQUEST['id_bien'];
	
	$rs = $mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		if ($row->tipo_movimiento == "A") $tipo_movimiento = "Alta"; else if ($row->tipo_movimiento == "M") $tipo_movimiento = "Movimiento"; else if ($row->tipo_movimiento == "B") $tipo_movimiento = "Baja"; 

		?>
		<tr><td><?php echo $row->fecha_movimiento; ?></td><td><?php echo $row->uni_presu_descrip; ?></td><td><?php echo $row->expte_autoriza; ?></td><td><?php echo $row->usuario_movimiento; ?></td><td><?php echo $tipo_movimiento; ?></td><td><?php echo $row->guarda_custodia; ?></td></tr>
		<?php
	}
		
	?>
	</table>
	</td></tr>
	
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	
	
	</table>
	</body>
	</html>
	<?php
	
break;
}

}

?>