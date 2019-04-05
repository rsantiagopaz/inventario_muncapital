<?php

require("phpqrcode/phpqrcode.php");
QRcode::png($_REQUEST['code']);

?>