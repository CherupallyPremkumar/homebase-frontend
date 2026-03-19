<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Update Password &mdash; HomeBase</title>
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
                <p class="subtitle">Choose a new password</p>
            </div>

            <#if message?has_content>
                <div class="alert alert-${message.type}">
                    ${kcSanitize(message.summary)?no_esc}
                </div>
            </#if>

            <form action="${url.loginAction}" method="post">
                <input type="text" id="username" name="username" value="${username}"
                       autocomplete="username" readonly="readonly" style="display:none;">

                <div class="form-group">
                    <label for="password-new">${msg("passwordNew")}</label>
                    <input type="password" id="password-new" name="password-new"
                           autocomplete="new-password" autofocus placeholder="Min 8 characters">
                </div>

                <div class="form-group">
                    <label for="password-confirm">${msg("passwordConfirm")}</label>
                    <input type="password" id="password-confirm" name="password-confirm"
                           autocomplete="new-password" placeholder="Re-enter new password">
                </div>

                <#if isAppInitiatedAction??>
                    <button type="submit" class="btn-primary">${msg("doSubmit")}</button>
                    <a href="${url.loginAction}" class="btn-link" style="display:block;text-align:center;margin-top:12px;">
                        ${msg("doCancel")}
                    </a>
                <#else>
                    <button type="submit" class="btn-primary">${msg("doSubmit")}</button>
                </#if>
            </form>
        </div>

        <p class="footer">&copy; 2026 HomeBase. All rights reserved.</p>
    </div>
</body>
</html>
