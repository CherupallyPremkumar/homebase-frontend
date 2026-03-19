<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Info &mdash; HomeBase</title>
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
            </div>

            <#if message?has_content>
                <div class="alert alert-${message.type}">
                    ${kcSanitize(message.summary)?no_esc}
                </div>
            </#if>

            <div class="info-content">
                <#if requiredActions??>
                    <p>${msg("requiredAction.${requiredActions[0]}")}</p>
                <#else>
                    <#if pageRedirectUri?has_content>
                        <p><a href="${pageRedirectUri}" class="btn-primary">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                    <#elseif actionUri?has_content>
                        <p><a href="${actionUri}" class="btn-primary">${kcSanitize(msg("proceedWithAction"))?no_esc}</a></p>
                    <#elseif (client.baseUrl)?has_content>
                        <p><a href="${client.baseUrl}" class="btn-primary">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                    </#if>
                </#if>

                <#if skipLink??>
                <#else>
                    <a href="${url.loginUrl}" class="btn-link">Back to sign in</a>
                </#if>
            </div>
        </div>

        <p class="footer">&copy; 2026 HomeBase. All rights reserved.</p>
    </div>
</body>
</html>
