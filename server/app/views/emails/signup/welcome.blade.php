<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<div>
                    <p>Hola {{$user->firstName}}, Bienvenido a Passcode!</p>
              
                    <p><strong>Email:</strong> {{$user->email}}</p>
                    <p>Para hacer login: <a href="{{$loginUrl}}">{{$loginUrl}}</a></p>
		</div>
	</body>
</html>
