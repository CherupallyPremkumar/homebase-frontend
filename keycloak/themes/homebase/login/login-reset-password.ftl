<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset Password &mdash; HomeBase</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${url.resourcesPath}/css/styles.css">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h1 class="brand">HomeBase</h1>
                <p class="subtitle">Reset your password</p>
            </div>

            <#if message?has_content>
                <div class="alert alert-${message.type}">
                    ${kcSanitize(message.summary)?no_esc}
                </div>
            </#if>

            <form action="${url.loginAction}" method="post">
                <div class="form-group">
                    <label for="username">${msg("usernameOrEmail")}</label>
                    <input type="text" id="username" name="username"
                           value="${(auth.attemptedUsername!'')}"
                           autocomplete="username" autofocus
                           placeholder="Enter your email address">
                </div>

                <button type="submit" class="btn-primary">${msg("doSubmit")}</button>
            </form>

            <p class="register-link">
                Remember your password?
                <a href="${url.loginUrl}">Back to sign in</a>
            </p>
        </div>

        <p class="footer">&copy; 2026 HomeBase. All rights reserved.</p>
    </div>
</body>
</html>
