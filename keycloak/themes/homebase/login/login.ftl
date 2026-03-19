<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
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
                <p class="subtitle">Sign in to your account</p>
            </div>

            <#if message?has_content>
                <div class="alert alert-${message.type}">
                    ${kcSanitize(message.summary)?no_esc}
                </div>
            </#if>

            <#if realm.password>
                <form action="${url.loginAction}" method="post">
                    <div class="form-group">
                        <label for="username">${msg("usernameOrEmail")}</label>
                        <#if usernameEditDisabled??>
                            <input type="text" id="username" name="username" value="${(login.username!'')}"
                                   disabled autocomplete="username" placeholder="Enter your email">
                        <#else>
                            <input type="text" id="username" name="username" value="${(login.username!'')}"
                                   autocomplete="username" autofocus placeholder="Enter your email">
                        </#if>
                    </div>

                    <div class="form-group">
                        <label for="password">
                            ${msg("password")}
                            <#if realm.resetPasswordAllowed>
                                <a href="${url.loginResetCredentialsUrl}" class="forgot-link">Forgot password?</a>
                            </#if>
                        </label>
                        <input type="password" id="password" name="password"
                               autocomplete="current-password" placeholder="Enter your password">
                    </div>

                    <#if realm.rememberMe && !usernameEditDisabled??>
                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="rememberMe" name="rememberMe"
                                   <#if login.rememberMe??>checked</#if>>
                            <label for="rememberMe">Remember me</label>
                        </div>
                    </#if>

                    <input type="hidden" id="id-hidden-input" name="credentialId" />
                    <button type="submit" class="btn-primary">${msg("doLogIn")}</button>
                </form>
            </#if>

            <#if realm.password && social.providers??>
                <div class="social-divider">
                    <span>or continue with</span>
                </div>
                <div class="social-buttons">
                    <#list social.providers as p>
                        <a href="${p.loginUrl}" class="btn-social" id="social-${p.alias}">
                            ${p.displayName!}
                        </a>
                    </#list>
                </div>
            </#if>

            <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                <p class="register-link">
                    ${msg("noAccount")}
                    <a href="${url.registrationUrl}">${msg("doRegister")}</a>
                </p>
            </#if>
        </div>

        <p class="footer">&copy; 2026 HomeBase. All rights reserved.</p>
    </div>
</body>
</html>
