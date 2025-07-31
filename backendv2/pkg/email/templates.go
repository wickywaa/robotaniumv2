package email



const (
	EmailConfirmationTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Email Confirmation</title>
</head>
<body>
    <h2>Welcome to Robotanium!</h2>
    <p>Please confirm your email address by using the following code:</p>
    <h3>{{.ConfirmationCode}}</h3>
    <p>This code will expire in 24 hours.</p>
    <p>If you did not request this email, please ignore it.</p>
</body>
</html>
`
)