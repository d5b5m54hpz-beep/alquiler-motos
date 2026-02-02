#!/bin/bash

# 🔍 Node.js Installation Checker
# Run this to see what's available on your system

echo "🔍 CHECKING NODE.JS INSTALLATION STATUS"
echo "======================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
log_info "1. Checking if Node.js is installed..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>/dev/null)
    log_success "Node.js found: $NODE_VERSION"
else
    log_error "Node.js not found in PATH"
fi

echo ""
log_info "2. Checking if npm is installed..."

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version 2>/dev/null)
    log_success "npm found: $NPM_VERSION"
else
    log_error "npm not found in PATH"
fi

echo ""
log_info "3. Checking common Node.js installation locations..."

# Check common macOS locations
if [ -f "/usr/local/bin/node" ]; then
    log_success "Node.js found at /usr/local/bin/node"
elif [ -f "/opt/homebrew/bin/node" ]; then
    log_success "Node.js found at /opt/homebrew/bin/node (Homebrew)"
elif [ -f "$HOME/.nvm/versions/node/*/bin/node" ]; then
    log_success "Node.js found via nvm"
else
    log_warning "Node.js not found in common locations"
fi

echo ""
log_info "4. Checking if you're in the project directory..."

if [ -f "package.json" ]; then
    log_success "package.json found - you're in the right directory"
else
    log_error "package.json not found - navigate to your project directory"
    echo "Current directory: $(pwd)"
fi

echo ""
log_info "5. Checking package managers..."

if command -v brew &> /dev/null; then
    log_success "Homebrew is installed"
else
    log_warning "Homebrew not found"
fi

echo ""
echo "======================================"
echo "💡 NEXT STEPS:"
echo ""

if ! command -v node &> /dev/null; then
    echo "🔧 INSTALLATION OPTIONS:"
    echo ""
    echo "📍 Option A - Official Installer (Easiest):"
    echo "   1. Go to https://nodejs.org/"
    echo "   2. Download LTS version for your OS"
    echo "   3. Run the installer"
    echo "   4. Restart terminal"
    echo ""
    echo "📍 Option B - Homebrew (macOS):"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "   brew install node"
    echo ""
    echo "📍 Option C - nvm (Version Manager):"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   source ~/.bashrc"
    echo "   nvm install --lts"
    echo "   nvm use --lts"
    echo ""
else
    echo "🎉 Node.js is installed!"
    echo "   Now try: npm run diagnose"
    echo ""
fi

echo "📞 AFTER INSTALLATION:"
echo "   node --version    # Should show v18+"
echo "   npm --version     # Should show 8+"
echo "   cd /your/project   # Navigate to project"
echo "   npm install       # Install dependencies"
echo "   npm run dev       # Start development server"
echo ""

if command -v node &> /dev/null && [ -f "package.json" ]; then
    echo "🚀 READY TO TEST:"
    echo "   Run: npm run diagnose"
    echo ""
fi