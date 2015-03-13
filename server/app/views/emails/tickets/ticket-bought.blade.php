<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		
		<div>
                    <p>Hola {{$user->firstName}}!</p>
<p>Aquí está tu passcode</p>

                    
                    <p><img src="{{$ticketImageUrl}}"></p>
                    <p><strong>Evento:</strong> <a href="{{$eventUrl}}">{{$eventTitle}}</a></p>
                    <p><a href="{{$ticketViewUrl}}">Mas detalles</a></p>
		</div>
	</body>
</html>
