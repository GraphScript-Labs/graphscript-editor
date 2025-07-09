# 🧠 GraphScript Engine (Frontend)

The **GraphScript Engine** frontend is the UI layer of the GraphScript visual scripting environment. Built using **Vite**, **React**, and **TypeScript (TSX)**, it provides an intuitive and dynamic interface for creating and interacting with logic flows using **node-based scripting**.

## 🔍 What is GraphScript (GS)?

**GraphScript (GS)** is a general-purpose **visual scripting language** that represents logic and behavior as connected nodes, forming a **graph**. Instead of writing code line-by-line, users define scripts by visually linking components like **conditions**, **actions**, **loops**, and **input/output** elements.

Each node represents a **component**, and connections between them define **execution flow**.

## 💡 What the Engine Does

The **GraphScript Engine frontend** allows users to:

- 🎛️ Visually build logic graphs using modular nodes.
- ✍️ Define custom behaviors using pre-defined components (`input`, `output`, `if`, `loop`, etc.).
- 🧩 Nest components and use node arguments that can themselves be graphs or values.
- 💾 Load/save projects seamlessly.

---

## ⚙️ Tech Stack

- **Frontend:** Vite + React + TypeScript
- **Styling:** CSS Modules / Tailwind (optional)
- **State Management:** React Context / Local State
- **Runtime:** Communicates with a backend runtime (e.g., Python engine) via API or RPC.

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm start

# Build for production
npm run build
```

## 📌 Note

This is the frontend interface only. To fully run the GraphScript Engine, it needs to be connected to a compatible GS backend runtime (e.g., Python-based interpreter) that understands and executes the logic graphs.

## ✨ Credits

Built with ❤️ by AttAditya

