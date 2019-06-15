<?php

require("phpqrcode/phpqrcode.php");
QRcode::png(urldecode($_REQUEST['code']));

?>