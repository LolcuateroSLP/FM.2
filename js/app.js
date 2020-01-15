
var url = window.location.href;
var swLocation = '../public/service-worker.js';


if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '../service-worker.js';
    }
    navigator.serviceWorker.register( swLocation );
}


function enviarNotificacion()
{
    const notificacionOpts =
    {
        body:'Este es el cuerpo de la notificacion',
        icon:'img/icons/icon-72x72.png'
    };

    const n = new Notification('Hola mundo',notificacionOpts);

    n.onclick =()=>
    {
        console.log('Click');
    }
}


function notificarme()
{
    if(!window.Notification)
    {
        console.log("Este navegador no soporta not");
        return;
    }

    if(Notification.personaje==='granted')
    {
        enviarNotificacion();
        // new Notification('Hola Mundo° -');
    }else if(Notification.permission!=='denied' || Notification.permission==='default')
    {
        Notification.requestPermission(function(permission){

            console.log(permission);
            if(permission==='granted')
            {
                enviarNotificacion();
                // new Notification('Hola mundo°- Pregunta');
            }
        });
    }
}




notificarme();