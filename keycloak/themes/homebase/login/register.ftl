<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Create Account &mdash; HomeBase</title>
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
                <p class="subtitle">Create your account</p>
            </div>

            <#if message?has_content>
                <div class="alert alert-${message.type}">
                    ${kcSanitize(message.summary)?no_esc}
                </div>
            </#if>

            <form action="${url.registrationAction}" method="post">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">${msg("firstName")}</label>
                        <input type="text" id="firstName" name="firstName"
                               value="${(register.formData.firstName!'')}" placeholder="John" autofocus>
                    </div>
                    <div class="form-group">
                        <label for="lastName">${msg("lastName")}</label>
                        <input type="text" id="lastName" name="lastName"
                               value="${(register.formData.lastName!'')}" placeholder="Doe">
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">${msg("email")}</label>
                    <input type="email" id="email" name="email"
                           value="${(register.formData.email!'')}" autocomplete="email" placeholder="john@example.com">
                </div>

                <#if !realm.registrationEmailAsUsername>
                    <div class="form-group">
                        <label for="username">${msg("username")}</label>
                        <input type="text" id="username" name="username"
                               value="${(register.formData.username!'')}" autocomplete="username">
                    </div>
                </#if>

                <div class="form-group">
                    <label for="password">${msg("password")}</label>
                    <input type="password" id="password" name="password"
                           autocomplete="new-password" placeholder="Min 8 characters">
                </div>

                <div class="form-group">
                    <label for="password-confirm">${msg("passwordConfirm")}</label>
                    <input type="password" id="password-confirm" name="password-confirm"
                           autocomplete="new-password" placeholder="Re-enter password">
                </div>

                <#if recaptchaRequired??>
                    <div class="form-group">
                        <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                    </div>
                </#if>

                <button type="submit" class="btn-primary">${msg("doRegister")}</button>
            </form>

            <p class="register-link">
                ${msg("backToLogin")?no_esc}
                <a href="${url.loginUrl}">${msg("doLogIn")}</a>
            </p>
        </div>

        <p class="footer">&copy; 2026 HomeBase. All rights reserved.</p>
    </div>
</body>
</html>
