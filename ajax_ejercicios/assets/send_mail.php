<?php
    if(isset($_POST)){
        error_reporting(0); //Evita enviar errores de reporte
        //Variables del formulario
        $name = $_POST["name"];
        $mail = $_POST["mail"];
        $subject = $_POST["subject"];
        $comments = $_POST["comments"];
        
        //Variables para trabjar con la petición
        $domain = $_SERVER["HTTP_HOST"];
        $to = ""; //correo al que llegará el correo
        $subject_mail = "Contacto desde el formulario del sitio $domain: $subject";
        $message = "<p> Datos Enviados desde el formulario del sitio <b>$domain</b></p>"
                . "<ul>"
                . "<li>Nombre: <b>$name</b></li>
                <li>Email: <b>$mail</b></li>
                <li>Asunto: $subject</li>
                <li>Comentarios: $comments</li>"
                . "</ul>";
        $headers = "MIME-Version:1.0\r\n"."Content-type/html; charset=utf-8\r\n"."From: Envío Automático No Responder <no-reply@$domain>";
        
        
        $send_mail =  mail($to, $subject_mail, $message, $headers);//devuelve boolean
        
        if($send_mail){
            $res = [
                "err"  => false,
                "message" => "Tus datos han sido enviados"
            ];
        }else{
            $res = [
                "err" => true,
                "message" => "Error al enviar tus datos, intenta nuevamente"
            ];
        } 
        
        header('Content-type: application/json');
        
        echo json_encode($res);
        
        exit;
    }