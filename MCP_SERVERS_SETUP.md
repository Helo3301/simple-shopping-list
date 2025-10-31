# Design & Diagramming MCP Servers - Installation Guide

## Overview

Here are three **free, open-source** MCP servers you can install to help with design and diagramming for the Simple Shopping List project.

---

## 1. Excalidraw MCP Server (RECOMMENDED)

**What it does**: Create and manipulate Excalidraw diagrams (wireframes, mockups, flowcharts) through AI.

**Cost**: FREE

### Installation

**Quick Start (No Installation)**:
```bash
npx excalidraw-mcp
```

**For Claude Code Integration**:
```bash
claude mcp add-json "excalidraw" '{"command":"npx","args":["-y","excalidraw-mcp"]}'
```

**Manual Installation (persistent)**:
```bash
npm install -g excalidraw-mcp
```

**Features**:
- Create wireframes and UI mockups
- Export to SVG, PNG, JSON
- Real-time canvas synchronization
- Element grouping and alignment

**GitHub**: https://github.com/yctimlin/mcp_excalidraw

---

## 2. Mermaid MCP Server

**What it does**: Generate Mermaid diagrams (flowcharts, sequence diagrams, class diagrams) and export to SVG.

**Cost**: FREE

### Installation Options

**Option A: Python-based (Recommended)**
```bash
pip install mermaid-mcp
```

Then configure in your Claude Desktop config:
```json
{
  "mcpServers": {
    "mermaid": {
      "command": "mermaid-mcp"
    }
  }
}
```

**Option B: Node.js-based**
```bash
npm install -g mcp-mermaid
```

**Features**:
- Create flowcharts, sequence diagrams, ER diagrams
- Export to SVG, PNG, PDF
- Validation of Mermaid syntax
- Multiple output formats

**GitHub**:
- Python: https://github.com/peng-shawn/mermaid-mcp-server
- Node: https://github.com/hustcc/mcp-mermaid

---

## 3. Figma Context MCP (Community - FREE Alternative)

**What it does**: Read Figma designs and extract layout/styling information (without paid Figma Dev Mode).

**Cost**: FREE (requires free Figma account + API token)

### Installation

**Step 1: Install via npm**
```bash
npm install -g figma-context-mcp
```

**Step 2: Get Figma API Token**
1. Go to https://www.figma.com/
2. Click your profile → Settings → Personal Access Tokens
3. Create new token (read-only access sufficient)
4. Copy token

**Step 3: Configure MCP Server**

Add to Claude Desktop config (~/.config/claude/claude_desktop_config.json):
```json
{
  "mcpServers": {
    "figma": {
      "command": "figma-context-mcp",
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

**Alternative**: Use TimHolden's implementation
```bash
npm install -g @timholden/figma-mcp-server
```

**Features**:
- Read Figma files and projects
- Extract layout information
- Get component styles
- No paid Dev Mode required

**GitHub**: https://github.com/GLips/Figma-Context-MCP

---

## BONUS: Kroki MCP Server (Multi-Diagram Support)

**What it does**: Convert multiple diagram formats (Mermaid, PlantUML, Graphviz, D2) to SVG/PNG via Kroki.io API.

**Cost**: FREE

### Installation

**Option 1: Python-based**
```bash
pip install kroki-mcp
```

**Option 2: Node.js-based**
```bash
npm install -g mcp-kroki
```

**Configure**:
```json
{
  "mcpServers": {
    "kroki": {
      "command": "mcp-kroki"
    }
  }
}
```

**Features**:
- Supports 20+ diagram formats
- Export to SVG, PNG, PDF, JPEG
- Uses Kroki.io public API (no API key needed)
- Fallback rendering options

**GitHub**: https://github.com/antoinebou12/uml-mcp

---

## Quick Setup for This Project

### Recommended Combination:

1. **Excalidraw MCP** - For hand-drawn style wireframes and mockups
2. **Mermaid MCP** - For flowcharts and system diagrams
3. **Figma MCP** (optional) - If you want to import from existing Figma designs

### One-Command Setup:

```bash
# Install Excalidraw (easiest, no config needed)
claude mcp add-json "excalidraw" '{"command":"npx","args":["-y","excalidraw-mcp"]}'

# Install Mermaid (Python)
pip install mermaid-mcp

# Install Kroki (for versatility)
pip install kroki-mcp
```

---

## Verification

To verify MCP servers are installed correctly:

1. Restart Claude Code
2. Check available MCP tools with `/mcp list` (if supported)
3. Try creating a simple diagram:
   - "Create a flowchart showing the shopping list app user flow"
   - "Draw a wireframe for the shopping view screen"

---

## Troubleshooting

**Issue**: MCP server not found
- **Solution**: Ensure npm/pip packages are installed globally
- Check PATH includes npm/pip global directories

**Issue**: Figma token invalid
- **Solution**: Regenerate token in Figma settings
- Ensure token has read permissions

**Issue**: Excalidraw not running
- **Solution**: Try `npx -y excalidraw-mcp` (forces fresh install)

---

## Usage Examples

### With Excalidraw:
```
"Create an Excalidraw wireframe for the shopping list main screen with:
- Header with back button and list name
- Department sections (Produce, Dairy, Meat)
- Items with checkboxes
- Add button in bottom right"
```

### With Mermaid:
```
"Create a Mermaid flowchart showing:
- User creates list
- User adds items
- User shops and checks off items
- User shares list"
```

### With Figma (if you have designs):
```
"Read the Figma file at [URL] and extract the color palette and component structure"
```

---

## Next Steps

After installing these servers, you can:
1. Generate visual wireframes for the app
2. Create flowcharts for user journeys
3. Export diagrams as SVG for documentation
4. Iterate on designs with AI assistance

All tools respect privacy and work locally (except Kroki which uses a public API for rendering).
