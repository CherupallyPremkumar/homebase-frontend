#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Keycloak Production Hardening Script
# Applies security settings to the "homebase" realm via Admin API.
#
# Usage:
#   ./keycloak/harden-realm.sh                         # defaults: localhost:8180, admin/admin
#   KEYCLOAK_URL=https://auth.example.com \
#   KEYCLOAK_ADMIN=myadmin \
#   KEYCLOAK_ADMIN_PASSWORD=strongpass \
#     ./keycloak/harden-realm.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8180}"
ADMIN_USER="${KEYCLOAK_ADMIN:-admin}"
ADMIN_PASS="${KEYCLOAK_ADMIN_PASSWORD:-admin}"
REALM="homebase"

# ── Colours ──────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { printf "${GREEN}[OK]${NC}   %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
fail() { printf "${RED}[FAIL]${NC} %s\n" "$1"; exit 1; }

# ── Get admin token ──────────────────────────────────────────────
echo "Authenticating to Keycloak at ${KEYCLOAK_URL} ..."
TOKEN=$(curl -sf -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" \
  -d "username=${ADMIN_USER}" \
  -d "password=${ADMIN_PASS}" | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])" 2>/dev/null) \
  || fail "Could not authenticate. Check KEYCLOAK_URL/KEYCLOAK_ADMIN/KEYCLOAK_ADMIN_PASSWORD."

AUTH="Authorization: Bearer ${TOKEN}"

# Helper: PUT JSON to Keycloak admin API
kc_put() {
  local status
  status=$(curl -sf -o /dev/null -w "%{http_code}" -X PUT "${KEYCLOAK_URL}${1}" \
    -H "${AUTH}" -H "Content-Type: application/json" -d "${2}")
  [ "$status" = "204" ] || [ "$status" = "200" ]
}

# Helper: GET JSON from Keycloak admin API
kc_get() {
  curl -sf -H "${AUTH}" "${KEYCLOAK_URL}${1}"
}

# ─────────────────────────────────────────────────────────────────
# 1. Realm-level hardening
# ─────────────────────────────────────────────────────────────────
echo ""
echo "─── Realm Settings ───"

kc_put "/admin/realms/${REALM}" '{
  "sslRequired": "external",
  "verifyEmail": true,
  "ssoSessionMaxLifespan": 14400,
  "ssoSessionIdleTimeout": 1800,
  "accessTokenLifespan": 300,
  "bruteForceProtected": true,
  "permanentLockout": false,
  "maxFailureWaitSeconds": 900,
  "minimumQuickLoginWaitSeconds": 60,
  "waitIncrementSeconds": 60,
  "quickLoginCheckMilliSeconds": 1000,
  "maxDeltaTimeSeconds": 43200,
  "failureFactor": 5
}' && ok "sslRequired=external, verifyEmail=true, ssoSessionMaxLifespan=4h, brute-force hardened" \
   || fail "Could not update realm settings"

# ─────────────────────────────────────────────────────────────────
# 2. Disable directAccessGrantsEnabled on all frontend clients
# ─────────────────────────────────────────────────────────────────
echo ""
echo "─── Client Hardening ───"

FRONTEND_CLIENTS=("storefront-web" "seller-web" "platform-web" "oms-web" "finance-web" "warehouse-web" "backoffice-web")

for CLIENT_ID in "${FRONTEND_CLIENTS[@]}"; do
  # Get internal UUID
  UUID=$(kc_get "/admin/realms/${REALM}/clients?clientId=${CLIENT_ID}" \
    | python3 -c "import sys,json;clients=json.load(sys.stdin);print(clients[0]['id'] if clients else '')" 2>/dev/null)

  if [ -z "$UUID" ]; then
    warn "Client '${CLIENT_ID}' not found — skipping"
    continue
  fi

  # Disable direct access grants (ROPC)
  kc_put "/admin/realms/${REALM}/clients/${UUID}" '{
    "directAccessGrantsEnabled": false
  }' && ok "${CLIENT_ID}: directAccessGrants disabled" \
     || warn "${CLIENT_ID}: failed to disable directAccessGrants"
done

# ─────────────────────────────────────────────────────────────────
# 3. Make backoffice-web a confidential client
# ─────────────────────────────────────────────────────────────────
echo ""
echo "─── Backoffice → Confidential ───"

BO_UUID=$(kc_get "/admin/realms/${REALM}/clients?clientId=backoffice-web" \
  | python3 -c "import sys,json;clients=json.load(sys.stdin);print(clients[0]['id'] if clients else '')" 2>/dev/null)

if [ -n "$BO_UUID" ]; then
  kc_put "/admin/realms/${REALM}/clients/${BO_UUID}" '{
    "publicClient": false,
    "clientAuthenticatorType": "client-secret"
  }' && ok "backoffice-web: now confidential (publicClient=false)" \
     || warn "backoffice-web: failed to make confidential"

  # Retrieve the generated secret
  BO_SECRET=$(kc_get "/admin/realms/${REALM}/clients/${BO_UUID}/client-secret" \
    | python3 -c "import sys,json;print(json.load(sys.stdin).get('value',''))" 2>/dev/null)
  if [ -n "$BO_SECRET" ]; then
    echo "  backoffice-web client secret: ${BO_SECRET}"
    echo "  (Add this to backoffice .env.local as KEYCLOAK_CLIENT_SECRET)"
  fi
else
  warn "backoffice-web not found"
fi

# ─────────────────────────────────────────────────────────────────
# 4. Summary
# ─────────────────────────────────────────────────────────────────
echo ""
echo "─── Production Reminders (manual) ───"
echo "  1. Change Keycloak admin password:  ${KEYCLOAK_URL}/admin → Users → admin → Credentials"
echo "  2. Update redirectUris + webOrigins on each client to your production domains"
echo "  3. Put Keycloak behind HTTPS (TLS termination at reverse proxy)"
echo "  4. Add rate limiting via nginx/Cloudflare/WAF"
echo "  5. Consider enabling MFA for backoffice-web and platform-web"
echo ""
ok "Keycloak hardening complete"
