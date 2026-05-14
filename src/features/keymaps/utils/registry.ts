import type { Command, Keybinding } from "../types";

class KeymapRegistry {
    private commands = new Map<string, Command>();
    private keybindings: Keybinding[] = [];

    registerCommand(command: Command): void {
        if (this.commands.has(command.id)) {
            console.warn(`[keymaps] Command already registered: ${command.id}`);
            return;
        }

        this.commands.set(command.id, command);
    }

    unregisterCommand(commandId: string): void {
        this.commands.delete(commandId);
    }

    getCommand(commandId: string): Command | undefined {
        return this.commands.get(commandId);
    }

    getAllCommands(): Command[] {
        return Array.from(this.commands.values());
    }

    registerKeybinding(keybinding: Keybinding): void {
        const existing = this.keybindings.find(
            (kb) => kb.command === keybinding.command
        );

        if (existing && existing.source === keybinding.source) {
            console.warn(
                `[keymaps] Keybinding already exists for command: ${keybinding.command}`
            );
            return;
        }

        this.keybindings.push(keybinding);
    }

    unregisterKeybinding(commandId: string): void {
        this.keybindings = this.keybindings.filter(
            (kb) => kb.command !== commandId
        );
    }

    getKeybinding(commandId: string): Keybinding | undefined {
        return this.keybindings.find((kb) => kb.command === commandId);
    }

    getKeybindingsForKey(key: string): Keybinding[] {
        return this.keybindings.filter((kb) => kb.key === key);
    }

    getAllKeybindings(): Keybinding[] {
        return [...this.keybindings];
    }

    async executeCommand(commandId: string, args?: unknown): Promise<void> {
        const command = this.commands.get(commandId);

        if (!command) {
            console.error(`[keymaps] Command not found: ${commandId}`);
            return;
        }

        try {
            await command.execute(args);
        } catch (error) {
            console.error(
                `[keymaps] Error executing command ${commandId}:`,
                error
            );
        }
    }

    clear(): void {
        this.commands.clear();
        this.keybindings = [];
    }
}

export const keymapRegistry = new KeymapRegistry();
