#!/bin/bash
# 🧪 Test Commands for NeoTravel Chat Integration

# Couleurs pour le terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 NeoTravel n8n + Airtable Integration Tests${NC}\n"

# =====================================================
# STEP 1: Test du Webhook n8n
# =====================================================
echo -e "${YELLOW}[1/3] Testing n8n Webhook...${NC}"
echo -e "Replace YOUR_WEBHOOK_ID with your actual webhook ID\n"

# Copier-coller cette commande:
WEBHOOK_URL="https://manon59118.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID"

echo -e "${BLUE}Command to run:${NC}"
echo "curl -X POST $WEBHOOK_URL \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"message\": \"Je cherche un car pour 30 personnes de Lyon à Paris le 15 juillet\","
echo "    \"session_id\": \"test_123\""
echo "  }'"
echo ""

# =====================================================
# STEP 2: Démarrer le Frontend
# =====================================================
echo -e "${YELLOW}[2/3] Starting Next.js Frontend...${NC}\n"

echo -e "${BLUE}Commands to run:${NC}"
echo "cd /Users/manon/Claude/Projects/Neotravel/code/frontend"
echo "npm run dev"
echo ""
echo -e "${GREEN}✅ Frontend will be available at: http://localhost:3000${NC}\n"

# =====================================================
# STEP 3: Vérifier les variables d'environnement
# =====================================================
echo -e "${YELLOW}[3/3] Checking Environment Variables...${NC}\n"

# Vérifier le fichier .env.local
ENV_FILE="/Users/manon/Claude/Projects/Neotravel/code/.env.local"

if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
    echo ""
    echo "Current configuration:"
    echo "---"
    cat "$ENV_FILE"
    echo "---"
    echo ""
    
    # Vérifier que NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL est configurée
    if grep -q "NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL" "$ENV_FILE"; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL is configured${NC}"
        WEBHOOK_VALUE=$(grep "NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL" "$ENV_FILE" | cut -d'=' -f2)
        if [[ $WEBHOOK_VALUE == *"YOUR_WEBHOOK_ID"* ]]; then
            echo -e "${YELLOW}⚠️  IMPORTANT: Replace YOUR_WEBHOOK_ID with your actual webhook ID${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL is NOT configured${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local does not exist${NC}"
    echo "Create it with:"
    echo "touch $ENV_FILE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 Complete Checklist:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

echo "[ ] 1. Open n8n dashboard"
echo "     https://manon59118.app.n8n.cloud/workflow/GIfzs5baiYfJXpZL"
echo ""
echo "[ ] 2. Follow N8N_STEP_BY_STEP.md to configure:"
echo "     - OpenAI Credential"
echo "     - Airtable Credential"
echo "     - Webhook node"
echo "     - AI Agent"
echo "     - Airtable integration"
echo "     - Webhook response"
echo ""
echo "[ ] 3. Copy the webhook URL from n8n"
echo ""
echo "[ ] 4. Update .env.local:"
echo "     NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL=<your_webhook_url>"
echo ""
echo "[ ] 5. Start the frontend:"
echo "     cd frontend && npm run dev"
echo ""
echo "[ ] 6. Test at http://localhost:3000"
echo ""
echo "[ ] 7. Send test message in chat widget"
echo ""
echo "[ ] 8. Verify in Airtable:"
echo "     https://airtable.com/apptD8AlV6sQFrIOI"
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 All set! Follow the guide and you're good to go!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}\n"
